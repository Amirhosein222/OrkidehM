/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Toggle from 'react-native-toggle-element';

import Text from './Text';
import { COLORS } from '../../configs';

const Switch = ({ active, changeStatus }) => {
  return (
    <View style={styles.switchContainer}>
      <Text small color={COLORS.blue}>
        فعال
      </Text>
      <Toggle
        value={active}
        onPress={(newState) => changeStatus(newState)}
        containerStyle={{ alignSelf: 'center' }}
        trackBarStyle={{
          borderColor: 'green',
        }}
        trackBar={{
          activeBackgroundColor: '#DDCECE',
          inActiveBackgroundColor: COLORS.lightBlue,
          width: 70,
          height: 35,
        }}
        thumbButton={{
          activeBackgroundColor: COLORS.grey,
          inActiveBackgroundColor: COLORS.blue,
          width: 35,
          height: 35,
        }}
      />
      <Text small>غیر فعال</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
});

export default Switch;
