import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Placeholder from '../../../assets/images/figma/photo_placeholder.svg';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import strings from '../../constants/strings';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';

interface PhotoUploadProps {
  title: string;
  imageUri?: string | null;
  onPress: () => void;
  onRemove?: () => void;
}

const BOX = scale(120);
const PLUS =
  'M12 24C10.8753 24 9.96364 23.0883 9.96364 21.9636V2.03636C9.96364 0.91171 10.8753 0 12 0C13.1247 0 14.0364 0.911711 14.0364 2.03636V21.9636C14.0364 23.0883 13.1247 24 12 24ZM2.03637 14.0364C0.911713 14.0364 0 13.1247 0 12C0 10.8753 0.911712 9.96364 2.03636 9.96364H21.9636C23.0883 9.96364 24 10.8753 24 12C24 13.1247 23.0883 14.0364 21.9636 14.0364H2.03637Z';

// Figma: numbered 12px medium label, 120x120 box with 8px radius.
// Empty = grey box with "+"; filled = the photo with a "+" over it.
const PhotoUpload: React.FC<PhotoUploadProps> = ({
  title,
  imageUri,
  onPress,
}) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>

    <Pressable
      onPress={onPress}
      style={styles.box}
      accessibilityRole="button"
      accessibilityLabel={
        imageUri
          ? strings.photoUploadItem.replacePhoto(title)
          : strings.photoUploadItem.uploadPhoto(title)
      }
    >
      {imageUri ? (
        <>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.overlay} pointerEvents="none">
            <Svg width={scale(24)} height={scale(24)} viewBox="0 0 24 24">
              <Path d={PLUS} fill={colors.border} />
            </Svg>
          </View>
        </>
      ) : (
        <Placeholder width={BOX} height={BOX} />
      )}
    </Pressable>
  </View>
);

const styles = themedStyles(() =>
  StyleSheet.create({
    container: {
      width: BOX,
    },
    title: {
      fontSize: normalizeFont(12),
      lineHeight: normalizeFont(15),
      fontFamily: fonts.medium,
      color: colors.text,
      marginBottom: verticalScale(8),
    },
    box: {
      width: BOX,
      height: BOX,
      borderRadius: scale(8),
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    overlay: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
);

export default PhotoUpload;
