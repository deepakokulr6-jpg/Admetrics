import React from 'react';
import { DefaultTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeBackScreen from '../screens/WelcomeBackScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import VerifyOtpScreen from '../screens/VerifyOtpScreen';
import ConfirmPasswordScreen from '../screens/ConfirmPasswordScreen';
import AccountCreatedScreen from '../screens/AccountCreatedScreen';

import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0265FB',
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#221E25',
    border: '#EEEEEE',
  },
};

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen name="Login" component={WelcomeBackScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
      <Stack.Screen
        name="ConfirmPassword"
        component={ConfirmPasswordScreen}
      />
      <Stack.Screen
        name="AccountCreated"
        component={AccountCreatedScreen}
        options={{ animation: 'fade' }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
