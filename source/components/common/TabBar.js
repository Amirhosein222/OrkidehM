/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { COLORS, rh, rw } from '../../configs';
import { useIsPeriodDay } from '../../libs/hooks';

const TabBar = ({
  state,
  descriptors,
  navigation,
  seperate = false,
  chart = false,
}) => {
  const isPeriodDay = useIsPeriodDay();

  const renderPriodTabIcon = (atPeriod = false) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate('PeriodTabs')}>
        <View
          style={{
            ...styles.plusIconContainer,
            backgroundColor: isPeriodDay ? COLORS.rossoCorsa : COLORS.blue,
          }}>
          <FontAwesome5 name="plus" size={25} color={COLORS.white} />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  if (seperate) {
    return (
      <View style={{ backgroundColor: chart ? COLORS.white : 'white' }}>
        <View
          style={{
            ...styles.container,
            backgroundColor: isPeriodDay ? COLORS.lightGrey : COLORS.lightBlue,
            width: rw(100),
            paddingHorizontal: rw(4),
          }}>
          <TouchableWithoutFeedback
            onPress={() =>
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'HomeDrawer' }],
                }),
              )
            }>
            <Image
              style={{ left: rw(1) }}
              source={require('../../assets/images/tabIcon1.png')}
            />
          </TouchableWithoutFeedback>

          {/* {isPeriodDay && renderPriodTabIcon(true, true)} */}
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('MemoriesTab')}>
            <Image
              source={require('../../assets/images/tabIcon2.png')}
              style={
                {
                  // left: rw(3),
                }
              }
            />
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('LearningBank')}>
            <Image
              source={require('../../assets/images/tabIcon3.png')}
              style={{
                right: 0,
                // left: rw(3),
              }}
            />
          </TouchableWithoutFeedback>

          {renderPriodTabIcon()}
        </View>
      </View>
    );
  } else {
    const { routes, index } = state;

    return (
      <View style={{ backgroundColor: 'white' }}>
        <View
          style={{
            ...styles.container,
            backgroundColor: isPeriodDay ? COLORS.lightGrey : COLORS.lightBlue,
            width: rw(100),
            paddingHorizontal: rw(4),
          }}>
          {routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const focused = index === state.index;
            const tintColor = focused ? '#9b59b6' : '#93a6b4';
            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };
            return (
              <Pressable
                key={route.key}
                onPress={() => onPress()}
                hitSlop={route.name === 'PeriodTabs' ? 22 : 2}
                style={
                  route.name === 'PeriodTabs'
                    ? {
                        ...styles.plusIconContainer,
                        backgroundColor: isPeriodDay
                          ? COLORS.rossoCorsa
                          : COLORS.blue,
                      }
                    : {}
                }>
                {options.tabBarIcon({
                  tintColor,
                  focused,
                })}
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    backgroundColor: COLORS.lightPink,
    marginBottom: 10,
  },
  peridoTabPDayStyle: {
    backgroundColor: COLORS.rossoCorsa,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 35,
    width: rw(12),
    height: rh(5.5),
  },
  plusIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 30,
    backgroundColor: COLORS.blue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: rw(1),
  },
});

export default TabBar;
