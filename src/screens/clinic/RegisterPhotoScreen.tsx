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
import { launchImageLibrary } from 'react-native-image-picker';

import ScreenHeader from '../../components/shared/ScreenHeader';
import StepProgress from '../../components/shared/StepProgress';
import PhotoUploadItem from '../../components/clinic/PhotoUploadItem';
import GradientButton from '../../components/shared/GradientButton';
import { useClinicRegistration } from '../../contexts/ClinicRegistrationContext';
import { useAuth } from '../../contexts/AuthContext';
import { saveClinicRegistration } from '../../services/clinicService';
import { ClinicPhotos } from '../../types/clinic';
import type { AppScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png'];

type PhotoSlot = keyof ClinicPhotos;

const RegisterPhotoScreen: React.FC<AppScreenProps<'RegisterPhotos'>> = ({
  navigation,
}) => {
  const { draft, resetDraft, setPhoto } = useClinicRegistration();
  const { user } = useAuth();

  const [isSaving, setIsSaving] = useState(false);

  const pickPhoto = async (slot: PhotoSlot) => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert(
          strings.registerPhoto.unableToOpenGallery,
          result.errorMessage ?? strings.registerPhoto.pleaseTryChoosingAPhoto,
        );
        return;
      }

      const asset = result.assets?.[0];

      if (!asset?.uri) {
        Alert.alert(
          strings.registerPhoto.noPhotoSelected,
          strings.registerPhoto.pleaseChooseAPhotoTo,
        );
        return;
      }

      const fileName = asset.fileName ?? asset.uri.split('/').pop() ?? '';
      const extension = fileName.split('.').pop()?.toLowerCase() ?? '';
      const mimeType = (asset.type ?? '').toLowerCase();
      const isAllowed =
        ALLOWED_MIME_TYPES.includes(mimeType) ||
        ALLOWED_EXTENSIONS.includes(extension);

      if (!isAllowed) {
        Alert.alert(
          strings.registerPhoto.unsupportedFile,
          strings.registerPhoto.onlyJpgJpegAndPng,
        );
        return;
      }

      if (asset.fileSize && asset.fileSize > MAX_PHOTO_BYTES) {
        Alert.alert(
          strings.registerPhoto.fileTooLarge,
          strings.registerPhoto.pleaseChooseAnImageSmaller,
        );
        return;
      }

      setPhoto(slot, asset.uri);
    } catch {
      Alert.alert(
        strings.registerPhoto.unableToOpenGallery,
        strings.registerPhoto.photosCannotBeSelectedRight,
      );
    }
  };

  const handlePhotoPress = (slot: PhotoSlot, label: string) => {
    if (draft.photos[slot]) {
      Alert.alert(label, strings.registerPhoto.whatWouldYouLikeTo, [
        { text: 'Replace', onPress: () => pickPhoto(slot) },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setPhoto(slot, null),
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return;
    }

    pickPhoto(slot);
  };

  const handleRegister = async () => {
    if (!user) {
      Alert.alert(
        strings.registerPhoto.sessionExpired,
        strings.registerPhoto.pleaseSignInAgainBefore,
      );
      return;
    }

    setIsSaving(true);

    try {
      await saveClinicRegistration(user.email, draft);
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
        title={strings.common.registerYourClinic}
        onBackPress={() => navigation.goBack()}
      />
      <StepProgress currentStep={3} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heading}>{strings.registerPhoto.photos}</Text>
          <Text style={styles.instruction}>
            {strings.registerPhoto.onlyJpgPngFilesWith}
          </Text>

          <View style={styles.photoRow}>
            <PhotoUploadItem
              title={strings.registerPhoto.n1Entrance}
              imageUri={draft.photos.entrance}
              onPress={() =>
                handlePhotoPress(
                  'entrance',
                  strings.registerPhoto.entrancePhoto,
                )
              }
            />

            <PhotoUploadItem
              title={strings.registerPhoto.n2Reception}
              imageUri={draft.photos.reception}
              onPress={() =>
                handlePhotoPress(
                  'reception',
                  strings.registerPhoto.receptionPhoto,
                )
              }
            />
          </View>

          <View style={styles.button}>
            <GradientButton
              title={strings.registerPhoto.register}
              onPress={handleRegister}
              loading={isSaving}
            />
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
    flexGrow: 1,
    paddingHorizontal: scale(16),
    paddingTop: 0,
    paddingBottom: verticalScale(110),
  },

  heading: {
    fontSize: normalizeFont(16),
    lineHeight: normalizeFont(19),
    fontFamily: fonts.semibold,
    color: colors.text,
    marginBottom: verticalScale(8),
  },

  instruction: {
    fontSize: normalizeFont(12),
    lineHeight: normalizeFont(16),
    color: colors.text,
    marginBottom: verticalScale(16),
  },

  photoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: scale(24),
  },

  // Figma pins the Register button at y634 of 800.
  button: {
    marginTop: 'auto',
    paddingTop: verticalScale(24),
  },
});

export default RegisterPhotoScreen;
