/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

// import { PMSInfoScreen } from '../index';
import { Text } from '../../components/common';
import { COLORS } from '../../configs';

const Bars = ({ data }) => {
  const [pts, setPts] = useState(50);
  const [ast, setAst] = useState(100);

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={[styles.bar, styles.points, { width: pts }]} />
        <Text alignSelf="flex-end" color={COLORS.blue} bold>
          شما 6 بار
        </Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View
          style={[styles.bar, styles.assists, { width: ast, marginTop: 5 }]}
        />
        <Text alignSelf="flex-end" color={COLORS.dark} bold>
          همسالان 2/3
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  points: {
    backgroundColor: COLORS.blue,
  },
  assists: {
    backgroundColor: COLORS.lightBlue,
  },
  bar: {
    alignSelf: 'center',
    borderRadius: 5,
    height: 8,
    marginRight: 5,
    marginBottom: 10,
  },
});

export default Bars;
