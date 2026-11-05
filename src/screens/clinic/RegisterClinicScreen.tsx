import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Pressable,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ScreenHeader from '../../components/shared/ScreenHeader';
import StepProgress from '../../components/shared/StepProgress';
import InputField from '../../components/shared/InputField';
import GradientButton from '../../components/shared/GradientButton';
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

type ClinicErrors = Partial<Record<keyof ClinicInfo, string>>;

// These fields sit right above the map and Next button, so the form scrolls
// to its end when one of them is focused to keep the footer above the keyboard.
const BOTTOM_FIELDS: (keyof ClinicInfo)[] = ['city', 'state', 'pincode'];

const validateClinic = (clinic: ClinicInfo): ClinicErrors => {
  const errors: ClinicErrors = {};

  if (isBlank(clinic.clinicName)) {
    errors.clinicName = 'Clinic name is required.';
  }

  if (isBlank(clinic.medicalRegistrationNumber)) {
    errors.medicalRegistrationNumber =
      'Medical registration number is required.';
  }

  if (isBlank(clinic.establishmentYear)) {
    errors.establishmentYear = 'Establishment year is required.';
  } else if (!isValidYear(clinic.establishmentYear)) {
    errors.establishmentYear = 'Enter a valid four-digit year.';
  }

  if (isBlank(clinic.licenceNumber)) {
    errors.licenceNumber = 'Registration/licence number is required.';
  }

  if (isBlank(clinic.gstNumber)) {
    errors.gstNumber = 'GST number is required.';
  } else if (!GST_PATTERN.test(clinic.gstNumber.trim())) {
    errors.gstNumber = 'Enter a valid 15-character GST number.';
  }

  if (
    !isBlank(clinic.panNumber) &&
    !PAN_PATTERN.test(clinic.panNumber.trim())
  ) {
    errors.panNumber = 'Enter a valid 10-character PAN.';
  }

  if (isBlank(clinic.address)) {
    errors.address = 'Address is required.';
  }

  if (isBlank(clinic.street)) {
    errors.street = 'Street is required.';
  }

  if (isBlank(clinic.city)) {
    errors.city = 'City is required.';
  }

  if (isBlank(clinic.state)) {
    errors.state = 'State is required.';
  }

  if (isBlank(clinic.pincode)) {
    errors.pincode = 'Pincode is required.';
  } else if (!isValidPincode(clinic.pincode)) {
    errors.pincode = 'Enter a valid six-digit pincode.';
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
        'Check clinic details',
        'Please complete the required clinic information before continuing.',
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
        'Address required',
        'Enter the clinic address before opening it on the map.',
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
        'Map unavailable',
        'No map application could be opened on this device.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScreenHeader
        title="Register Your Clinic"
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
          <Text style={styles.heading}>Clinic Information</Text>

          <InputField
            label="Clinic Name"
            placeholder="Enter clinic name"
            value={clinic.clinicName}
            onChangeText={value => update('clinicName', value)}
            {...focusProps('clinicName')}
            required
            autoCapitalize="words"
            error={errors.clinicName}
          />

          <InputField
            label="Medical Registration Number"
            placeholder="Enter medical registration number"
            value={clinic.medicalRegistrationNumber}
            onChangeText={value => update('medicalRegistrationNumber', value)}
            {...focusProps('medicalRegistrationNumber')}
            required
            error={errors.medicalRegistrationNumber}
          />

          <InputField
            label="Establishment Year"
            placeholder="e.g. 2023"
            value={clinic.establishmentYear}
            onChangeText={value => update('establishmentYear', value)}
            {...focusProps('establishmentYear')}
            required
            keyboardType="number-pad"
            maxLength={4}
            error={errors.establishmentYear}
          />

          <InputField
            label="Registration/Licence Number"
            placeholder="Enter registration or licence number"
            value={clinic.licenceNumber}
            onChangeText={value => update('licenceNumber', value)}
            {...focusProps('licenceNumber')}
            required
            autoCapitalize="characters"
            error={errors.licenceNumber}
          />

          <InputField
            label="GST Number"
            placeholder="Enter GST number"
            value={clinic.gstNumber}
            onChangeText={value => update('gstNumber', value.toUpperCase())}
            {...focusProps('gstNumber')}
            required
            autoCapitalize="characters"
            maxLength={15}
            error={errors.gstNumber}
          />

          <InputField
            label="PAN Number"
            placeholder="Enter PAN number"
            value={clinic.panNumber}
            onChangeText={value => update('panNumber', value.toUpperCase())}
            {...focusProps('panNumber')}
            autoCapitalize="characters"
            maxLength={10}
            error={errors.panNumber}
          />

          <InputField
            label="Address"
            placeholder="Enter clinic address"
            value={clinic.address}
            onChangeText={value => update('address', value)}
            {...focusProps('address')}
            required
            autoCapitalize="sentences"
            multiline
            numberOfLines={2}
            error={errors.address}
          />

          <InputField
            label="Street"
            placeholder="Enter street"
            value={clinic.street}
            onChangeText={value => update('street', value)}
            {...focusProps('street')}
            required
            autoCapitalize="sentences"
            error={errors.street}
          />

          <InputField
            label="City"
            placeholder="Enter city"
            value={clinic.city}
            onChangeText={value => update('city', value)}
            {...focusProps('city')}
            required
            autoCapitalize="words"
            error={errors.city}
          />

          <InputField
            label="State"
            placeholder="Enter state"
            value={clinic.state}
            onChangeText={value => update('state', value)}
            {...focusProps('state')}
            required
            autoCapitalize="words"
            error={errors.state}
          />

          <InputField
            label="Pincode"
            placeholder="Enter pincode"
            value={clinic.pincode}
            onChangeText={value => update('pincode', value)}
            {...focusProps('pincode')}
            required
            keyboardType="number-pad"
            maxLength={6}
            error={errors.pincode}
          />

          <Text style={styles.mapLabel}>Locate on Map</Text>

          <Pressable
            onPress={handleOpenMap}
            style={styles.mapCard}
            accessibilityRole="button"
            accessibilityLabel="Open clinic address in Google Maps"
          >
            <Ionicons name="location-outline" size={34} color="#7B35FF" />
            <Text style={styles.mapTitle}>Open clinic location</Text>
            <Text style={styles.mapSubtitle} numberOfLines={2}>
              {[clinic.address, clinic.city, clinic.pincode]
                .map(part => part.trim())
                .filter(Boolean)
                .join(', ') || 'Address will appear here'}
            </Text>
            <Text style={styles.mapLink}>Open in Google Maps</Text>
          </Pressable>

          <View style={styles.button}>
            <GradientButton title="Next" onPress={handleNext} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  flex: {
    flex: 1,
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

  mapLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: '#221E25',
    marginBottom: 6,
  },

  mapCard: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    backgroundColor: '#F7F9FC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    marginBottom: 24,
  },

  mapTitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: '#221E25',
  },

  mapSubtitle: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 15,
    color: '#777777',
    textAlign: 'center',
  },

  mapLink: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#7B35FF',
  },

  button: {
    marginTop: 4,
  },
});

export default RegisterClinicScreen;
