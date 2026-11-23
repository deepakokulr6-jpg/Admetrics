import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Camera, Map } from '@maplibre/maplibre-react-native';

import MapPin from '../../../assets/images/figma/map_pin.svg';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';
import { themedStyles } from '../../theme/themedStyles';
import { MAP_STYLE_URL } from '../../config/maps';

type MapPreviewProps = {
  /** Chosen pin, if any. */
  latitude?: number;
  longitude?: number;
  onPress?: () => void;
};

// Figma: "Locate on Map *" label, then a 328x191 map with 8px radius and a
// 24px pin in the middle. Shows the real map once a spot is chosen; tap
// opens the full-screen picker.
const MapPreview: React.FC<MapPreviewProps> = ({
  latitude,
  longitude,
  onPress,
}) => {
  const hasPin = latitude !== undefined && longitude !== undefined;

  return (
    <View>
      <Text style={styles.label}>{strings.mapPreview.locateOnMap}</Text>
      <Pressable
        onPress={onPress}
        style={styles.map}
        accessibilityRole="button"
        accessibilityLabel={
          hasPin
            ? strings.mapPreview.changeLocation
            : strings.mapPreview.chooseOnMap
        }
      >
        {hasPin ? (
          // Display only: touches go to the Pressable (opens the picker).
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Map
              key={`${latitude},${longitude}`}
              style={StyleSheet.absoluteFill}
              mapStyle={MAP_STYLE_URL}
              logo={false}
              compass={false}
              attribution={false}
              dragPan={false}
            >
              <Camera
                initialViewState={{ center: [longitude, latitude], zoom: 15 }}
              />
            </Map>
          </View>
        ) : (
          <Image
            source={require('../../../assets/images/figma/map.png')}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <View style={styles.pin} pointerEvents="none">
          <MapPin width={scale(24)} height={scale(24)} />
        </View>
        <View style={styles.badge} pointerEvents="none">
          <Text style={styles.badgeText}>
            {hasPin
              ? strings.mapPreview.changeLocation
              : strings.mapPreview.chooseOnMap}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    label: {
      fontSize: normalizeFont(12),
      lineHeight: normalizeFont(15),
      color: colors.text,
      marginBottom: verticalScale(8),
    },
    map: {
      width: '100%',
      height: scale(191),
      borderRadius: scale(8),
      overflow: 'hidden',
      backgroundColor: colors.surfaceMuted,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    // Tip of the pin on the centre point.
    pin: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: scale(24),
    },
    badge: {
      position: 'absolute',
      left: scale(8),
      right: scale(8),
      bottom: verticalScale(8),
      alignItems: 'center',
    },
    badgeText: {
      paddingHorizontal: scale(10),
      paddingVertical: verticalScale(4),
      borderRadius: scale(12),
      overflow: 'hidden',
      backgroundColor: colors.white,
      fontSize: normalizeFont(11),
      fontFamily: fonts.medium,
      color: colors.text,
    },
  }),
);

export default MapPreview;
