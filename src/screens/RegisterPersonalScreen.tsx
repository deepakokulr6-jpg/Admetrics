import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../components/ScreenHeader';
import StepProgress from '../components/StepProgress';
import InputField from '../components/InputField';
import GradientButton from '../components/GradientButton';
import { useClinicRegistration } from '../context/ClinicRegistrationContext';
import { PersonalInfo } from '../types/clinic';
import { isBlank, isValidEmail, isValidMobile } from '../utils/validation';
import type { AppScreenProps } from '../navigation/types';

type PersonalErrors = Partial<Record<keyof PersonalInfo, string>>;

const validatePersonal = (personal: PersonalInfo): PersonalErrors => {
  const errors: PersonalErrors = {};

  if (isBlank(personal.contactPerson)) {
    errors.contactPerson = 'Contact person is required.';
  }

  if (isBlank(personal.designation)) {
    errors.designation = 'Designation is required.';
  }

  if (isBlank(personal.mobile)) {
    errors.mobile = 'Mobile number is required.';
  } else if (!isValidMobile(personal.mobile)) {
    errors.mobile = 'Enter a valid 10-digit mobile number.';
  }

  if (isBlank(personal.email)) {
    errors.email = 'Email ID is required.';
  } else if (!isValidEmail(personal.email)) {
    errors.email = 'Enter a valid email address.';
  }

  return errors;
};

const RegisterPersonalScreen: React.FC<AppScreenProps<'RegisterPersonal'>> = ({
  navigation,
}) => {
  const { draft, updatePersonalInfo } = useClinicRegistration();
  const { personal } = draft;

  const [errors, setErrors] = useState<PersonalErrors>({});

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
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      Alert.alert(
        'Check personal details',
        'Please complete the required personal information before continuing.',
      );
      return;
    }

    navigation.navigate('RegisterTimings');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScreenHeader
        title="Register Your Clinic"
        onBackPress={() => navigation.goBack()}
      />
      <StepProgress currentStep={2} />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Personal Information</Text>

        <InputField
          label="Contact Person Number"
          placeholder="Enter contact person name or number"
          value={personal.contactPerson}
          onChangeText={value => update('contactPerson', value)}
          required
          autoCapitalize="words"
          error={errors.contactPerson}
        />

        <InputField
          label="Designation"
          placeholder="Enter designation"
          value={personal.designation}
          onChangeText={value => update('designation', value)}
          required
          autoCapitalize="words"
          error={errors.designation}
        />

        <InputField
          label="Mobile Number"
          placeholder="Enter mobile number"
          value={personal.mobile}
          onChangeText={value => update('mobile', value.replace(/[^\d+\s-]/g, ''))}
          required
          keyboardType="phone-pad"
          maxLength={15}
          error={errors.mobile}
        />

        <InputField
          label="Email ID"
          placeholder="Enter email address"
          value={personal.email}
          onChangeText={value => update('email', value.trim())}
          required
          keyboardType="email-address"
          textContentType="emailAddress"
          error={errors.email}
        />

        <View style={styles.button}>
          <GradientButton title="Next" onPress={handleNext} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 32,
  },

  heading: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    color: '#221E25',
    marginBottom: 14,
  },

  button: {
    marginTop: 22,
  },
});

export default RegisterPersonalScreen;
