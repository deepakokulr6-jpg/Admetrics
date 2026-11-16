import React from 'react';
import { DefaultTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeBackScreen from '../screens/auth/WelcomeBackScreen';
import CreateAccountScreen from '../screens/auth/CreateAccountScreen';
import VerifyOtpScreen, {
  ForgotPasswordScreen,
} from '../screens/auth/VerifyOtpScreen';
import ConfirmPasswordScreen from '../screens/auth/ConfirmPasswordScreen';
import AccountCreatedScreen from '../screens/account/AccountCreatedScreen';

import type { AuthStackParamList } from './types';
import colors from '../theme/colors';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.white,
    card: colors.white,
    text: colors.text,
    border: colors.disabled,
  },
};

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colors.white },
      }}
    >
      <Stack.Screen name="Login" component={WelcomeBackScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ConfirmPassword" component={ConfirmPasswordScreen} />
      <Stack.Screen
        name="AccountCreated"
        component={AccountCreatedScreen}
        options={{ animation: 'fade', gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
