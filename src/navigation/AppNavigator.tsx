import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainTabs from './MainTabs';
import RegisterClinicScreen from '../screens/clinic/RegisterClinicScreen';
import EditDetailsScreen from '../screens/clinic/EditDetailsScreen';
import RegisteredDetailsScreen from '../screens/clinic/RegisteredDetailsScreen';
import PaymentDetailsScreen from '../screens/revenue/PaymentDetailsScreen';
import RegisterPersonalScreen from '../screens/clinic/RegisterPersonalScreen';
import RegisterTimingsScreen from '../screens/clinic/RegisterTimingsScreen';
import RegisterPhotoScreen from '../screens/clinic/RegisterPhotoScreen';
import ClinicRegisteredScreen from '../screens/clinic/ClinicRegisteredScreen';
import { ClinicRegistrationProvider } from '../contexts/ClinicRegistrationContext';
import type { AppStackParamList } from './types';
import colors from '../theme/colors';

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator = () => {
  return (
    <ClinicRegistrationProvider>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.white },
        }}
      >
        {/* Bottom tabs: Revenue · Clinics · Statement · Support */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="RegisterClinic" component={RegisterClinicScreen} />
        <Stack.Screen name="EditDetails" component={EditDetailsScreen} />
        <Stack.Screen
          name="RegisteredDetails"
          component={RegisteredDetailsScreen}
        />
        <Stack.Screen name="PaymentDetails" component={PaymentDetailsScreen} />
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
          // Success sheet: no swipe-back into the finished registration.
          options={{ animation: 'fade', gestureEnabled: false }}
        />
      </Stack.Navigator>
    </ClinicRegistrationProvider>
  );
};

export default AppNavigator;
