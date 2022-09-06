/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { Text } from '../../components/common';

import { COLORS, rh, rw } from '../../configs';
import { WomanInfoContext } from '../../libs/context/womanInfoContext';

const NoRelation = ({ containerStyle }) => {
  const { isPeriodDay } = useContext(WomanInfoContext);
  const navigation = useNavigation();

  return (
    <View style={{ ...styles.noRel, ...containerStyle }}>
      <Text color={COLORS.textDark}>شما تاکنون هیچ رابطه ای ثبت نکرده اید</Text>
      <Button
        onPress={() => navigation.navigate('Relations')}
        color={isPeriodDay ? COLORS.rossoCorsa : COLORS.primary}
        mode="contained"
        style={styles.btn}>
        <Text color="white">ثبت رابطه</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: rw(63),
    height: 40,
    marginTop: 10,
    alignSelf: 'center',
  },
  noRel: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
});

export default NoRelation;
