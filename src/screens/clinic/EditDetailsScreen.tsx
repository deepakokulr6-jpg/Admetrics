import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import FormScreenLayout from '../../components/shared/FormScreenLayout';
import GradientButton from '../../components/shared/GradientButton';
import ClinicInfoForm, {
  CLINIC_BOTTOM_FIELDS,
} from '../../components/clinic/ClinicInfoForm';
import { useClinicRegistration } from '../../contexts/ClinicRegistrationContext';
import type { ClinicInfo } from '../../types/clinic';
import {
  type ClinicErrors,
  hasErrors,
  validateClinic,
  withoutError,
} from '../../utils/clinicValidation';
import { useKeyboardAutoScroll } from '../../utils/useKeyboardAutoScroll';
import type { AppScreenProps } from '../../navigation/types';
import { verticalScale } from '../../utils/responsive';
import strings from '../../constants/strings';
import { sampleClinic } from '../../constants/mockData';

/**
 * Edit an existing clinic. Starts from the clinic's saved details (demo data
 * until the API is connected), then continues through the same steps.
 */
const EditDetailsScreen: React.FC<AppScreenProps<'EditDetails'>> = ({
  navigation,
}) => {
  const { updateClinicInfo } = useClinicRegistration();
  const keyboard = useKeyboardAutoScroll();
  const [values, setValues] = useState<ClinicInfo>(() => ({
    clinicName: sampleClinic.clinicName,
    medicalRegistrationNumber: sampleClinic.medicalRegistrationNumber,
    establishmentYear: sampleClinic.establishmentYear,
    licenceNumber: sampleClinic.licenceNumber,
    gstNumber: sampleClinic.gstNumber,
    panNumber: sampleClinic.panNumber,
    address: sampleClinic.address,
    street: sampleClinic.street,
    city: sampleClinic.city,
    state: sampleClinic.state,
    pincode: sampleClinic.pincode,
  }));
  const [errors, setErrors] = useState<ClinicErrors>({});

  const handleChange = (key: keyof ClinicInfo, value: string) => {
    setValues(previous => ({ ...previous, [key]: value }));
    setErrors(previous => withoutError<ClinicInfo>(previous, key));
  };

  const handleNext = () => {
    const nextErrors = validateClinic(values);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      Alert.alert(
        strings.clinicForm.checkClinicDetails,
        strings.clinicForm.pleaseCompleteTheRequiredClinic,
      );
      return;
    }

    // The next steps (Contact → Photos → MOU) read from the draft.
    updateClinicInfo(values);
    navigation.navigate('RegisterPersonal');
  };

  return (
    <FormScreenLayout
      title={strings.editDetails.editDetails}
      onBack={() => navigation.goBack()}
      step={1}
      keyboard={keyboard}
    >
      <ClinicInfoForm
        values={values}
        errors={errors}
        onChange={handleChange}
        onFieldFocus={key =>
          keyboard.setAutoScroll(CLINIC_BOTTOM_FIELDS.includes(key))
        }
      />

      <View style={styles.button}>
        <GradientButton title={strings.common.next} onPress={handleNext} />
      </View>
    </FormScreenLayout>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: verticalScale(48),
  },
});

export default EditDetailsScreen;
