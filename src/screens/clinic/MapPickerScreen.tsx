import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Camera,
  type CameraRef,
  Map,
  UserLocation,
  type ViewStateChangeEvent,
} from '@maplibre/maplibre-react-native';
import type { NativeSyntheticEvent } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import ScreenHeader from '../../components/shared/ScreenHeader';
import GradientButton from '../../components/shared/GradientButton';
import MapPin from '../../../assets/images/figma/map_pin.svg';
import {
  type Coords,
  geocodeAddress,
  getCurrentCoords,
  INDIA_CENTER,
  type PickedLocation,
  reverseGeocode,
} from '../../services/locationService';
import type { AppScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';
import strings from '../../constants/strings';
import { MAP_STYLE_URL } from '../../config/maps';

const t = strings.mapPicker;
const PIN_SIZE = scale(44);
/** Street level, so the pin can be put on the right building. */
const STREET_ZOOM = 16.5;
/** Wait for the map to settle before asking for the address. */
const LOOKUP_DELAY_MS = 450;

type Lookup =
  | { status: 'idle' | 'finding' | 'none' }
  | { status: 'found'; place: PickedLocation };

/**
 * Full-screen map with a fixed centre pin (move the map under it). Opens
 * on the saved pin, else the typed address, else the live location. The
 * address under the pin is looked up with the phone's own geocoder.
 */
const MapPickerScreen: React.FC<AppScreenProps<'MapPicker'>> = ({
  navigation,
  route,
}) => {
  const { returnTo, latitude, longitude, query } = route.params;
  const camera = useRef<CameraRef>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lookupId = useRef(0);
  const [lookup, setLookup] = useState<Lookup>({ status: 'idle' });
  const [locationDenied, setLocationDenied] = useState(false);

  const moveTo = useCallback((coords: Coords, zoom = STREET_ZOOM) => {
    camera.current?.flyTo({
      center: [coords.longitude, coords.latitude],
      zoom,
      duration: 900,
    });
  }, []);

  const goToMyLocation = useCallback(async () => {
    const here = await getCurrentCoords();
    setLocationDenied(!here);
    if (here) {
      moveTo(here);
    }
    return here;
  }, [moveTo]);

  // Where to open: saved pin → typed address → live location → India.
  useEffect(() => {
    (async () => {
      if (latitude !== undefined && longitude !== undefined) {
        moveTo({ latitude, longitude });
        getCurrentCoords(); // just to show the blue "you are here" dot
        return;
      }
      const fromAddress = query ? await geocodeAddress(query) : null;
      if (fromAddress) {
        moveTo(fromAddress, 14);
        getCurrentCoords();
        return;
      }
      await goToMyLocation();
    })();
    return () => clearTimeout(timer.current);
  }, [latitude, longitude, query, moveTo, goToMyLocation]);

  const onRegionDidChange = (
    event: NativeSyntheticEvent<ViewStateChangeEvent>,
  ) => {
    const [lng, lat] = event.nativeEvent.center;
    clearTimeout(timer.current);
    setLookup({ status: 'finding' });
    const id = ++lookupId.current;
    timer.current = setTimeout(async () => {
      const place = await reverseGeocode({ latitude: lat, longitude: lng });
      // Ignore answers for a spot the user has already moved away from.
      if (id === lookupId.current) {
        setLookup(place ? { status: 'found', place } : { status: 'none' });
      }
    }, LOOKUP_DELAY_MS);
  };

  const onRegionWillChange = () => {
    clearTimeout(timer.current);
    lookupId.current += 1;
    setLookup({ status: 'finding' });
  };

  const confirm = () => {
    if (lookup.status !== 'found') {
      return;
    }
    const params = { pickedLocation: lookup.place };
    if (returnTo === 'RegisterClinic') {
      navigation.popTo('RegisterClinic', params, { merge: true });
    } else {
      navigation.popTo('EditDetails', params, { merge: true });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScreenHeader title={t.title} onBackPress={() => navigation.goBack()} />

      <View style={styles.mapArea}>
        <Map
          style={StyleSheet.absoluteFill}
          mapStyle={MAP_STYLE_URL}
          logo={false}
          compass={false}
          onRegionWillChange={onRegionWillChange}
          onRegionDidChange={onRegionDidChange}
        >
          <Camera
            ref={camera}
            initialViewState={{
              center: [INDIA_CENTER.longitude, INDIA_CENTER.latitude],
              zoom: 4,
            }}
          />
          <UserLocation />
        </Map>

        {/* Fixed pin: its tip marks the map centre. */}
        <View style={styles.pinWrap} pointerEvents="none">
          <MapPin width={PIN_SIZE} height={PIN_SIZE} />
        </View>

        <Text style={styles.hint} pointerEvents="none">
          {t.hint}
        </Text>

        <Pressable
          onPress={goToMyLocation}
          accessibilityRole="button"
          accessibilityLabel={t.myLocation}
          style={styles.locate}
        >
          <Svg width={scale(22)} height={scale(22)} viewBox="0 0 24 24">
            <Circle
              cx={12}
              cy={12}
              r={4}
              stroke={colors.buttonPrimary}
              strokeWidth={2}
              fill="none"
            />
            <Path
              d="M12 2v4M12 18v4M2 12h4M18 12h4"
              stroke={colors.buttonPrimary}
              strokeWidth={2}
              strokeLinecap="round"
            />
          </Svg>
        </Pressable>
      </View>

      {/* Address under the pin + confirm. */}
      <View style={styles.sheet}>
        {locationDenied ? (
          <Text style={styles.warning}>{t.permissionDenied}</Text>
        ) : null}
        <View style={styles.addressRow}>
          {lookup.status === 'finding' ? (
            <>
              <ActivityIndicator color={colors.buttonPrimary} />
              <Text style={styles.muted}>{t.finding}</Text>
            </>
          ) : lookup.status === 'found' ? (
            <Text style={styles.address} numberOfLines={3}>
              {lookup.place.label}
            </Text>
          ) : lookup.status === 'none' ? (
            <Text style={styles.muted}>{t.noAddress}</Text>
          ) : null}
        </View>
        <GradientButton
          title={t.confirm}
          onPress={confirm}
          disabled={lookup.status !== 'found'}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.white,
    },
    mapArea: {
      flex: 1,
    },
    // Raise the pin by half its height so the tip (not the middle) is centred.
    pinWrap: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: PIN_SIZE,
    },
    hint: {
      position: 'absolute',
      top: verticalScale(12),
      alignSelf: 'center',
      paddingHorizontal: scale(12),
      paddingVertical: verticalScale(6),
      borderRadius: scale(14),
      overflow: 'hidden',
      backgroundColor: colors.white,
      fontSize: normalizeFont(11),
      fontFamily: fonts.medium,
      color: colors.text,
    },
    locate: {
      position: 'absolute',
      right: scale(16),
      bottom: verticalScale(16),
      width: scale(44),
      height: scale(44),
      borderRadius: scale(22),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.white,
      shadowColor: colors.shadow,
      shadowOpacity: 0.15,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
    },
    sheet: {
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(16),
      paddingBottom: verticalScale(16),
      backgroundColor: colors.white,
      gap: verticalScale(12),
    },
    warning: {
      fontSize: normalizeFont(12),
      fontFamily: fonts.regular,
      color: colors.pending,
    },
    addressRow: {
      minHeight: verticalScale(44),
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(8),
    },
    address: {
      flex: 1,
      fontSize: normalizeFont(14),
      lineHeight: normalizeFont(20),
      fontFamily: fonts.medium,
      color: colors.textStrong,
    },
    muted: {
      flex: 1,
      fontSize: normalizeFont(13),
      fontFamily: fonts.regular,
      color: colors.mutedText,
    },
    button: {
      width: '100%',
    },
  }),
);

export default MapPickerScreen;
