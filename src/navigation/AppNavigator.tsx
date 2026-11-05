import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import A15HomeScreen from '../screens/a15HomeScreen';
import RevenueScreen from '../screens/RevenueScreen';
import RegisterClinicScreen from '../screens/RegisterClinicScreen';
import RegisterPersonalScreen from '../screens/RegisterPersonalScreen';
import RegisterTimingsScreen from '../screens/RegisterTimingsScreen';
import RegisterPhotoScreen from '../screens/RegisterPhotoScreen';
import ClinicRegisteredScreen from '../screens/ClinicRegisteredScreen';
import { ClinicRegistrationProvider } from '../contexts/ClinicRegistrationContext';

import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator = () => {
  return (
    <ClinicRegistrationProvider>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#FFFFFF' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="A15Home" component={A15HomeScreen} />
        <Stack.Screen name="Revenue" component={RevenueScreen} />
        <Stack.Screen name="RegisterClinic" component={RegisterClinicScreen} />
        <Stack.Screen
          name="RegisterPersonal"
          component={RegisterPersonalScreen}
        />
        <Stack.Screen
          name="RegisterTimings"
          component={RegisterTimingsScreen}
        />
        <Stack.Screen name="RegisterPhotos" component={RegisterPhotoScreen} />
        <Stack.Screen
          name="ClinicRegistered"
          component={ClinicRegisteredScreen}
          options={{ animation: 'fade' }}
        />
      </Stack.Navigator>
    </ClinicRegistrationProvider>
  );
};

export default AppNavigator;
