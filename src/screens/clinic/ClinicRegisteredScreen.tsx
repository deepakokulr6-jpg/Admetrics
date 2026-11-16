import React from 'react';

import SuccessScreenLayout from '../../components/shared/SuccessScreenLayout';
import { useClinicRegistration } from '../../contexts/ClinicRegistrationContext';
import type { AppScreenProps } from '../../navigation/types';
import strings from '../../constants/strings';

const ClinicRegisteredScreen: React.FC<AppScreenProps<'ClinicRegistered'>> = ({
  navigation,
}) => {
  const { resetDraft } = useClinicRegistration();

  const handleOkay = () => {
    resetDraft();
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs', params: { screen: 'Clinics' } }],
    });
  };

  return (
    <SuccessScreenLayout
      title={strings.clinicRegistered.clinicRegisteredSuccessfully}
      description={strings.clinicRegistered.yourClinicIsRegisteredWith}
      buttonText={strings.clinicRegistered.okay}
      onButtonPress={handleOkay}
    />
  );
};

export default ClinicRegisteredScreen;
