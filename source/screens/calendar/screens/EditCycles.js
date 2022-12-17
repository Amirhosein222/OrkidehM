/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { CalendarList } from 'react-native-calendars-persian';
import moment from 'moment-jalaali';
import RadioGroup from 'react-native-radio-buttons-group';

import {
  BackgroundView,
  Button,
  ScreenHeader,
  Snackbar,
} from '../../../components/common';

import { updateCalendarApi, getCalendarApi } from '../apis';
import { useApi } from '../../../libs/hooks';
import { WomanInfoContext } from '../../../libs/context/womanInfoContext';
import { convertToJalaali } from '../../../libs/helpers';

import { COLORS, ICON_SIZE, rh, rw } from '../../../configs';
import { useIsPeriodDay } from '../../../libs/hooks';
import { CALENDAR_THEME } from '../theme';

import EnabledCheck from '../../../assets/icons/btns/enabled-check.svg';

const EditCyclesScreen = () => {
  const isPeriodDay = useIsPeriodDay();
  const {
    activeRel,
    userCalendar,
    handleUserCalendar,
    handleUserPeriodDays,
  } = useContext(WomanInfoContext);
  const currentMarkedDatesRef = useRef([]);
  const [newMarkedDates, setNewMarkedDates] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [newDatesForApi, setNewDatesForApi] = useState([]);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [radioButtons, setRadioButtons] = useState([
    {
      id: '1',
      label: 'علامت زدن به عنوان رابطه زناشویی  ',
      value: 'sex',
      selected: false,
      color: COLORS.textLight,
      size: 16,
    },
  ]);
  const sortedDatesRef = useRef([]);
  const [getCalendar, setGetCalendar] = useApi(() =>
    getCalendarApi(activeRel.relId),
  );
  const [updateCalendar, setUpdatCalendar] = useApi(() =>
    updateCalendarApi(sortedDatesRef.current),
  );

  const onPressRadioButton = radioButtonsArray => {
    radioButtonsArray.map(radio => {
      if (radio.selected) {
        handleSelectedOption(radio.value);
        radio.color = isPeriodDay ? COLORS.periodDay : COLORS.primary;
      } else {
        radio.color = COLORS.textLight;
      }
    });
    setRadioButtons(radioButtonsArray);
  };

  const sortDates = function (dates) {
    dates.sort(
      (a, b) =>
        moment(a.date, 'jYYYY/jMM/jDD').diff(
          moment().startOf('day'),
          'seconds',
        ) -
        moment(b.date, 'jYYYY/jMM/jDD').diff(
          moment().startOf('day'),
          'seconds',
        ),
    );
    return dates;
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  // convert current dates from calendar api, then render on Calendar
  const handleCurrentMarkedDates = function (calendar) {
    const currentDates = {};
    calendar.map(item => {
      const convertedDate = moment(item.date, 'X')
        .locale('en')
        .format('YYYY-MM-DD');
      currentDates[convertedDate] = {
        selected: true,
        marked: true,
        selectedColor: item.type === 'sex' ? COLORS.error : COLORS.primary,
        type: item.type,
      };
    });
    currentMarkedDatesRef.current = currentDates;
    // setCurrentMarkedDates(currentDates);
  };

  const handleNewMarkedDates = async function (date) {
    const selectedDate = date.dateString;
    if (moment(selectedDate).isBefore(today) === false) {
      setSnackbar({
        msg: 'شما می توانید تاریخ را فقط تا امروز را انتخاب کنید.',
        visible: true,
      });
      return;
    }

    const today = moment().format('YYYY-MM-DD');
    const jalaaliDate = convertToJalaali(selectedDate);
    const newDates = { ...newMarkedDates };

    if (newMarkedDates[selectedDate]) {
      if (newMarkedDates[selectedDate].hasOwnProperty('dontDelete')) {
        // dont add this date with type delete to api dates object only remove it on the calendar
        delete newDates[selectedDate];
        setNewMarkedDates(newDates);
        return;
      }
      console.log('here at delete');
      let removed = [...newDatesForApi];
      removed.push({
        date: jalaaliDate,
        type: 'sex',
        action: 'delete',
      });
      delete newDates[selectedDate];
      setNewMarkedDates(newDates);
      setNewDatesForApi(removed);
    } else {
      newDates[selectedDate] = {
        selected: true,
        marked: true,
        selectedColor: COLORS.white,
        selectedTextColor: '#B7AFB9',
        borderColor: COLORS.error,
        type: selectedOption,
      };
      const selectedDates = [...newDatesForApi];
      selectedDates.push({
        date: jalaaliDate,
        type: selectedOption,
        action: 'create',
      });
      setNewDatesForApi(selectedDates);
      setNewMarkedDates(newDates);
    }
  };

  const handleSelectedOption = function (selectedOpt) {
    setSelectedOption(selectedOpt);
    const currentDateskeys = Object.entries(currentMarkedDatesRef.current);
    let markedDates = currentDateskeys;
    currentDateskeys.map(date => {
      switch (date[1].type) {
        case 'ims':
          markedDates[date[0]] = {
            selected: true,
            marked: true,
            selectedColor: COLORS.primary,
            selectedTextColor: 'white',
            disableTouchEvent: true,
            disabled: true,
            type: 'period',
          };
          break;
        case 'sex':
          markedDates[date[0]] = {
            selected: true,
            marked: true,
            selectedColor: COLORS.white,
            selectedTextColor: '#B7AFB9',
            borderColor: COLORS.error,
            type: 'sex',
          };
          break;
        default:
          break;
      }
    });
    setNewMarkedDates(markedDates);
  };

  const showGuide = function () {
    setSnackbar({
      msg: 'لطفا ابتدا گزینه مورد نظر جهت ویرایش تاریخ را انتخاب کنید',
      visible: true,
    });
  };

  const submitNewDates = async function () {
    if (!selectedOption) {
      showGuide();
      return;
    }
    if (newDatesForApi.length === 0) {
      setSnackbar({
        msg: 'لطفا تاریخ مورد نظر را انتخاب کنید',
        visible: true,
      });
      return;
    }
    sortedDatesRef.current = sortDates(newDatesForApi);
    setUpdatCalendar();
  };

  useEffect(() => {
    if (userCalendar) {
      handleCurrentMarkedDates([...userCalendar]);
    }

    return () => {
      setSelectedOption();
      setNewMarkedDates();
      setNewDatesForApi();
    };
  }, []);

  useEffect(() => {
    if (updateCalendar.data && updateCalendar.data.is_successful) {
      setNewMarkedDates([]);
      setNewDatesForApi([]);
      setGetCalendar();
      setSnackbar({
        msg: 'تغییرات با موفقیت اعمال شد.',
        visible: true,
        type: 'success',
      });
    }

    if (updateCalendar.data && !updateCalendar.data.is_successful) {
      setGetCalendar();
      setSnackbar({
        msg: JSON.stringify(updateCalendar.data.message),
        visible: true,
        delay: 5000,
      });
    }
  }, [updateCalendar]);

  useEffect(() => {
    if (getCalendar.data && getCalendar.data.is_successful) {
      const periodDays = getCalendar.data.data.filter(d => d.type === 'period');
      handleUserPeriodDays(periodDays);
      handleUserCalendar(getCalendar.data.data);
      handleCurrentMarkedDates([...getCalendar.data.data]);
      handleSelectedOption(selectedOption);
    }

    if (getCalendar.data && !getCalendar.data.is_successful) {
      setSnackbar({
        msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
        visible: true,
      });
    }
  }, [getCalendar]);

  return (
    <BackgroundView>
      <ScreenHeader title="ویرایش دوره ها" />
      <View
        style={{
          marginTop: rh(8),
          width: '100%',
          height: rh(62),
        }}>
        <CalendarList
          jalali
          markedDates={newMarkedDates}
          hideExtraDays={true}
          disableMonthChange={true}
          firstDay={7}
          hideDayNames={false}
          showWeekNumbers={false}
          style={styles.calendar}
          theme={CALENDAR_THEME}
          markingType="simple"
          horizontal={true}
          pagingEnabled={false}
          onDayPress={
            selectedOption
              ? (day, localDay) => {
                  handleNewMarkedDates(day);
                }
              : () => showGuide()
          }
        />

        <RadioGroup
          radioButtons={radioButtons}
          onPress={onPressRadioButton}
          isPeriodDay={isPeriodDay}
          containerStyle={{ marginBottom: rh(2) }}
        />
      </View>

      <Button
        color={isPeriodDay ? COLORS.periodDay : COLORS.primary}
        title="ذخیره"
        mode="contained"
        style={{
          width: rw(80),
          marginTop: 'auto',
          marginBottom: rh(3),
          height: 40,
        }}
        loading={updateCalendar.isFetching}
        disabled={updateCalendar.isFetching}
        onPress={() => submitNewDates()}
        Icon={() => <EnabledCheck style={ICON_SIZE} />}
      />
      {snackbar.visible === true ? (
        <Snackbar
          message={snackbar.msg}
          type={snackbar.type}
          delay={snackbar?.delay}
          handleVisible={handleVisible}
        />
      ) : null}
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    marginBottom: 'auto',
  },
  calendar: {
    width: '100%',
  },
  btn: {
    width: '80%',
    height: 40,
    borderRadius: 20,
    marginBottom: 10,
  },
});
export default EditCyclesScreen;
