import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import MapPin from '../../../assets/images/figma/map_pin.svg';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import strings from '../../constants/strings';
import { themedStyles } from '../../theme/themedStyles';

type MapPreviewProps = {
  onPress?: () => void;
};

// Figma: "Locate on Map *" label, then a 328x191 map image with 8px radius
// and a 24px pin in the middle.
const MapPreview: React.FC<MapPreviewProps> = ({ onPress }) => (
  <View>
    <Text style={styles.label}>{strings.mapPreview.locateOnMap}</Text>
    <Pressable
      onPress={onPress}
      style={styles.map}
      accessibilityRole="button"
      accessibilityLabel={strings.mapPreview.openClinicAddressInGoogle}
    >
      <Image
        source={require('../../../assets/images/figma/map.png')}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.pin} pointerEvents="none">
        <MapPin width={scale(24)} height={scale(24)} />
      </View>
    </Pressable>
  </View>
);

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
    },
    image: {
      width: '100%',
      height: '100%',
    },
    pin: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
);

export default MapPreview;
