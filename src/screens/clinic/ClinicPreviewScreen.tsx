import React, { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../../components/shared/ScreenHeader';
import GradientButton from '../../components/shared/GradientButton';
import StatusSheet, {
  type SheetStatus,
} from '../../components/shared/StatusSheet';
import ClinicSummary from '../../components/clinic/ClinicSummary';
import SignaturePreview from '../../components/clinic/SignaturePreview';
import { useClinicRegistration } from '../../hooks/useClinicRegistration';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch } from '../../store/hooks';
import { registerClinic } from '../../store/slices/clinicsSlice';
import type { AppScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import { fonts } from '../../theme/typography';
import colors from '../../theme/colors';
import strings from '../../constants/strings';
import { themedStyles } from '../../theme/themedStyles';
import { appAlert } from '../../components/shared/AppAlert';

const joinAddress = (parts: string[], pincode: string) => {
  const address = parts
    .map(part => part.trim())
    .filter(Boolean)
    .join(', ');
  return pincode.trim() ? `${address} – ${pincode.trim()}` : address;
};

const MIN_LOADING_MS = 1200;
/** How long "Clinic Added" stays up before the sheet closes. */
const SUCCESS_MS = 1800;
const wait = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(() => resolve(), ms);
  });

/** Last step: review everything entered, then Register. */
const ClinicPreviewScreen: React.FC<AppScreenProps<'ClinicPreview'>> = ({
  navigation,
}) => {
  const { draft, resetDraft } = useClinicRegistration();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [isSaving, setIsSaving] = useState(false);
  // Same "Verifying..." → success sheet as Add Device.
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetStatus, setSheetStatus] = useState<SheetStatus>('loading');
  const outcome = useRef<'saved' | 'failed' | null>(null);
  const { clinic, personal, photos } = draft;

  const handleRegister = async () => {
    if (!user) {
      appAlert(
        strings.registerPhoto.sessionExpired,
        strings.registerPhoto.pleaseSignInAgainBefore,
      );
      return;
    }

    if (!draft.signature) {
      appAlert(strings.mou.signatureRequired, strings.mou.pleaseSignTheMou);
      return;
    }

    setIsSaving(true);
    setSheetStatus('loading');
    setSheetVisible(true);
    outcome.current = null;

    try {
      // Keep the spinner up briefly even when saving is instant.
      await Promise.all([
        dispatch(registerClinic({ owner: user.email, draft })).unwrap(),
        wait(MIN_LOADING_MS),
      ]);
      outcome.current = 'saved';
      setSheetStatus('success');
      await wait(SUCCESS_MS);
    } catch {
      outcome.current = 'failed';
    }
    setSheetVisible(false);
  };

  /** After the sheet has slid away: go to the clinic list, or explain. */
  const onSheetHidden = () => {
    setIsSaving(false);
    if (outcome.current === 'saved') {
      resetDraft();
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs', params: { screen: 'Clinics' } }],
      });
    } else if (outcome.current === 'failed') {
      appAlert(
        strings.registerPhoto.registrationFailed,
        strings.registerPhoto.theClinicDetailsCouldNot,
      );
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
          photoLabels
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

        {/* The signed MOU: signature + link to the signed PDF. */}
        {draft.signature ? (
          <Pressable
            onPress={() =>
              draft.signedMouUrl
                ? navigation.navigate('SignedMou', { url: draft.signedMouUrl })
                : navigation.navigate('MouAgreement')
            }
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.mouCard,
              pressed && styles.mouCardPressed,
            ]}
          >
            <Text style={styles.mouTitle}>{strings.mou.signedMou}</Text>
            <Text style={styles.mouStatus}>
              {draft.signedMouUrl
                ? strings.mou.signedOnline
                : strings.mou.signedOnDevice}
            </Text>
            <View style={styles.signatureBox}>
              <SignaturePreview
                path={draft.signature}
                width={scale(220)}
                height={verticalScale(80)}
              />
            </View>
            <Text style={styles.mouLink}>
              {draft.signedMouUrl
                ? strings.mou.viewSignedMou
                : strings.mou.viewMou}
            </Text>
          </Pressable>
        ) : null}

        <View style={styles.button}>
          <GradientButton
            title={strings.mou.register}
            onPress={handleRegister}
            loading={isSaving}
          />
        </View>
      </ScrollView>

      <StatusSheet
        visible={sheetVisible}
        status={sheetStatus}
        title={
          sheetStatus === 'success'
            ? strings.clinicSubmit.added
            : strings.clinicSubmit.registering
        }
        message={
          sheetStatus === 'success'
            ? strings.clinicSubmit.addedMessage
            : strings.clinicSubmit.savingMessage
        }
        onHidden={onSheetHidden}
      />
    </SafeAreaView>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
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
    mouCard: {
      marginTop: verticalScale(24),
      padding: scale(16),
      borderRadius: scale(8),
      borderWidth: 1,
      borderColor: colors.borderLight,
      backgroundColor: colors.white,
    },
    mouCardPressed: {
      backgroundColor: colors.background,
    },
    mouTitle: {
      fontSize: normalizeFont(16),
      fontFamily: fonts.semibold,
      color: colors.text,
    },
    mouStatus: {
      marginTop: verticalScale(4),
      fontSize: normalizeFont(12),
      fontFamily: fonts.regular,
      color: colors.success,
    },
    signatureBox: {
      marginTop: verticalScale(12),
      alignItems: 'center',
      paddingVertical: verticalScale(8),
      borderRadius: scale(6),
      backgroundColor: colors.background,
    },
    mouLink: {
      marginTop: verticalScale(12),
      fontSize: normalizeFont(12),
      fontFamily: fonts.semibold,
      color: colors.buttonPrimary,
    },
  }),
);

export default ClinicPreviewScreen;
