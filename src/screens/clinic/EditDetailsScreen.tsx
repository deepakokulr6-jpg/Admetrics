import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ScreenHeader from '../../components/shared/ScreenHeader';
import StepProgress from '../../components/shared/StepProgress';
import InputField from '../../components/shared/InputField';
import GradientButton from '../../components/shared/GradientButton';
import type { AppScreenProps } from '../../navigation/types';

const EditDetailsScreen: React.FC<AppScreenProps<'EditDetails'>> = ({
  navigation,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const nextErrors: Record<string, string> = {};

    if (!clinicName.trim()) {
      nextErrors.clinicName = 'Clinic name is required.';
    }
    if (!medicalRegistrationNumber.trim()) {
      nextErrors.medicalRegistrationNumber =
        'Medical registration number is required.';
    }

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

  const clinicName = 'Sai Shree Clinic';
  const medicalRegistrationNumber = '195934';
  const establishmentYear = '2023';
  const licenceNumber = 'KMC/BLR/2024/45892';
  const gstNumber = '29ABCDE1234F1Z5';
  const panNumber = 'ABCDE1234F';
  const address = 'No. 27, 2nd Main Road, Near';
  const street = '1st Cross, Indhra Nagar';
  const city = 'Mysore';
  const state = 'Karnataka';
  const pincode = '568902';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Edit Details"
        onBackPress={() => navigation.goBack()}
      />
      <StepProgress currentStep={1} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heading}>Clinic Information</Text>

          <InputField
            label="Clinic Name"
            placeholder="Enter clinic name"
            value={clinicName}
            onChangeText={() => {}}
            required
            autoCapitalize="words"
            error={errors.clinicName}
          />

          <InputField
            label="Medical Registration Number"
            placeholder="Enter medical registration number"
            value={medicalRegistrationNumber}
            onChangeText={() => {}}
            required
            error={errors.medicalRegistrationNumber}
          />

          <InputField
            label="Establishment Year"
            placeholder="e.g. 2023"
            value={establishmentYear}
            onChangeText={() => {}}
            required
            keyboardType="number-pad"
            maxLength={4}
            error={errors.establishmentYear}
          />

          <InputField
            label="Registration/Licence Number"
            placeholder="Enter registration or licence number"
            value={licenceNumber}
            onChangeText={() => {}}
            required
            autoCapitalize="characters"
            error={errors.licenceNumber}
          />

          <InputField
            label="GST Number"
            placeholder="Enter GST number"
            value={gstNumber}
            onChangeText={() => {}}
            required
            autoCapitalize="characters"
            maxLength={15}
            error={errors.gstNumber}
          />

          <InputField
            label="PAN Number"
            placeholder="Enter PAN number"
            value={panNumber}
            onChangeText={() => {}}
            autoCapitalize="characters"
            maxLength={10}
            error={errors.panNumber}
          />

          <InputField
            label="Address"
            placeholder="Enter clinic address"
            value={address}
            onChangeText={() => {}}
            required
            autoCapitalize="sentences"
            multiline
            numberOfLines={2}
            error={errors.address}
          />

          <InputField
            label="Street"
            placeholder="Enter street"
            value={street}
            onChangeText={() => {}}
            required
            autoCapitalize="sentences"
            error={errors.street}
          />

          <InputField
            label="City"
            placeholder="Enter city"
            value={city}
            onChangeText={() => {}}
            required
            autoCapitalize="words"
            error={errors.city}
          />

          <InputField
            label="State"
            placeholder="Enter state"
            value={state}
            onChangeText={() => {}}
            required
            autoCapitalize="words"
            error={errors.state}
          />

          <InputField
            label="Pincode"
            placeholder="Enter pincode"
            value={pincode}
            onChangeText={() => {}}
            required
            keyboardType="number-pad"
            maxLength={6}
            error={errors.pincode}
          />

          <Text style={styles.mapLabel}>Locate on Map</Text>

          <View style={styles.mapCard}>
            <Ionicons name="location-outline" size={34} color="#7B35FF" />
            <Text style={styles.mapTitle}>Open clinic location</Text>
            <Text style={styles.mapSubtitle} numberOfLines={2}>
              {address}, {city}, {pincode}
            </Text>
            <Text style={styles.mapLink}>Open in Google Maps</Text>
          </View>

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

export default EditDetailsScreen;
