import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  type ImageSourcePropType,
  Pressable,
} from 'react-native';
import TvOn from '../../../assets/images/figma/tv_on.svg';
import TvOff from '../../../assets/images/figma/tv_off.svg';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import strings from '../../constants/strings';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';

type Props = {
  status?: string;
  clinicName: string;
  contactName: string;
  designation: string;
  phone: string;
  email: string;
  photoOneColor?: string;
  photoTwoColor?: string;
  /** A file/remote uri or a bundled image (require). */
  photoOneUri?: string | ImageSourcePropType | null;
  photoTwoUri?: string | ImageSourcePropType | null;
  displayCount?: number;
  onlineDisplays?: number;
  onPress?: () => void;
};

// Figma (Android Large - 15): 328x144 white card, 1px #DDD border, 6px radius.
// Top strip shows either the approval status (red dot + text) or the display
// count with TV icons; details on the left, two 80x89 photos on the right.
const ClinicCard: React.FC<Props> = ({
  status,
  clinicName,
  contactName,
  designation,
  phone,
  email,
  photoOneColor = colors.photoPlaceholder1,
  photoTwoColor = colors.photoPlaceholder2,
  photoOneUri,
  photoTwoUri,
  displayCount,
  onlineDisplays = 1,
  onPress,
}) => (
  <Pressable
    style={({ pressed }) => [styles.card, pressed && onPress && styles.pressed]}
    onPress={onPress}
    disabled={!onPress}
    accessibilityRole={onPress ? 'button' : undefined}
  >
    <View style={styles.strip}>
      {status ? (
        <View style={styles.row}>
          <View style={styles.dot} />
          <Text style={styles.status}>{status}</Text>
        </View>
      ) : displayCount ? (
        <>
          <Text style={styles.displays}>
            {strings.clinicCard.displaysCount(displayCount)}
          </Text>
          <View style={styles.tvs}>
            {Array.from({ length: displayCount }, (_, index) => {
              // Online screens are listed from the right, as in Figma.
              const online = index >= displayCount - onlineDisplays;
              const Tv = online ? TvOn : TvOff;
              return (
                <View key={index} style={styles.tv}>
                  <Tv width={scale(23.7)} height={scale(19.55)} />
                </View>
              );
            })}
          </View>
        </>
      ) : null}
    </View>

    <View style={styles.body}>
      <View style={styles.info}>
        <Text style={styles.clinicName} numberOfLines={1}>
          {clinicName}
        </Text>
        <Text style={styles.detail} numberOfLines={1}>
          {contactName}
        </Text>
        <Text style={styles.detail} numberOfLines={1}>
          {designation}
        </Text>
        <Text style={styles.detail} numberOfLines={1}>
          {phone}
        </Text>
        <Text style={styles.detail} numberOfLines={1}>
          {email}
        </Text>
      </View>

      <View style={styles.photos}>
        {[
          { uri: photoOneUri, color: photoOneColor },
          { uri: photoTwoUri, color: photoTwoColor },
        ].map((photo, index) => (
          <View
            key={index}
            style={[styles.photo, { backgroundColor: photo.color }]}
          >
            {photo.uri ? (
              <Image
                source={
                  typeof photo.uri === 'string' ? { uri: photo.uri } : photo.uri
                }
                style={styles.photoImage}
              />
            ) : null}
          </View>
        ))}
      </View>
    </View>
  </Pressable>
);

const styles = themedStyles(() =>
  StyleSheet.create({
    pressed: {
      opacity: 0.7,
    },
    card: {
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.borderLight,
      borderRadius: scale(6),
      paddingHorizontal: scale(16),
      paddingBottom: verticalScale(16),
    },
    strip: {
      height: scale(31),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dot: {
      width: scale(8),
      height: scale(8),
      borderRadius: scale(4),
      backgroundColor: colors.red,
      marginRight: scale(8),
    },
    status: {
      fontSize: normalizeFont(12),
      fontFamily: fonts.medium,
      color: colors.red,
    },
    displays: {
      fontSize: normalizeFont(12),
      fontFamily: fonts.medium,
      color: colors.text,
    },
    tvs: {
      flexDirection: 'row',
      gap: scale(8),
      marginRight: scale(-12),
    },
    tv: {
      width: scale(24),
      height: scale(24),
      alignItems: 'center',
      justifyContent: 'center',
    },
    body: {
      flexDirection: 'row',
      marginTop: scale(8),
    },
    info: {
      flex: 1,
    },
    clinicName: {
      fontSize: normalizeFont(14),
      fontFamily: fonts.semibold,
      color: colors.text,
      marginBottom: scale(6),
    },
    detail: {
      fontSize: normalizeFont(12),
      lineHeight: normalizeFont(17),
      color: colors.secondaryText,
    },
    photos: {
      flexDirection: 'row',
      gap: scale(8),
    },
    photo: {
      width: scale(80),
      height: scale(89),
      borderRadius: scale(5.33),
      overflow: 'hidden',
    },
    photoImage: {
      width: '100%',
      height: '100%',
    },
  }),
);

export default ClinicCard;
