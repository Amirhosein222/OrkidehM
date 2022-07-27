/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, FlatList } from 'react-native';
import { BarChart, YAxis } from 'react-native-svg-charts';

import { Text } from '../common';
import VerticalBar from './VerticalBar';
import { COLORS } from '../../configs';

const ChartTwo = ({ chartData, route }) => {
  const RenderBars = function (item) {
    return <VerticalBar data={item.item} />;
  };
  return (
    <View style={{ height: 200, alignItems: 'center' }}>
      <FlatList data={chartData.data} horizontal renderItem={RenderBars} />
    </View>
  );
};

export default ChartTwo;
