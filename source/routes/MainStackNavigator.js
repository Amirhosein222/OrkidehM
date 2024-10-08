import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {
  LoginScreen,
  RegisterScreen,
  VerificationScreen,
  SetPassword,
  EnterInfoScreen,
  ProfileScreen,
  CyclesScreen,
  PrivacyScreen,
  RemindersScreen,
  EditMobileScreen,
  RelationsScreen,
  AddRelScreen,
  UpdateRelScreen,
} from '../screens';
import DefaultImages from '../components/common/defaultImages/DefaultImages';

import DrawerNavigator from './DrawerNavigation';
import { ActivityIndicator } from 'react-native';
import { COLORS } from '../configs';

const Stack = createStackNavigator();

const linking = {
  prefixes: ['orkidehm://'],
  config: {
    initialRouteName: 'Login',
    screens: {
      HomeDrawer: {
        screens: {
          HomeTabs: {
            screens: {
              HomeScreen: 'home/:refresh',
            },
          },
        },
      },
      // Details: {
      //   path: 'details/:personId',
      // },
    },
  },
};

export default function MainStackNavigator({ isLoggedin, showAuth }) {
  return (
    <NavigationContainer
      linking={linking}
      fallback={
        <ActivityIndicator
          color={COLORS.primary}
          style={{ marginTop: 'auto', marginBottom: 'auto' }}
          size="large"
        />
      }>
      <Stack.Navigator
        headerMode="none"
        initialRouteName={
          isLoggedin && showAuth
            ? 'Login'
            : isLoggedin && !showAuth
            ? 'HomeDrawer'
            : 'Register'
        }>
        <Stack.Screen name="HomeDrawer" component={DrawerNavigator} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          initialParams={{ editNumber: false, resetPassword: false }}
        />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen
          name="EnterInfo"
          component={EnterInfoScreen}
          initialParams={{
            editProfile: false,
            reEnter: false,
            unCompleteRegister: false,
          }}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Cycles" component={CyclesScreen} />
        <Stack.Screen name="Reminders" component={RemindersScreen} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} />
        <Stack.Screen name="EditMobile" component={EditMobileScreen} />
        <Stack.Screen name="Relations" component={RelationsScreen} />
        <Stack.Screen name="AddRel" component={AddRelScreen} />
        <Stack.Screen name="UpdateRel" component={UpdateRelScreen} />
        <Stack.Screen name="DefaultImages" component={DefaultImages} />
        <Stack.Screen name="SetPassword" component={SetPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
