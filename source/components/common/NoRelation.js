/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import { Text } from '../../components/common';

import { COLORS } from '../../configs';

const NoRelation = ({ navigation }) => {
  return (
    <View style={styles.noRel}>
      <Text color={COLORS.red}>شما تاکنون هیچ رابطه ای ثبت نکرده اید</Text>
      <Button
        onPress={() => navigation.navigate('ContactSpouse')}
        color={COLORS.blue}
        mode="contained"
        style={styles.btn}>
        <Text color="white">ثبت رابطه</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: '70%',
    height: 40,
    marginTop: 10,
    alignSelf: 'center',
  },
  noRel: {
    width: '100%',
    marginTop: 20,
  },
});

export default NoRelation;
