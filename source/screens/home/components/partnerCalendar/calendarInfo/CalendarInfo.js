/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Text } from '../../../../../components/common';
import { COLORS, rh, rw } from '../../../../../configs';

const CalendarInfo = ({}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View
          style={{
            ...styles.allTipsContainer,
          }}>
          <View style={styles.tipContainer}>
            <Text size={8} color={COLORS.textLight} small marginRight={rw(2)}>
              دوره پریودی
            </Text>
            <MaterialCommunityIcons
              name="circle"
              color={COLORS.calPink}
              size={14}
            />
          </View>

          <View style={{ ...styles.tipContainer }}>
            <Text size={8} color={COLORS.textLight} small marginRight={rw(2)}>
              تخمک گذاری
            </Text>
            <MaterialCommunityIcons
              name="circle"
              color={COLORS.darkYellow}
              size={14}
              style={{ marginRight: rw(0) }}
            />
          </View>
        </View>

        <View style={styles.allTipsContainer}>
          <View style={{ ...styles.tipContainer }}>
            <Text size={8} color={COLORS.textLight} small marginRight={rw(2)}>
              سکس
            </Text>
            <View
              style={{
                borderWidth: 3,
                borderColor: COLORS.periodDay,
                borderRadius: 30,
              }}>
              <MaterialCommunityIcons
                name="circle"
                color={COLORS.white}
                size={8}
              />
            </View>
          </View>

          <View style={{ ...styles.tipContainer }}>
            <View style={{ flexDirection: 'row' }}>
              <Text
                textAlign="right"
                color={COLORS.textLight}
                size={8}
                marginRight={rw(1)}>
                (سندروم پیش از قائدگی)
              </Text>
              <Text
                textAlign="right"
                color={COLORS.textLight}
                size={8}
                marginRight={rw(1)}>
                PMS
              </Text>
            </View>
            <MaterialCommunityIcons
              name="circle"
              color={COLORS.pmsCircle}
              size={14}
            />
          </View>
        </View>
        <View
          style={{
            ...styles.tipContainer,
            alignSelf: 'flex-end',
            marginTop: rh(1.5),
          }}>
          <View style={{ flexDirection: 'row' }}>
            <Text
              textAlign="right"
              color={COLORS.textLight}
              size={8}
              marginRight={rw(1)}>
              (سندروم بد خلقی مردانه)
            </Text>
            <Text
              textAlign="right"
              color={COLORS.textLight}
              size={8}
              marginRight={rw(1)}>
              IMS
            </Text>
          </View>
          <MaterialCommunityIcons
            name="circle"
            color={COLORS.primary}
            size={14}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: rh(2),
  },
  content: {
    width: rw(70),
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: rw(40),
    marginHorizontal: rw(1),
    alignSelf: 'center',
  },
  allTipsContainer: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'center',
    marginTop: rh(1.7),
  },
});

export default CalendarInfo;
