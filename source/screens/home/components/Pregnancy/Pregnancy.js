/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

import { Text } from '../../../../components/common';
import { COLORS, rw } from '../../../../configs';
import { numberConverter } from '../../../../libs/helpers';
import { useIsPeriodDay } from '../../../../libs/hooks';

const hobab = '../../../../assets/animations/hobab_agha.json';
const hobabw = '../../../../assets/animations/hobab_khanom.json';

const Pregnancy = ({ pregnancy }) => {
  const isPeriodDay = useIsPeriodDay();

  return (
    <View style={styles.pregnancyContainer}>
      {isPeriodDay ? (
        <LottieView
          source={require(hobabw)}
          autoPlay
          loop
          style={{
            width: 280,
            height: 280,
          }}
        />
      ) : (
        <LottieView
          source={require(hobab)}
          autoPlay
          loop
          style={{
            width: 280,
            height: 280,
          }}
        />
      )}

      <View style={styles.pregnancyPercentText}>
        <Text size={32} bold color={COLORS.white}>
          {pregnancy && numberConverter(pregnancy)}
        </Text>
        <Text size={14} bold color={COLORS.white}>
          احتمال بارداری
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pregnancyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pregnancyPercentText: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: rw(2),
  },
});

export default Pregnancy;
