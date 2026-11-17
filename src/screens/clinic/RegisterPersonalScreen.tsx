import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';

import FormScreenLayout, {
  formStyles,
} from '../../components/shared/FormScreenLayout';
import InputField from '../../components/shared/InputField';
import GradientButton from '../../components/shared/GradientButton';
import { useClinicRegistration } from '../../hooks/useClinicRegistration';
import { useAuth } from '../../hooks/useAuth';
import { PersonalInfo } from '../../types/clinic';
import {
  type PersonalErrors,
  validatePersonal,
} from '../../utils/clinicValidation';
import { useKeyboardAutoScroll } from '../../utils/useKeyboardAutoScroll';
import type { AppScreenProps } from '../../navigation/types';
import strings from '../../constants/strings';

// The last fields sit right above the Next button, so the form scrolls to its
// end when one of them is focused to keep the button above the keyboard.
const BOTTOM_FIELDS: (keyof PersonalInfo)[] = ['mobile', 'email'];

const RegisterPersonalScreen: React.FC<AppScreenProps<'RegisterPersonal'>> = ({
  navigation,
}) => {
  const { draft, updatePersonalInfo } = useClinicRegistration();
  const { user } = useAuth();
  // Figma shows the Email ID pre-filled from the signed-in account and locked.
  const personal = {
    ...draft.personal,
    email: draft.personal.email || user?.email || '',
  };

  const keyboard = useKeyboardAutoScroll();
  const { setAutoScroll } = keyboard;

  const [errors, setErrors] = useState<PersonalErrors>({});

  const focusProps = (field: keyof PersonalInfo) => ({
    onFocus: () => setAutoScroll(BOTTOM_FIELDS.includes(field)),
  });

  const update = (key: keyof PersonalInfo, value: string) => {
    updatePersonalInfo({ [key]: value });
    setErrors(previous => {
      if (!previous[key]) {
        return previous;
      }

      const next = { ...previous };
      delete next[key];
      return next;
    });
  };

  const handleNext = () => {
    const nextErrors = validatePersonal(personal);
    if (!draft.personal.email && personal.email) {
      updatePersonalInfo({ email: personal.email });
    }
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      Alert.alert(
        strings.registerPersonal.checkPersonalDetails,
        strings.registerPersonal.pleaseCompleteTheRequiredPersonal,
      );
      return;
    }

    // The required registration flow goes straight from personal details to
    // photos. The timings screen remains available as a standalone route.
    navigation.navigate('RegisterPhotos');
  };

  return (
    <FormScreenLayout
      title={strings.common.registerYourClinic}
      onBack={() => navigation.goBack()}
      step={2}
      keyboard={keyboard}
      contentStyle={formStyles.pinnedContent}
    >
      <Text style={formStyles.heading}>
        {strings.common.contactInformation}
      </Text>

      <InputField
        label={strings.registerPersonal.contactPersonNumber}
        placeholder={strings.registerPersonal.enterContactPersonName}
        value={personal.contactPerson}
        onChangeText={value => update('contactPerson', value)}
        {...focusProps('contactPerson')}
        autoCapitalize="words"
        error={errors.contactPerson}
      />

      <InputField
        label={strings.registerPersonal.designation}
        placeholder={strings.registerPersonal.enterDesignation}
        value={personal.designation}
        onChangeText={value => update('designation', value)}
        {...focusProps('designation')}
        autoCapitalize="words"
        error={errors.designation}
      />

      <InputField
        label={strings.registerPersonal.mobileNumber}
        placeholder={strings.registerPersonal.enterMobileNumber}
        value={personal.mobile}
        onChangeText={value =>
          update('mobile', value.replace(/[^\d+\s-]/g, ''))
        }
        {...focusProps('mobile')}
        keyboardType="phone-pad"
        maxLength={15}
        error={errors.mobile}
      />

      <InputField
        label={strings.registerPersonal.emailId}
        placeholder={strings.registerPersonal.enterEmailAddress}
        value={personal.email}
        onChangeText={value => update('email', value.trim())}
        {...focusProps('email')}
        editable={!user?.email}
        keyboardType="email-address"
        textContentType="emailAddress"
        error={errors.email}
      />

      <View style={formStyles.pinnedButton}>
        <GradientButton title={strings.common.next} onPress={handleNext} />
      </View>
    </FormScreenLayout>
  );
};

export default RegisterPersonalScreen;
