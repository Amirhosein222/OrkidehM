/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Alert,
  View,
} from 'react-native';
import { Button } from 'react-native-paper';
import { CalendarList } from 'react-native-calendars-persian';
import { CommonActions } from '@react-navigation/native';
import moment from 'moment-jalaali';

import getWomanClient from '../../libs/api/manApi';
import { convertToJalaali, getFromAsyncStorage } from '../../libs/helpers';

import {
  Container,
  Divider,
  Text,
  Header,
  Snackbar,
} from '../../components/common';
import { CalendarInfo } from '../../components/informations';
import {
  COLORS,
  rh,
  SCROLL_VIEW_CONTAINER,
  STATUS_BAR_HEIGHT,
} from '../../configs';

const CALENDAR_THEME = {
  calendarBackground: '#ffffff',
  textSectionTitleColor: COLORS.blue,
  selectedDayBackgroundColor: '#00adf5',
  selectedDayTextColor: '#ffffff',
  todayTextColor: '#00adf5',
  dayTextColor: '#2d4150',
  textDisabledColor: '#d9e1e8',
  dotColor: '#00adf5',
  selectedDotColor: '#ffffff',
  arrowColor: COLORS.blue,
  monthTextColor: COLORS.blue,
  textDayFontFamily: 'Qs_Iranyekan_bold',
  textMonthFontFamily: 'Qs_Iranyekan_bold',
  textDayHeaderFontFamily: 'Qs_Iranyekan_bold',
  textMonthFontWeight: 'bold',
  textDayFontSize: 14,
  textMonthFontSize: 14,
  textDayHeaderFontSize: 10,
};

