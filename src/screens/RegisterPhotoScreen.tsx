import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';

import ScreenHeader from '../components/ScreenHeader';
import StepProgress from '../components/StepProgress';
import PhotoUploadItem from '../components/PhotoUploadItem';
import GradientButton from '../components/GradientButton';
import { useClinicRegistration } from '../context/ClinicRegistrationContext';
import { useAuth } from '../context/AuthContext';
import { saveClinicRegistration } from '../services/clinicService';
import { ClinicPhotos } from '../types/clinic';
import type { AppScreenProps } from '../navigation/types';

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png'];

type PhotoSlot = keyof ClinicPhotos;

const RegisterPhotoScreen: React.FC<AppScreenProps<'RegisterPhotos'>> = ({
  navigation,
}) => {
  const { draft, setPhoto } = useClinicRegistration();
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
      <StepProgress currentStep={4} />

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
    marginBottom: 4,
  },

  instruction: {
    fontSize: 12,
    lineHeight: 16,
    color: '#777777',
    marginBottom: 20,
  },

  photoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 28,
  },

  button: {
    marginTop: 4,
  },
});

export default RegisterPhotoScreen;
