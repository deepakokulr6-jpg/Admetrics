import React from 'react';

import SuccessScreenLayout from '../components/SuccessScreenLayout';
import { useClinicRegistration } from '../context/ClinicRegistrationContext';
import type { AppScreenProps } from '../navigation/types';

const ClinicRegisteredScreen: React.FC<
  AppScreenProps<'ClinicRegistered'>
> = ({ navigation }) => {
  const { resetDraft } = useClinicRegistration();

  const handleOkay = () => {
    resetDraft();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <SuccessScreenLayout
      title="Clinic Registered Successfully!"
      description={
        'Your clinic is registered with Admetrics. Please wait for our approval.'
      }
      buttonText="Okay"
      onButtonPress={handleOkay}
    />
  );
};

export default ClinicRegisteredScreen;
