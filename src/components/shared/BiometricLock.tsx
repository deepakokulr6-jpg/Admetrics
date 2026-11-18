import React, { useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import AppLogo from './AppLogo';
import BiometryIcon from './BiometryIcon';
import GradientButton from './GradientButton';
import { authenticate, type Biometry } from '../../services/biometricService';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';
import strings from '../../constants/strings';

const t = strings.biometrics;

type Props = {
  biometry: Biometry;
  onUnlock: () => void;
  /** Fallback: sign out and log in with the password. */
  onUsePassword: () => void;
};

/**
 * Full-screen cover shown over the app while it is locked. Asks for the
 * biometric straight away; the button retries after a cancel.
 */
const BiometricLock: React.FC<Props> = ({
  biometry,
  onUnlock,
  onUsePassword,
}) => {
  const prompting = useRef(false);

  const unlock = useCallback(async () => {
    if (prompting.current) {
      return;
    }
    prompting.current = true;
    const ok = await authenticate(t.unlockPrompt);
    prompting.current = false;
    if (ok) {
      onUnlock();
    }
  }, [onUnlock]);

  useEffect(() => {
    unlock();
  }, [unlock]);

  return (
    <View style={styles.cover} accessibilityViewIsModal>
      <AppLogo />
      <View style={styles.middle}>
        <BiometryIcon kind={biometry.kind} size={scale(56)} />
        <Text style={styles.title}>{t.lockedTitle}</Text>
        <Text style={styles.message}>{t.lockedMessage(biometry.label)}</Text>
      </View>
      <GradientButton
        title={t.unlockWith(biometry.label)}
        onPress={unlock}
        style={styles.button}
      />
      <Pressable onPress={onUsePassword} accessibilityRole="button" hitSlop={8}>
        <Text style={styles.link}>{t.usePassword}</Text>
      </Pressable>
    </View>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    cover: {
      ...StyleSheet.absoluteFill,
      zIndex: 100,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: scale(32),
      backgroundColor: colors.white,
    },
    middle: {
      alignItems: 'center',
      marginTop: verticalScale(56),
      marginBottom: verticalScale(40),
    },
    title: {
      marginTop: verticalScale(20),
      fontSize: normalizeFont(18),
      fontFamily: fonts.bold,
      color: colors.textStrong,
    },
    message: {
      marginTop: verticalScale(8),
      fontSize: normalizeFont(12),
      fontFamily: fonts.regular,
      color: colors.bodyText,
      textAlign: 'center',
    },
    button: {
      width: scale(220),
    },
    link: {
      marginTop: verticalScale(20),
      fontSize: normalizeFont(12),
      fontFamily: fonts.semibold,
      color: colors.buttonPrimary,
    },
  }),
);

export default BiometricLock;
