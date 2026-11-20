import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import FormScreenLayout from '../../components/shared/FormScreenLayout';
import GradientButton from '../../components/shared/GradientButton';
import ClinicInfoForm, {
  CLINIC_BOTTOM_FIELDS,
} from '../../components/clinic/ClinicInfoForm';
import WorkingHoursSection from '../../components/clinic/WorkingHoursSection';
import { useClinicRegistration } from '../../hooks/useClinicRegistration';
import { validateWorkingHours } from '../../utils/workingHours';
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
import { themedStyles } from '../../theme/themedStyles';
import { appAlert } from '../../components/shared/AppAlert';

/** Step 1 of registration: clinic details, saved to the registration draft. */
const RegisterClinicScreen: React.FC<AppScreenProps<'RegisterClinic'>> = ({
  navigation,
}) => {
  const { draft, updateClinicInfo, updateWorkingHour } =
    useClinicRegistration();
  const keyboard = useKeyboardAutoScroll();
  const [errors, setErrors] = useState<ClinicErrors>({});
  const [hoursErrorIndex, setHoursErrorIndex] = useState<number | null>(null);

  const handleChange = (key: keyof ClinicInfo, value: string) => {
    updateClinicInfo({ [key]: value });
    setErrors(previous => withoutError<ClinicInfo>(previous, key));
  };

  const handleNext = () => {
    const nextErrors = validateClinic(draft.clinic);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      appAlert(
        strings.clinicForm.checkClinicDetails,
        strings.clinicForm.pleaseCompleteTheRequiredClinic,
      );
      return;
    }

    const hoursProblem = validateWorkingHours(draft.workingHours);
    setHoursErrorIndex(hoursProblem?.index ?? null);
    if (hoursProblem) {
      appAlert(strings.workingHours.checkHours, hoursProblem.message);
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

      <View style={styles.hours}>
        <WorkingHoursSection
          hours={draft.workingHours}
          errorIndex={hoursErrorIndex}
          onChange={(index, patch) => {
            updateWorkingHour(index, patch);
            if (index === hoursErrorIndex) {
              setHoursErrorIndex(null);
            }
          }}
        />
      </View>

      <View style={styles.button}>
        <GradientButton title={strings.common.next} onPress={handleNext} />
      </View>
    </FormScreenLayout>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    hours: {
      marginTop: verticalScale(28),
    },
    button: {
      marginTop: verticalScale(32),
    },
  }),
);

export default RegisterClinicScreen;
