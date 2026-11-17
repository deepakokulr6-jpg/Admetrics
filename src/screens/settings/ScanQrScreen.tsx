import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Camera, CameraType } from 'react-native-camera-kit';

import ScreenHeader from '../../components/shared/ScreenHeader';
import GradientButton from '../../components/shared/GradientButton';
import type { AppScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';
import strings from '../../constants/strings';
import { SAMPLE_TV_SERIAL } from '../../constants/mockData';

// Figma: 280px scan window, rounded corner brackets, blue line that runs
// 20px past the window on both sides and sweeps top → bottom.
const FRAME = scale(280);
const CORNER = scale(76);
const LINE_OVERHANG = scale(20);

/** The four rounded corner brackets around the scan window. */
const Corners = () => {
  const r = 12;
  const c = 76;
  const s = 280;
  return (
    <Svg width={FRAME} height={FRAME} viewBox={`0 0 ${s} ${s}`}>
      <Path
        d={`M1 ${c}V${r}a${r - 1} ${r - 1} 0 01${r - 1}-${r - 1}H${c}
            M${s - c} 1H${s - r}a${r - 1} ${r - 1} 0 01${r - 1} ${r - 1}V${c}
            M${s - 1} ${s - c}V${s - r}a${r - 1} ${r - 1} 0 01-${r - 1} ${
          r - 1
        }H${s - c}
            M${c} ${s - 1}H${r}a${r - 1} ${r - 1} 0 01-${r - 1}-${r - 1}V${
          s - c
        }`}
        stroke={colors.onAccent}
        strokeWidth={2}
        fill="none"
      />
    </Svg>
  );
};

type Permission = 'checking' | 'granted' | 'denied';

const askCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    // iOS shows its own prompt (NSCameraUsageDescription) on first use.
    return true;
  }
  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA,
  );
  return result === PermissionsAndroid.RESULTS.GRANTED;
};

/** Live camera that reads the TV's QR code, then asks for a device name. */
const ScanQrScreen: React.FC<AppScreenProps<'ScanQr'>> = ({ navigation }) => {
  const [permission, setPermission] = useState<Permission>('checking');
  const scanned = useRef(false);
  const sweep = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    askCameraPermission().then(ok => setPermission(ok ? 'granted' : 'denied'));
  }, []);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(sweep, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(sweep, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [sweep]);

  const onRead = (value: string) => {
    const serial = value.trim();
    // The camera keeps firing while the code is in view; act on the first.
    if (!serial || scanned.current) {
      return;
    }
    scanned.current = true;
    navigation.replace('DeviceDetails', { serial });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScreenHeader
        title={strings.scanQr.title}
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.viewer}>
        {permission === 'granted' ? (
          <Camera
            style={StyleSheet.absoluteFill}
            cameraType={CameraType.Back}
            scanBarcode
            showFrame={false}
            onReadCode={event => onRead(event.nativeEvent.codeStringValue)}
          />
        ) : null}

        {permission === 'denied' ? (
          <View style={styles.denied}>
            <Text style={styles.deniedText}>{strings.scanQr.cameraDenied}</Text>
            <GradientButton
              title={strings.scanQr.openSettings}
              onPress={() => Linking.openSettings()}
            />
          </View>
        ) : (
          <View style={styles.frame} pointerEvents="none">
            <Corners />
            <Animated.View
              style={[
                styles.line,
                {
                  transform: [
                    {
                      translateY: sweep.interpolate({
                        inputRange: [0, 1],
                        outputRange: [CORNER * 0.75, FRAME - CORNER * 0.75],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>
        )}

        {/* Temporary: move on without a real scan (simulator / testing). */}
        <View style={styles.manual}>
          <GradientButton
            title={strings.scanQr.confirmScan}
            onPress={() => onRead(SAMPLE_TV_SERIAL)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.shadow,
    },
    // Camera area is always black, in light and dark mode.
    viewer: {
      flex: 1,
      backgroundColor: colors.shadow,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    frame: {
      width: FRAME,
      height: FRAME,
    },
    line: {
      position: 'absolute',
      top: 0,
      left: -LINE_OVERHANG,
      right: -LINE_OVERHANG,
      height: 2,
      backgroundColor: colors.buttonPrimary,
    },
    manual: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: verticalScale(48),
    },
    denied: {
      paddingHorizontal: scale(32),
      alignItems: 'center',
      gap: verticalScale(24),
    },
    deniedText: {
      fontSize: normalizeFont(14),
      lineHeight: normalizeFont(20),
      fontFamily: fonts.regular,
      color: colors.onAccent,
      textAlign: 'center',
    },
  }),
);

export default ScanQrScreen;
