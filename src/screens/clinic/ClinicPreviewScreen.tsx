import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../../components/shared/ScreenHeader';
import GradientButton from '../../components/shared/GradientButton';
import ClinicSummary from '../../components/clinic/ClinicSummary';
import { useClinicRegistration } from '../../hooks/useClinicRegistration';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch } from '../../store/hooks';
import { registerClinic } from '../../store/slices/clinicsSlice';
import type { AppScreenProps } from '../../navigation/types';
import { scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import strings from '../../constants/strings';

const joinAddress = (parts: string[], pincode: string) => {
  const address = parts
    .map(part => part.trim())
    .filter(Boolean)
    .join(', ');
  return pincode.trim() ? `${address} – ${pincode.trim()}` : address;
};

/** Last step: review everything entered, then Register. */
const ClinicPreviewScreen: React.FC<AppScreenProps<'ClinicPreview'>> = ({
  navigation,
}) => {
  const { draft, resetDraft } = useClinicRegistration();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [isSaving, setIsSaving] = useState(false);
  const { clinic, personal, photos } = draft;

  const handleRegister = async () => {
    if (!user) {
      Alert.alert(
        strings.registerPhoto.sessionExpired,
        strings.registerPhoto.pleaseSignInAgainBefore,
      );
      return;
    }

    if (!draft.signature) {
      Alert.alert(strings.mou.signatureRequired, strings.mou.pleaseSignTheMou);
      return;
    }

    setIsSaving(true);

    try {
      await dispatch(registerClinic({ owner: user.email, draft })).unwrap();
      resetDraft();
      navigation.reset({
        index: 1,
        routes: [
          { name: 'MainTabs', params: { screen: 'Clinics' } },
          { name: 'ClinicRegistered' },
        ],
      });
    } catch {
      Alert.alert(
        strings.registerPhoto.registrationFailed,
        strings.registerPhoto.theClinicDetailsCouldNot,
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScreenHeader
        title={strings.mou.preview}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ClinicSummary
          data={{
            name: clinic.clinicName,
            address: joinAddress(
              [clinic.address, clinic.street, clinic.city, clinic.state],
              clinic.pincode,
            ),
            medicalRegistrationNumber: clinic.medicalRegistrationNumber,
            establishmentYear: clinic.establishmentYear,
            licenceNumber: clinic.licenceNumber,
            gstNumber: clinic.gstNumber,
            panNumber: clinic.panNumber,
            contactPerson: personal.contactPerson,
            designation: personal.designation,
            mobile: personal.mobile,
            email: personal.email,
            photos: [photos.entrance, photos.reception].map(uri =>
              uri ? { uri } : null,
            ),
          }}
        />

        <View style={styles.button}>
          <GradientButton
            title={strings.mou.register}
            onPress={handleRegister}
            loading={isSaving}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(32),
  },
  button: {
    marginTop: verticalScale(24),
  },
});

export default ClinicPreviewScreen;
