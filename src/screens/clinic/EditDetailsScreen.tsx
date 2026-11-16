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

import ScreenHeader from '../../components/shared/ScreenHeader';
import StepProgress from '../../components/shared/StepProgress';
import InputField from '../../components/shared/InputField';
import GradientButton from '../../components/shared/GradientButton';
import MapPreview from '../../components/clinic/MapPreview';
import type { AppScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';
import { sampleClinic } from '../../constants/mockData';

const EditDetailsScreen: React.FC<AppScreenProps<'EditDetails'>> = ({
  navigation,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const nextErrors: Record<string, string> = {};

    if (!clinicName.trim()) {
      nextErrors.clinicName = strings.clinicForm.clinicNameIsRequired;
    }
    if (!medicalRegistrationNumber.trim()) {
      nextErrors.medicalRegistrationNumber =
        strings.clinicForm.medicalRegistrationNumberIsRequired;
    }

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

  // Demo data until the API is connected (constants/mockData).
  const {
    clinicName,
    medicalRegistrationNumber,
    establishmentYear,
    licenceNumber,
    gstNumber,
    panNumber,
    address,
    street,
    city,
    state,
    pincode,
  } = sampleClinic;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScreenHeader
        title={strings.editDetails.editDetails}
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
          <Text style={styles.heading}>{strings.common.clinicInformation}</Text>

          <InputField
            label={strings.clinicForm.clinicName}
            placeholder={strings.clinicForm.enterClinicName}
            value={clinicName}
            onChangeText={() => {}}
            required
            autoCapitalize="words"
            error={errors.clinicName}
          />

          <InputField
            label={strings.clinicForm.medicalRegistrationNumber}
            placeholder={strings.clinicForm.enterMedicalRegistrationNumber}
            value={medicalRegistrationNumber}
            onChangeText={() => {}}
            required
            error={errors.medicalRegistrationNumber}
          />

          <InputField
            label={strings.clinicForm.establishmentYear}
            placeholder={strings.clinicForm.eG2023}
            value={establishmentYear}
            onChangeText={() => {}}
            keyboardType="number-pad"
            maxLength={4}
            error={errors.establishmentYear}
          />

          <InputField
            label={strings.clinicForm.registrationLicenceNumber}
            placeholder={strings.clinicForm.enterRegistrationOrLicenceNumber}
            value={licenceNumber}
            onChangeText={() => {}}
            required
            autoCapitalize="characters"
            error={errors.licenceNumber}
          />

          <InputField
            label={strings.clinicForm.gstNumber}
            placeholder={strings.clinicForm.enterGstNumber}
            value={gstNumber}
            onChangeText={() => {}}
            required
            autoCapitalize="characters"
            maxLength={15}
            error={errors.gstNumber}
          />

          <InputField
            label={strings.clinicForm.panNumber}
            placeholder={strings.clinicForm.enterPanNumber}
            value={panNumber}
            onChangeText={() => {}}
            autoCapitalize="characters"
            maxLength={10}
            error={errors.panNumber}
          />

          <InputField
            label={strings.clinicForm.address}
            placeholder={strings.clinicForm.enterClinicAddress}
            value={address}
            onChangeText={() => {}}
            autoCapitalize="sentences"
            error={errors.address}
          />

          <InputField
            label={strings.clinicForm.street}
            placeholder={strings.clinicForm.enterStreet}
            value={street}
            onChangeText={() => {}}
            autoCapitalize="sentences"
            error={errors.street}
          />

          <InputField
            label={strings.clinicForm.city}
            placeholder={strings.clinicForm.enterCity}
            value={city}
            onChangeText={() => {}}
            autoCapitalize="words"
            error={errors.city}
          />

          <InputField
            label={strings.clinicForm.state}
            placeholder={strings.clinicForm.enterState}
            value={state}
            onChangeText={() => {}}
            autoCapitalize="words"
            error={errors.state}
          />

          <InputField
            label={strings.clinicForm.pincode}
            placeholder={strings.clinicForm.enterPincode}
            value={pincode}
            onChangeText={() => {}}
            keyboardType="number-pad"
            maxLength={6}
            error={errors.pincode}
          />

          <MapPreview />

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

export default EditDetailsScreen;
