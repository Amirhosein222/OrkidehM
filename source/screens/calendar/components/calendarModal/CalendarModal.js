/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext } from 'react';
import { Pressable, StyleSheet, ActivityIndicator, View } from 'react-native';
import { CalendarList } from 'react-native-calendars-persian';
import moment from 'moment-jalaali';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CalendarInfo from '../calendarInfo';

import { getDaysGroupedWithCycles } from '../../apis/apis';
import { useApi } from '../../../../libs/hooks';
import { WomanInfoContext } from '../../../../libs/context/womanInfoContext';
import { COLORS, rh, rw } from '../../../../configs';
import { useIsPeriodDay } from '../../../../libs/hooks';

import { testDates } from './testDates';
import { CALENDAR_THEME } from '../../theme';

const CalendarModal = ({ visible, closeModal, updateCal }) => {
  const isPeriodDay = useIsPeriodDay();
  const { userCalendar } = useContext(WomanInfoContext);
  const [currentMarkedDates, setCurrentMarkedDates] = useState([]);
  const [daysGpWithCycles, setDaysGpWithCycles] = useApi(() =>
    getDaysGroupedWithCycles(),
  );

  const handleCyclesGpDays = (i, cycleId) => {
    let startDay = i;
    if (
      daysGpWithCycles.data &&
      daysGpWithCycles.data.data.hasCycle[0].days[i].cycle_id === cycleId
    ) {
      startDay = startDay + 1;
    }
    return startDay;
  };

  // convert current dates from calendar api, then render on Calendar
  const handleCurrentMarkedDates = function (calendar) {
    const currentDates = {};
    calendar.map((item, index) => {
      const convertedDate = moment(item.date, 'X')
        .locale('en')
        .format('YYYY-MM-DD');
      currentDates[convertedDate] = {
        selected: true,
        marked: true,
        selectedColor:
          item.type === 'period'
            ? COLORS.primary
            : item.type === 'sex'
            ? COLORS.white
            : item.type === 'period_f'
            ? COLORS.white
            : item.type === 'ovulation_f'
            ? COLORS.darkYellow
            : item.type === 'pms'
            ? COLORS.pmsCircle
            : COLORS.darkRed,
        type: item.type,
        cycleDay: handleCyclesGpDays(index, item.cycle_id),
        selectedTextColor:
          item.type === 'sex' || item.type === 'period_f' ? '#B7AFB9' : 'white',
        borderColor:
          item.type === 'sex'
            ? COLORS.fireEngineRed
            : item.type === 'period_f'
            ? COLORS.primary
            : null,
      };
    });
    setCurrentMarkedDates(currentDates);
  };

  useEffect(() => {
    setDaysGpWithCycles();
  }, []);

  useEffect(() => {
    if (daysGpWithCycles.data && daysGpWithCycles.data.is_successful) {
      handleCurrentMarkedDates([...userCalendar]);
    }
  }, [daysGpWithCycles]);

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
            markedDates={testDates}
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
            color={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}
          />
        )}
        <CalendarInfo showBtns={false} />
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
    marginTop: rh(2),
  },
});
export default CalendarModal;
