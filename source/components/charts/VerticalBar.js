/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { Text } from '../../components/common';
import { COLORS } from '../../configs';

const VerticalBar = ({ data = 10, text = true, color = COLORS.lightBlue }) => {
  return (
    <View style={[styles.barContainer, { margin: text === false ? 3 : 10 }]}>
      <View
        style={[
          styles.vBar,
          ,
          {
            height: Number(data) * 2,
            backgroundColor: color,
            margin: text === false ? 0 : 10,
          },
        ]}
      />
      {text ? (
        <Text color={COLORS.dark} bold>
          پریود
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  vBar: {
    height: 50,
    width: 8,
    backgroundColor: COLORS.lightBlue,
    borderRadius: 5,
    margin: 10,
  },
  barContainer: {
    margin: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  points: {
    backgroundColor: COLORS.blue,
  },
  assists: {
    backgroundColor: COLORS.lightBlue,
  },
});

export default VerticalBar;
