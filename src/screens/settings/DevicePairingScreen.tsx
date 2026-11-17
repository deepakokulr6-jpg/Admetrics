import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { AppScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';
import strings from '../../constants/strings';

const t = strings.devicePairing;
const SPINNER = require('../../../assets/images/figma/spinner.png');

// TODO: replace the timers with the real pairing API call.
const VERIFY_MS = 1800;
const DONE_MS = 1200;

/**
 * Bottom sheet over the dimmed Add Device screen: glides up showing
 * "Verifying..." with a spinner, switches to "Verified", then slides away
 * and returns to Settings. Can't be dismissed while the TV is linking.
 */
const DevicePairingScreen: React.FC<AppScreenProps<'DevicePairing'>> = ({
  navigation,
}) => {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [verified, setVerified] = useState(false);

  // Figma: sheet is ~60% of the screen.
  const sheetHeight = Math.round(height * 0.6);
  const backdrop = useRef(new Animated.Value(0)).current;
  const offset = useRef(new Animated.Value(sheetHeight)).current;
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(backdrop, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(offset, {
        toValue: 0,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const spinLoop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    spinLoop.start();

    const verify = setTimeout(() => setVerified(true), VERIFY_MS);
    const leave = setTimeout(() => {
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 0,
          duration: 240,
          useNativeDriver: true,
        }),
        Animated.timing(offset, {
          toValue: sheetHeight,
          duration: 280,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => navigation.popTo('Settings'));
    }, VERIFY_MS + DONE_MS);

    return () => {
      spinLoop.stop();
      clearTimeout(verify);
      clearTimeout(leave);
    };
  }, [navigation, backdrop, offset, spin, sheetHeight]);

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.backdrop, { opacity: backdrop }]} />

      <Animated.View
        style={[
          styles.sheet,
          {
            height: sheetHeight,
            paddingBottom: insets.bottom,
            transform: [{ translateY: offset }],
          },
        ]}
      >
        <View style={styles.spinnerSlot}>
          {verified ? null : (
            <Animated.Image
              source={SPINNER}
              style={[
                styles.spinner,
                {
                  transform: [
                    {
                      rotate: spin.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}
            />
          )}
        </View>
        <Text style={styles.title} accessibilityLiveRegion="polite">
          {verified ? t.verified : t.verifying}
        </Text>
        <Text style={styles.message}>{t.message}</Text>
      </Animated.View>
    </View>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor: colors.sheetBackdrop,
    },
    sheet: {
      alignItems: 'center',
      paddingHorizontal: scale(24),
      paddingTop: verticalScale(56),
      borderTopLeftRadius: scale(24),
      borderTopRightRadius: scale(24),
      backgroundColor: colors.white,
    },
    // Keeps the title in place when the spinner disappears.
    spinnerSlot: {
      height: scale(28),
      justifyContent: 'center',
      marginBottom: verticalScale(36),
    },
    spinner: {
      width: scale(28),
      height: scale(28),
    },
    title: {
      fontSize: normalizeFont(18),
      lineHeight: normalizeFont(24),
      fontFamily: fonts.bold,
      color: colors.textStrong,
    },
    message: {
      marginTop: verticalScale(12),
      fontSize: normalizeFont(12),
      lineHeight: normalizeFont(16),
      fontFamily: fonts.regular,
      color: colors.bodyText,
      textAlign: 'center',
    },
  }),
);

export default DevicePairingScreen;
