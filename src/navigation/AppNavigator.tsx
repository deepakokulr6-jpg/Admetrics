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
import RegisterMouScreen from '../screens/clinic/RegisterMouScreen';
import MouESignScreen from '../screens/clinic/MouESignScreen';
import ClinicPreviewScreen from '../screens/clinic/ClinicPreviewScreen';
import MouAgreementScreen from '../screens/clinic/MouAgreementScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import AddDeviceScreen from '../screens/settings/AddDeviceScreen';
import ScanQrScreen from '../screens/settings/ScanQrScreen';
import DeviceDetailsScreen from '../screens/settings/DeviceDetailsScreen';
import DevicePairingScreen from '../screens/settings/DevicePairingScreen';
import type { AppStackParamList } from './types';
import colors from '../theme/colors';

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator = () => {
  return (
    <>
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
        <Stack.Screen name="RegisterMou" component={RegisterMouScreen} />
        {/* No swipe-back while signing: strokes must not drag the page. */}
        <Stack.Screen
          name="MouESign"
          component={MouESignScreen}
          options={{ gestureEnabled: false, fullScreenGestureEnabled: false }}
        />
        <Stack.Screen name="ClinicPreview" component={ClinicPreviewScreen} />
        <Stack.Screen name="MouAgreement" component={MouAgreementScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="AddDevice" component={AddDeviceScreen} />
        <Stack.Screen name="ScanQr" component={ScanQrScreen} />
        <Stack.Screen name="DeviceDetails" component={DeviceDetailsScreen} />
        <Stack.Screen
          name="DevicePairing"
          component={DevicePairingScreen}
          options={{
            presentation: 'transparentModal',
            animation: 'none',
            gestureEnabled: false,
          }}
        />
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
          options={{ animation: 'none', gestureEnabled: false }}
        />
      </Stack.Navigator>
    </>
  );
};

export default AppNavigator;
