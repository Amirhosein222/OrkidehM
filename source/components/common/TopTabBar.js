/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, Pressable, StatusBar } from 'react-native';

import { Text, Header } from '../../components/common';

import { useIsPeriodDay } from '../../libs/hooks';
import { COLORS, rh, rw, STATUS_BAR_HEIGHT } from '../../configs';

const TopTabBar = ({
  state,
  descriptors,
  navigation,
  periodTabs = false,
  seperated = false,
}) => {
  const isPeriodDay = useIsPeriodDay();
  const { routes, index } = state;

  const handleTabColors = (focused) => {
    if (isPeriodDay) {
      return focused ? COLORS.rossoCorsa : COLORS.dark;
    } else {
      return focused ? COLORS.blue : COLORS.dark;
    }
  };

  return (
    <View
      style={{
        // marginTop: STATUS_BAR_HEIGHT - rh(0.2),
        backgroundColor: '#fff',
      }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header
        navigation={navigation}
        style={{ alignSelf: 'center', marginTop: STATUS_BAR_HEIGHT + rh(2) }}
      />
      <View style={styles.container}>
        {routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = index === state.index;
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
              style={{
                borderBottomWidth: 2,
                borderBottomColor: handleTabColors(focused),
                width: '50%',
                paddingHorizontal: rw(4),
              }}
              key={route.key}
              onPress={() => onPress()}>
              <Text marginBottom="5" color={handleTabColors(focused)} bold>
                {options.tabBarLabel}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: COLORS.white,
  },
  plusIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 30,
    backgroundColor: COLORS.blue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
});

export default TopTabBar;
