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
          'Unable to open gallery',
          result.errorMessage ?? 'Please try choosing a photo again.',
        );
        return;
      }

      const asset = result.assets?.[0];

      if (!asset?.uri) {
        Alert.alert('No photo selected', 'Please choose a photo to upload.');
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
          'Unsupported file',
          'Only .jpg, .jpeg and .png images can be uploaded.',
        );
        return;
      }

      if (asset.fileSize && asset.fileSize > MAX_PHOTO_BYTES) {
        Alert.alert(
          'File too large',
          'Please choose an image smaller than 5 MB.',
        );
        return;
      }

      setPhoto(slot, asset.uri);
    } catch {
      Alert.alert(
        'Unable to open gallery',
        'Photos cannot be selected right now. Please try again.',
      );
    }
  };

  const handlePhotoPress = (slot: PhotoSlot, label: string) => {
    if (draft.photos[slot]) {
      Alert.alert(label, 'What would you like to do?', [
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
        'Session expired',
        'Please sign in again before registering your clinic.',
      );
      return;
    }

    setIsSaving(true);

    try {
      await saveClinicRegistration(user.email, draft);
      resetDraft();
      navigation.reset({
        index: 1,
        routes: [{ name: 'Home' }, { name: 'ClinicRegistered' }],
      });
    } catch {
      Alert.alert(
        'Registration failed',
        'The clinic details could not be saved on this device. Please try again.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScreenHeader
        title="Register Your Clinic"
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
          <Text style={styles.heading}>Photos</Text>
          <Text style={styles.instruction}>
            Only .jpg/.png files with 5mb max.
          </Text>

          <View style={styles.photoRow}>
            <PhotoUploadItem
              title="Entrance Photo"
              imageUri={draft.photos.entrance}
              onPress={() => handlePhotoPress('entrance', 'Entrance Photo')}
              onRemove={() => setPhoto('entrance', null)}
            />

            <PhotoUploadItem
              title="Reception Photo"
              imageUri={draft.photos.reception}
              onPress={() => handlePhotoPress('reception', 'Reception Photo')}
              onRemove={() => setPhoto('reception', null)}
            />
          </View>

          <View style={styles.button}>
            <GradientButton
              title="Register"
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
    backgroundColor: '#FFFFFF',
  },

  flex: {
    flex: 1,
  },

  content: {
    width: '100%',
    maxWidth: scale(420),
    alignSelf: 'center',
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(4),
    paddingBottom: verticalScale(32),
  },

  heading: {
    fontSize: normalizeFont(16),
    lineHeight: normalizeFont(22),
    fontWeight: '600',
    color: '#221E25',
    marginBottom: verticalScale(4),
  },

  instruction: {
    fontSize: normalizeFont(12),
    lineHeight: normalizeFont(16),
    color: '#777777',
    marginBottom: verticalScale(20),
  },

  photoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: scale(16),
    marginBottom: verticalScale(28),
  },

  button: {
    marginTop: verticalScale(4),
  },
});

export default RegisterPhotoScreen;
