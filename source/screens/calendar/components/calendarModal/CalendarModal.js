/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext } from 'react';
import { Pressable, StyleSheet, ActivityIndicator, View } from 'react-native';
import { CalendarList } from 'react-native-calendars-persian';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment-jalaali';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CalendarInfo from '../calendarInfo';
import { Button } from '../../../../components/common';

import { WomanInfoContext } from '../../../../libs/context/womanInfoContext';
import { COLORS, ICON_SIZE, rh, rw } from '../../../../configs';
import { useIsPeriodDay } from '../../../../libs/hooks';

import EditIcon from '../../../../assets/icons/btns/enabled-edit.svg';
import { CALENDAR_THEME } from '../../theme';

const CalendarModal = ({ visible, closeModal, updateCal }) => {
  const isPeriodDay = useIsPeriodDay();
  const navigation = useNavigation();
  const { userCalendar } = useContext(WomanInfoContext);
  const [currentMarkedDates, setCurrentMarkedDates] = useState([]);

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
        selectedColor: item.type === 'ims' ? COLORS.primary : COLORS.white,
        type: item.type,
        selectedTextColor: item.type === 'sex' ? '#B7AFB9' : 'white',
        borderColor: item.type === 'sex' ? COLORS.periodDay : null,
      };
    });
    setCurrentMarkedDates(currentDates);
  };

  const navigateToEditCycles = () => {
    navigation.navigate('EditCycles');
    closeModal();
  };

  useEffect(() => {
    handleCurrentMarkedDates(userCalendar);
  }, []);

  return (
    <Modal
      testID={'modal'}
      isVisible={visible}
      coverScreen={true}
      hasBackdrop={true}
      backdropOpacity={0.5}
      backdropTransitionOutTiming={1}
      backdropTransitionInTiming={0}
      animationOutTiming={0}
      animationInTiming={0}
      animationIn="slideInUp"
      onBackdropPress={closeModal}
      style={styles.modal}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Pressable
            onPress={closeModal}
            hitSlop={7}
            style={{ marginLeft: 'auto' }}>
            <Ionicons
              name="close"
              size={32}
              color={COLORS.icon}
              style={styles.closeIcon}
            />
          </Pressable>
        </View>
        {currentMarkedDates.length !== 0 ? (
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
          <ActivityIndicator
            size="large"
            color={isPeriodDay ? COLORS.periodDay : COLORS.primary}
            style={{ flex: 1 }}
          />
        )}
        <CalendarInfo showBtns={false} />

        <Button
          title="ویرایش دوره ها"
          Icon={() => <EditIcon style={ICON_SIZE} />}
          color={COLORS.borderLinkBtn}
          style={{ ...styles.btn, marginTop: rh(5), marginBottom: rh(4) }}
          onPress={() => navigateToEditCycles()}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    marginBottom: 'auto',
  },
  content: {
    alignItems: 'center',
    width: rw(100),
    height: rh(76),
    marginTop: 'auto',
    elevation: 5,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    backgroundColor: COLORS.mainBg,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: rh(2),
  },
  closeIcon: {
    alignSelf: 'flex-end',
    marginRight: rw(5),
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
export default CalendarModal;
