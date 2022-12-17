/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { CalendarList } from 'react-native-calendars-persian';
import moment from 'moment-jalaali';

import CalendarInfo from './calendarInfo';

import { WomanInfoContext } from '../../../../libs/context/womanInfoContext';
import { COLORS, rh, rw } from '../../../../configs';

import { CALENDAR_THEME } from '../../styles';

const PartnerCalendar = () => {
  const { userCalendar } = useContext(WomanInfoContext);
  const [currentMarkedDates, setCurrentMarkedDates] = useState([]);

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
            ? COLORS.calPink
            : item.type === 'sex'
            ? COLORS.white
            : item.type === 'period_f'
            ? COLORS.white
            : item.type === 'ovulation_f'
            ? COLORS.darkYellow
            : item.type === 'pms'
            ? COLORS.pmsCircle
            : item.type === 'ims'
            ? COLORS.primary
            : COLORS.darkRed,
        type: item.type,
        selectedTextColor:
          item.type === 'sex' || item.type === 'period_f' ? '#B7AFB9' : 'white',
        borderColor:
          item.type === 'sex'
            ? COLORS.periodDay
            : item.type === 'period_f'
            ? COLORS.calPink
            : null,
      };
    });
    setCurrentMarkedDates(currentDates);
  };

  useEffect(() => {
    handleCurrentMarkedDates([...userCalendar]);
  }, []);

  return (
    <View style={styles.content}>
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

      <CalendarInfo showBtns={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    width: rw(100),
    backgroundColor: 'transparent',
  },
  calendar: {
    width: '100%',
    marginTop: rh(2),
  },
});
export default PartnerCalendar;
