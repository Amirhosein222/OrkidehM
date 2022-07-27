// /* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, StatusBar, StyleSheet, Dimensions } from 'react-native';
import { ProgressBar, Colors } from 'react-native-paper';

import {
  Container,
  IconWithBg,
  Divider,
  Text,
  Image,
  RowContainer,
} from './index';

import { COLORS, WIDTH } from '../../configs';

const Bar = ({}) => {
  return (
    <View style={styles.container}>
      <Text>Loading.....</Text>
      <View style={styles.progressBar} />
      <Text>50%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  progressBar: {
    height: 20,
    width: '100%',
    backgroundColor: 'white',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 5,
  },
});

export default Bar;
