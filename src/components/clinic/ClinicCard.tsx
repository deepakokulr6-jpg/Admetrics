import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import TvOn from '../../../assets/images/figma/tv_on.svg';
import TvOff from '../../../assets/images/figma/tv_off.svg';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';

type Props = {
  status?: string;
  clinicName: string;
  contactName: string;
  designation: string;
  phone: string;
  email: string;
  photoOneColor?: string;
  photoTwoColor?: string;
  photoOneUri?: string | null;
  photoTwoUri?: string | null;
  displayCount?: number;
  onlineDisplays?: number;
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
  photoOneColor = '#B8C8D4',
  photoTwoColor = '#C8C3B8',
  photoOneUri,
  photoTwoUri,
  displayCount,
  onlineDisplays = 1,
}) => (
  <View style={styles.card}>
    <View style={styles.strip}>
      {status ? (
        <View style={styles.row}>
          <View style={styles.dot} />
          <Text style={styles.status}>{status}</Text>
        </View>
      ) : displayCount ? (
        <>
          <Text style={styles.displays}>{displayCount} Displays</Text>
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
        <Text style={styles.detail} numberOfLines={1}>{contactName}</Text>
        <Text style={styles.detail} numberOfLines={1}>{designation}</Text>
        <Text style={styles.detail} numberOfLines={1}>{phone}</Text>
        <Text style={styles.detail} numberOfLines={1}>{email}</Text>
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
              <Image source={{ uri: photo.uri }} style={styles.photoImage} />
            ) : null}
          </View>
        ))}
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
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
    backgroundColor: '#FF2A2A',
    marginRight: scale(8),
  },
  status: {
    fontSize: normalizeFont(12),
    fontWeight: '500',
    color: '#FF2A2A',
  },
  displays: {
    fontSize: normalizeFont(12),
    fontWeight: '500',
    color: '#221E25',
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
    fontWeight: '600',
    color: '#221E25',
    marginBottom: scale(6),
  },
  detail: {
    fontSize: normalizeFont(12),
    lineHeight: normalizeFont(17),
    color: '#565656',
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
});

export default ClinicCard;
