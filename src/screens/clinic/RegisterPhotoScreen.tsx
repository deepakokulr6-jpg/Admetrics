import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

import FormScreenLayout, {
  formStyles,
} from '../../components/shared/FormScreenLayout';
import PhotoUploadItem from '../../components/clinic/PhotoUploadItem';
import GradientButton from '../../components/shared/GradientButton';
import { useClinicRegistration } from '../../hooks/useClinicRegistration';
import { ClinicPhotos } from '../../types/clinic';
import type { AppScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import strings from '../../constants/strings';
import { themedStyles } from '../../theme/themedStyles';
import { appAlert } from '../../components/shared/AppAlert';

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png'];

type PhotoSlot = keyof ClinicPhotos;

const RegisterPhotoScreen: React.FC<AppScreenProps<'RegisterPhotos'>> = ({
  navigation,
}) => {
  const { draft, setPhoto } = useClinicRegistration();

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
        appAlert(
          strings.registerPhoto.unableToOpenGallery,
          result.errorMessage ?? strings.registerPhoto.pleaseTryChoosingAPhoto,
        );
        return;
      }

      const asset = result.assets?.[0];

      if (!asset?.uri) {
        appAlert(
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
        appAlert(
          strings.registerPhoto.unsupportedFile,
          strings.registerPhoto.onlyJpgJpegAndPng,
        );
        return;
      }

      if (asset.fileSize && asset.fileSize > MAX_PHOTO_BYTES) {
        appAlert(
          strings.registerPhoto.fileTooLarge,
          strings.registerPhoto.pleaseChooseAnImageSmaller,
        );
        return;
      }

      setPhoto(slot, asset.uri);
    } catch {
      appAlert(
        strings.registerPhoto.unableToOpenGallery,
        strings.registerPhoto.photosCannotBeSelectedRight,
      );
    }
  };

  const handlePhotoPress = (slot: PhotoSlot, label: string) => {
    if (draft.photos[slot]) {
      appAlert(label, strings.registerPhoto.whatWouldYouLikeTo, [
        { text: strings.registerPhoto.replace, onPress: () => pickPhoto(slot) },
        {
          text: strings.registerPhoto.remove,
          style: 'destructive',
          onPress: () => setPhoto(slot, null),
        },
        { text: strings.common.cancel, style: 'cancel' },
      ]);
      return;
    }

    pickPhoto(slot);
  };

  const handleNext = () => navigation.navigate('RegisterMou');

  return (
    <FormScreenLayout
      title={strings.common.registerYourClinic}
      onBack={() => navigation.goBack()}
      step={3}
      contentStyle={formStyles.pinnedContent}
    >
      <Text style={formStyles.heading}>{strings.registerPhoto.photos}</Text>
      <Text style={styles.instruction}>
        {strings.registerPhoto.onlyJpgPngFilesWith}
      </Text>

      <View style={styles.photoRow}>
        <PhotoUploadItem
          title={strings.registerPhoto.n1Entrance}
          imageUri={draft.photos.entrance}
          onPress={() =>
            handlePhotoPress('entrance', strings.registerPhoto.entrancePhoto)
          }
        />

        <PhotoUploadItem
          title={strings.registerPhoto.n2Reception}
          imageUri={draft.photos.reception}
          onPress={() =>
            handlePhotoPress('reception', strings.registerPhoto.receptionPhoto)
          }
        />
      </View>

      <View style={formStyles.pinnedButton}>
        <GradientButton title={strings.common.next} onPress={handleNext} />
      </View>
    </FormScreenLayout>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
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
  }),
);

export default RegisterPhotoScreen;
