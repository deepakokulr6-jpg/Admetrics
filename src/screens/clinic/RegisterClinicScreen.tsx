import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import FormScreenLayout from '../../components/shared/FormScreenLayout';
import GradientButton from '../../components/shared/GradientButton';
import ClinicInfoForm, {
  CLINIC_BOTTOM_FIELDS,
} from '../../components/clinic/ClinicInfoForm';
import { useClinicRegistration } from '../../hooks/useClinicRegistration';
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

/** Step 1 of registration: clinic details, saved to the registration draft. */
const RegisterClinicScreen: React.FC<AppScreenProps<'RegisterClinic'>> = ({
  navigation,
}) => {
  const { draft, updateClinicInfo } = useClinicRegistration();
  const keyboard = useKeyboardAutoScroll();
  const [errors, setErrors] = useState<ClinicErrors>({});

  const handleChange = (key: keyof ClinicInfo, value: string) => {
    updateClinicInfo({ [key]: value });
    setErrors(previous => withoutError<ClinicInfo>(previous, key));
  };

  const handleNext = () => {
    const nextErrors = validateClinic(draft.clinic);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      Alert.alert(
        strings.clinicForm.checkClinicDetails,
        strings.clinicForm.pleaseCompleteTheRequiredClinic,
      );
      return;
    }

    navigation.navigate('RegisterPersonal');
  };

  return (
    <FormScreenLayout
      title={strings.common.registerYourClinic}
      onBack={() => navigation.goBack()}
      step={1}
      keyboard={keyboard}
    >
      <ClinicInfoForm
        values={draft.clinic}
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

export default RegisterClinicScreen;
