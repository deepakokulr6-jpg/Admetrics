import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../../components/shared/ScreenHeader';
import StepProgress from '../../components/shared/StepProgress';
import InputField from '../../components/shared/InputField';
import GradientButton from '../../components/shared/GradientButton';
import MapPreview from '../../components/clinic/MapPreview';
import { useClinicRegistration } from '../../contexts/ClinicRegistrationContext';
import { ClinicInfo } from '../../types/clinic';
import {
  GST_PATTERN,
  isBlank,
  isValidPincode,
  isValidYear,
  PAN_PATTERN,
} from '../../utils/validation';
import { useKeyboardAutoScroll } from '../../utils/useKeyboardAutoScroll';
import type { AppScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';

type ClinicErrors = Partial<Record<keyof ClinicInfo, string>>;

// These fields sit right above the map and Next button, so the form scrolls
// to its end when one of them is focused to keep the footer above the keyboard.
const BOTTOM_FIELDS: (keyof ClinicInfo)[] = ['city', 'state', 'pincode'];

const validateClinic = (clinic: ClinicInfo): ClinicErrors => {
  const errors: ClinicErrors = {};

  if (isBlank(clinic.clinicName)) {
    errors.clinicName = strings.clinicForm.clinicNameIsRequired;
  }

  if (isBlank(clinic.medicalRegistrationNumber)) {
    errors.medicalRegistrationNumber =
      strings.clinicForm.medicalRegistrationNumberIsRequired;
  }

  if (
    !isBlank(clinic.establishmentYear) &&
    !isValidYear(clinic.establishmentYear)
  ) {
    errors.establishmentYear = strings.registerClinic.enterAValidFourDigit;
  }

  if (isBlank(clinic.licenceNumber)) {
    errors.licenceNumber =
      strings.registerClinic.registrationLicenceNumberIsRequired;
  }

  if (isBlank(clinic.gstNumber)) {
    errors.gstNumber = strings.registerClinic.gstNumberIsRequired;
  } else if (!GST_PATTERN.test(clinic.gstNumber.trim())) {
    errors.gstNumber = strings.registerClinic.enterAValid15Character;
  }

  if (
    !isBlank(clinic.panNumber) &&
    !PAN_PATTERN.test(clinic.panNumber.trim())
  ) {
    errors.panNumber = strings.registerClinic.enterAValid10Character;
  }

  if (isBlank(clinic.street)) {
    errors.street = strings.registerClinic.streetIsRequired;
  }

  if (isBlank(clinic.pincode)) {
    errors.pincode = strings.registerClinic.pincodeIsRequired;
  } else if (!isValidPincode(clinic.pincode)) {
    errors.pincode = strings.registerClinic.enterAValidSixDigit;
  }

  return errors;
};

const RegisterClinicScreen: React.FC<AppScreenProps<'RegisterClinic'>> = ({
  navigation,
}) => {
  const { draft, updateClinicInfo } = useClinicRegistration();
  const { clinic } = draft;

  const { scrollRef, onScroll, onLayout, setAutoScroll } =
    useKeyboardAutoScroll();

  const [errors, setErrors] = useState<ClinicErrors>({});

  const focusProps = (field: keyof ClinicInfo) => ({
    onFocus: () => setAutoScroll(BOTTOM_FIELDS.includes(field)),
  });

  const update = (key: keyof ClinicInfo, value: string) => {
    updateClinicInfo({ [key]: value });
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
    const nextErrors = validateClinic(clinic);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      Alert.alert(
        strings.clinicForm.checkClinicDetails,
        strings.clinicForm.pleaseCompleteTheRequiredClinic,
      );
      return;
    }

    navigation.navigate('RegisterPersonal');
  };

  const handleOpenMap = async () => {
    const query = [
      clinic.address,
      clinic.street,
      clinic.city,
      clinic.state,
      clinic.pincode,
    ]
      .map(part => part.trim())
      .filter(Boolean)
      .join(', ');

    if (!query) {
      Alert.alert(
        strings.registerClinic.addressRequired,
        strings.registerClinic.enterTheClinicAddressBefore,
      );
      return;
    }

    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      query,
    )}`;

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        strings.registerClinic.mapUnavailable,
        strings.registerClinic.noMapApplicationCouldBe,
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScreenHeader
        title={strings.common.registerYourClinic}
        onBackPress={() => navigation.goBack()}
      />
      <StepProgress currentStep={1} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          onScroll={onScroll}
          onLayout={onLayout}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heading}>{strings.common.clinicInformation}</Text>

          <InputField
            label={strings.clinicForm.clinicName}
            placeholder={strings.clinicForm.enterClinicName}
            value={clinic.clinicName}
            onChangeText={value => update('clinicName', value)}
            {...focusProps('clinicName')}
            required
            autoCapitalize="words"
            error={errors.clinicName}
          />

          <InputField
            label={strings.clinicForm.medicalRegistrationNumber}
            placeholder={strings.clinicForm.enterMedicalRegistrationNumber}
            value={clinic.medicalRegistrationNumber}
            onChangeText={value => update('medicalRegistrationNumber', value)}
            {...focusProps('medicalRegistrationNumber')}
            required
            error={errors.medicalRegistrationNumber}
          />

          <InputField
            label={strings.clinicForm.establishmentYear}
            placeholder={strings.clinicForm.eG2023}
            value={clinic.establishmentYear}
            onChangeText={value => update('establishmentYear', value)}
            {...focusProps('establishmentYear')}
            keyboardType="number-pad"
            maxLength={4}
            error={errors.establishmentYear}
          />

          <InputField
            label={strings.clinicForm.registrationLicenceNumber}
            placeholder={strings.clinicForm.enterRegistrationOrLicenceNumber}
            value={clinic.licenceNumber}
            onChangeText={value => update('licenceNumber', value)}
            {...focusProps('licenceNumber')}
            required
            autoCapitalize="characters"
            error={errors.licenceNumber}
          />

          <InputField
            label={strings.clinicForm.gstNumber}
            placeholder={strings.clinicForm.enterGstNumber}
            value={clinic.gstNumber}
            onChangeText={value => update('gstNumber', value.toUpperCase())}
            {...focusProps('gstNumber')}
            required
            autoCapitalize="characters"
            maxLength={15}
            error={errors.gstNumber}
          />

          <InputField
            label={strings.clinicForm.panNumber}
            placeholder={strings.clinicForm.enterPanNumber}
            value={clinic.panNumber}
            onChangeText={value => update('panNumber', value.toUpperCase())}
            {...focusProps('panNumber')}
            autoCapitalize="characters"
            maxLength={10}
            error={errors.panNumber}
          />

          <InputField
            label={strings.clinicForm.address}
            placeholder={strings.clinicForm.enterClinicAddress}
            value={clinic.address}
            onChangeText={value => update('address', value)}
            {...focusProps('address')}
            autoCapitalize="sentences"
            error={errors.address}
          />

          <InputField
            label={strings.clinicForm.street}
            placeholder={strings.clinicForm.enterStreet}
            value={clinic.street}
            onChangeText={value => update('street', value)}
            {...focusProps('street')}
            autoCapitalize="sentences"
            error={errors.street}
          />

          <InputField
            label={strings.clinicForm.city}
            placeholder={strings.clinicForm.enterCity}
            value={clinic.city}
            onChangeText={value => update('city', value)}
            {...focusProps('city')}
            autoCapitalize="words"
            error={errors.city}
          />

          <InputField
            label={strings.clinicForm.state}
            placeholder={strings.clinicForm.enterState}
            value={clinic.state}
            onChangeText={value => update('state', value)}
            {...focusProps('state')}
            autoCapitalize="words"
            error={errors.state}
          />

          <InputField
            label={strings.clinicForm.pincode}
            placeholder={strings.clinicForm.enterPincode}
            value={clinic.pincode}
            onChangeText={value => update('pincode', value)}
            {...focusProps('pincode')}
            keyboardType="number-pad"
            maxLength={6}
            error={errors.pincode}
          />

          <MapPreview onPress={handleOpenMap} />

          <View style={styles.button}>
            <GradientButton title={strings.common.next} onPress={handleNext} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },

  flex: {
    flex: 1,
  },

  content: {
    width: '100%',
    maxWidth: scale(420),
    alignSelf: 'center',
    paddingHorizontal: scale(16),
    paddingTop: 0,
    paddingBottom: verticalScale(32),
  },

  heading: {
    fontSize: normalizeFont(16),
    lineHeight: normalizeFont(19),
    fontFamily: fonts.semibold,
    color: colors.text,
    marginBottom: verticalScale(16),
  },

  button: {
    marginTop: verticalScale(48),
  },
});

export default RegisterClinicScreen;
