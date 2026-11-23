import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainTabs from './MainTabs';
import RegisterClinicScreen from '../screens/clinic/RegisterClinicScreen';
import ClinicInformationScreen from '../screens/clinic/ClinicInformationScreen';
import EditDetailsScreen from '../screens/clinic/EditDetailsScreen';
import RegisteredDetailsScreen from '../screens/clinic/RegisteredDetailsScreen';
import PaymentDetailsScreen from '../screens/revenue/PaymentDetailsScreen';
import RegisterPersonalScreen from '../screens/clinic/RegisterPersonalScreen';
import RegisterPhotoScreen from '../screens/clinic/RegisterPhotoScreen';
import RegisterMouScreen from '../screens/clinic/RegisterMouScreen';
import ClinicPreviewScreen from '../screens/clinic/ClinicPreviewScreen';
import MouAgreementScreen from '../screens/clinic/MouAgreementScreen';
import SignedMouScreen from '../screens/clinic/SignedMouScreen';
import MapPickerScreen from '../screens/clinic/MapPickerScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import AddDeviceScreen from '../screens/settings/AddDeviceScreen';
import PrivacySecurityScreen from '../screens/settings/PrivacySecurityScreen';
import BankAccountScreen from '../screens/settings/BankAccountScreen';
import ChangePasswordScreen from '../screens/settings/ChangePasswordScreen';
import ScanQrScreen from '../screens/settings/ScanQrScreen';
import DeviceDetailsScreen from '../screens/settings/DeviceDetailsScreen';
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
        <Stack.Screen name="ClinicInformation" component={ClinicInformationScreen} />
        <Stack.Screen name="RegisterMou" component={RegisterMouScreen} />
        <Stack.Screen name="ClinicPreview" component={ClinicPreviewScreen} />
        <Stack.Screen name="MouAgreement" component={MouAgreementScreen} />
        <Stack.Screen name="SignedMou" component={SignedMouScreen} />
        <Stack.Screen
          name="MapPicker"
          component={MapPickerScreen}
          // Panning the map must not trigger swipe-back.
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="AddDevice" component={AddDeviceScreen} />
        <Stack.Screen name="BankAccount" component={BankAccountScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen
          name="PrivacySecurity"
          component={PrivacySecurityScreen}
        />
        <Stack.Screen name="ScanQr" component={ScanQrScreen} />
        <Stack.Screen name="DeviceDetails" component={DeviceDetailsScreen} />
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
        <Stack.Screen name="RegisterPhotos" component={RegisterPhotoScreen} />
      </Stack.Navigator>
    </>
  );
};

export default AppNavigator;
