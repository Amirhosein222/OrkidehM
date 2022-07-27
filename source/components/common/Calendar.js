/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { Text, TextInput } from '../common';
import { COLORS, WIDTH } from '../../configs';

const Calendar = ({ selectedDate = false }) => {
  const styles = StyleSheet.create({
    calendar: {
      backgroundColor: selectedDate === true ? COLORS.lightBlue : 'white',
      justifyContent: 'center',
      alignItems: 'center',
      width: '35%',
      borderRadius: 5,
      height: 40,
      margin: 5,
    },
  });
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.calendar}>
        <Text
          large
          bold
          color={selectedDate === true ? COLORS.red : COLORS.grey}>
          99/1/1
        </Text>
      </View>
    </View>
  );
};

export default Calendar;