const CalendarScreen = ({ navigation, route }) => {
  const params = route.params;
  const [currentMarkedDates, setCurrentMarkedDates] = useState([]);
  const [newMarkedDates, setNewMarkedDates] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [edit, setEdit] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newDatesForApi, setNewDatesForApi] = useState([]);
  const [info, setInfo] = useState(null);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const getCalendar = async function () {
    const womanClient = await getWomanClient();
    womanClient.get('show/calendar').then((response) => {
      if (response.data.is_successful) {
        handleCurrentMarkedDates([...response.data.data]);
      } else {
        setSnackbar({
          msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
          visible: true,
        });
      }
    });
  };

  const updateCalendar = async function (newDates) {
    setIsUpdating(true);
    const womanClient = await getWomanClient();
    womanClient
      .post('update/calendar', newDates)
      .then((response) => {
        setIsUpdating(false);
        if (response.data.is_successful) {
          if (response.data.data[1].getPeriodInfo === true) {
            setCurrentMarkedDates([]);
            getCalendar();
            setEdit(false);
            setSelectedOption(null);
            setNewMarkedDates([]);
            setNewDatesForApi([]);
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: 'EnterInfo',
                    params: { reEnter: true, name: info.display_name },
                  },
                ],
              }),
            );
          } else {
            setCurrentMarkedDates([]);
            getCalendar();
            setEdit(false);
            setSelectedOption(null);
            setNewMarkedDates([]);
            setNewDatesForApi([]);
            setSnackbar({
              msg: 'تغییرات با موفقیت اعمال شد.',
              visible: true,
              type: 'success',
            });
          }
        } else {
          setSnackbar({
            msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
            visible: true,
          });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  //get days between two dates
  function getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(stopDate);

    while (currentDate <= stopDate) {
      const jalaaliDate = convertToJalaali(
        moment(currentDate).locale('en').format('YYYY-MM-DD'),
      );
      dateArray.push({ date: jalaaliDate, type: 'period' });
      currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
  }

  //Calculate the dates differ
  const checkPeriodDaysDiff = function () {
    //get first period date added by user
    const firstAddedPeriod = newDatesForApi.find(
      (newD) => newD.type === 'period',
    );
    if (firstAddedPeriod === undefined) {
      return false;
    }
    const newDate = moment(firstAddedPeriod.date, 'jYYYY/jMM/jDD')
      .locale('en')
      .format('YYYY-MM-DD');

    //get last date from user calendar
    const currentDates = Object.entries(currentMarkedDates);
    const periodDates = [];
    currentDates.map((date) => {
      if (date[1].type === 'period') {
        periodDates.push(date[0]);
      }
    });

    const lastDate = periodDates[periodDates.length - 1];

    const a = moment(lastDate);
    const b = moment(newDate);
    const diff = b.diff(a, 'days');
    return { diff: diff, lastDate: lastDate, newDate: newDate };
  };

  const checkDatesLength = async function () {
    const diffInfo = checkPeriodDaysDiff();
    if (diffInfo === false) {
      updateCalendar(newDatesForApi);
      return;
    }
    if (diffInfo.diff === 0) {
      updateCalendar(newDatesForApi);
      return;
    } else if (diffInfo.diff >= 1 && diffInfo.diff <= 5) {
      const newDates = getDates(diffInfo.lastDate, diffInfo.newDate);
      updateCalendar(newDates);
      return;
    } else if (diffInfo.diff >= 5 && diffInfo.diff <= 12) {
      Alert.alert(
        'پیام',
        'آیا میخواهید روز های بین بازه زمانی انتخاب شده هم به عنوان روز پریود ثبت شوند؟',
        [
          {
            text: 'نه',
            onPress: () => {
              updateCalendar(newDatesForApi);
            },
            style: 'cancel',
          },
          {
            text: 'اره',
            onPress: () => {
              const newDates = getDates(diffInfo.lastDate, diffInfo.newDate);
              updateCalendar(newDates);
            },
          },
        ],
        { cancelable: false },
      );
    } else if (diffInfo.diff < 0) {
      updateCalendar(newDatesForApi);
    } else {
      setNewDatesForApi([]);
      handleSelectedOption('period');
      setSnackbar({
        msg: 'بازه زمانی بیشتر از 12 روز است، لطفا مجددا تاریخ را انتخاب کنید',
        visible: true,
      });
      return;
    }
  };

  // convert current dates from calendar api, then render on Calendar
  const handleCurrentMarkedDates = function (calendar) {
    const currentDates = {};
    calendar.map((item) => {
      const convertedDate = moment(item.date, 'X')
        .locale('en')
        .format('YYYY-MM-DD');

      currentDates[convertedDate] = {
        selected: true,
        marked: true,
        selectedColor:
          item.type === 'period'
            ? COLORS.blue
            : item.type === 'sex'
            ? COLORS.red
            : item.type === 'period_f'
            ? COLORS.orange
            : item.type === 'ovulation_f'
            ? COLORS.darkYellow
            : COLORS.darkRed,
        type: item.type,
      };
    });
    setCurrentMarkedDates(currentDates);
  };

  const handleNewMarkedDates = async function (date) {
    const selectedDate = date.dateString;
    if (moment(selectedDate).isBefore(today) === false) {
      setSnackbar({
        msg: 'شما میتوانید تاریخ را فقط تا امروز را انتخاب کنید.',
        visible: true,
      });
      return;
    }

    const today = moment().format('YYYY-MM-DD');
    const jalaaliDate = convertToJalaali(selectedDate);
    const newDates = { ...newMarkedDates };

    if (newMarkedDates[selectedDate]) {
      let removed = [...newDatesForApi];
      removed.push({ date: jalaaliDate, type: 'delete' });
      removed = removed.filter((d) => d.type !== 'period');
      delete newDates[selectedDate];
      setNewMarkedDates(newDates);
      setNewDatesForApi(removed);
    } else {
      newDates[selectedDate] = {
        selected: true,
        marked: true,
        selectedColor: selectedOption === 'period' ? COLORS.blue : COLORS.red,
      };
      const selectedDates = [...newDatesForApi];
      selectedDates.push({ date: jalaaliDate, type: selectedOption });
      setNewDatesForApi(selectedDates);
      setNewMarkedDates(newDates);
    }
  };

  const handleSelectedOption = function (selectedOpt) {
    setSelectedOption(selectedOpt);
    const currentDateskeys = Object.entries(currentMarkedDates);
    if (selectedOpt === 'period') {
      let markedDates = currentDateskeys;
      currentDateskeys.map((date) => {
        switch (date[1].type) {
          case 'period':
            markedDates[date[0]] = {
              selected: true,
              marked: true,
              selectedColor: COLORS.blue,
            };
            break;
          case 'sex':
            markedDates[date[0]] = {
              selected: true,
              marked: true,
              selectedColor: COLORS.red,
              disableTouchEvent: true,
              disabled: true,
            };
            break;
          case 'period_f':
            markedDates[date[0]] = {
              selected: true,
              marked: true,
              selectedColor: COLORS.orange,
              disableTouchEvent: true,
              disabled: true,
            };
            break;
          case 'ovulation_f':
            markedDates[date[0]] = {
              selected: true,
              marked: true,
              selectedColor: COLORS.darkYellow,
              disableTouchEvent: true,
              disabled: true,
            };
            break;
          default:
            break;
        }
      });
      setNewMarkedDates(markedDates);
    } else {
      let markedDates = currentDateskeys;
      currentDateskeys.map((date) => {
        switch (date[1].type) {
          case 'period':
            markedDates[date[0]] = {
              selected: true,
              marked: true,
              selectedColor: COLORS.blue,
              disableTouchEvent: true,
              disabled: true,
            };
            break;
          case 'sex':
            markedDates[date[0]] = {
              selected: true,
              marked: true,
              selectedColor: COLORS.red,
            };
            break;
          case 'period_f':
            markedDates[date[0]] = {
              selected: true,
              marked: true,
              selectedColor: COLORS.orange,
              disableTouchEvent: true,
              disabled: true,
            };
            break;
          case 'ovulation_f':
            markedDates[date[0]] = {
              selected: true,
              marked: true,
              selectedColor: COLORS.darkYellow,
              disableTouchEvent: true,
              disabled: true,
            };
            break;
          default:
            break;
        }
      });
      setNewMarkedDates(markedDates);
    }
  };

  const showGuide = function () {
    setSnackbar({
      msg: 'لطفا ابتدا گزینه مورد نظر جهت ویرایش تاریخ را انتخاب کنید',
      visible: true,
    });
  };

  const showEdit = function (cancel = false) {
    if (cancel === true) {
      setEdit(!edit);
      return;
    }
    showGuide();
    setEdit(!edit);
  };

  const submitNewDates = async function () {
    if (!selectedOption) {
      showGuide();
      return;
    }
    if (newDatesForApi.length === 0) {
      setSnackbar({
        msg: 'لطفا تاریخ مورد نظر را انتخاب کتید',
        visible: true,
      });
      return;
    }
    if (selectedOption === 'sex') {
      updateCalendar(newDatesForApi);
    } else {
      checkDatesLength();
    }
  };

  useEffect(() => {
    getCalendar();
    getFromAsyncStorage('fullInfo').then((res) => {
      if (res) {
        setInfo(JSON.parse(res));
      }
    });
  }, []);

  useEffect(() => {
    getCalendar();
  }, [params.updateCal]);

  return (
    <Container justifyContent="flex-start">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <ScrollView
        contentContainerStyle={SCROLL_VIEW_CONTAINER}
        style={{ width: '100%' }}>
        <Header
          navigation={navigation}
          style={{ marginTop: STATUS_BAR_HEIGHT + rh(2) }}
        />
        <Divider color={COLORS.lightBlue} width="80%" />

        {edit === true ? (
          <CalendarList
            jalali
            markedDates={newMarkedDates}
            hideExtraDays={true}
            disableMonthChange={true}
            firstDay={6}
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
        ) : currentMarkedDates.length !== 0 ? (
          <CalendarList
            jalali
            markedDates={currentMarkedDates}
            hideExtraDays={true}
            markingType="simple"
            disableMonthChange={false}
            firstDay={7}
            hideDayNames={false}
            showWeekNumbers={false}
            style={styles.calendar}
            theme={CALENDAR_THEME}
            horizontal={true}
            pagingEnabled={false}
            onDayPress={() => {}}
          />
        ) : (
          <ActivityIndicator size="large" color={COLORS.blue} />
        )}

        <CalendarInfo
          showBtns={edit}
          selectedOption={selectedOption}
          handleSelectedOption={handleSelectedOption}
        />

        {edit === true ? (
          <View style={styles.editContainer}>
            <Button
              color={COLORS.blue}
              mode="contained"
              style={[styles.btn, { width: '35%', marginRight: 10 }]}
              loading={edit && isUpdating ? true : false}
              onPress={() => submitNewDates()}>
              <Text color="white">ثبت تغییرات</Text>
            </Button>
            <Button
              color={COLORS.blue}
              mode="contained"
              style={[styles.btn, { width: '30%' }]}
              onPress={() => showEdit(true)}>
              <Text color="white">لغو</Text>
            </Button>
          </View>
        ) : (
          <Button
            color={COLORS.blue}
            mode="contained"
            style={styles.btn}
            onPress={() => showEdit()}>
            <Text color="white">ویرایش دوره ها</Text>
          </Button>
        )}
      </ScrollView>

      {snackbar.visible === true ? (
        <Snackbar
          message={snackbar.msg}
          type={snackbar.type}
          handleVisible={handleVisible}
        />
      ) : null}
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  calendar: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    marginTop: 10,
  },
  btn: {
    width: '45%',
    height: 40,
    borderRadius: 20,
    marginBottom: 10,
  },
  editContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
});

export default CalendarScreen;
