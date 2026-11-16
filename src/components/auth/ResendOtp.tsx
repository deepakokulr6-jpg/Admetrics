import React, { useEffect, useState } from 'react';
import { AppState, Pressable, StyleSheet, Text } from 'react-native';

import { normalizeFont } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';

type Props = {
  /** Time the OTP was (re)sent – changing it restarts the countdown. */
  sentAt: number;
  onResend: () => void;
  seconds?: number;
  disabled?: boolean;
};

const remainingFrom = (sentAt: number, seconds: number) =>
  Math.max(0, Math.ceil((sentAt + seconds * 1000 - Date.now()) / 1000));

/**
 * "Resend OTP in 00:30" countdown, then a "Resend OTP" link.
 * Uses the send time rather than counting ticks, so it stays correct after
 * the app was in the background.
 */
const ResendOtp: React.FC<Props> = ({
  sentAt,
  onResend,
  seconds = 30,
  disabled = false,
}) => {
  const [remaining, setRemaining] = useState(() =>
    remainingFrom(sentAt, seconds),
  );

  useEffect(() => {
    const update = () => setRemaining(remainingFrom(sentAt, seconds));
    update();
    const timer = setInterval(update, 1000);
    const appState = AppState.addEventListener('change', state => {
      if (state === 'active') {
        update();
      }
    });
    return () => {
      clearInterval(timer);
      appState.remove();
    };
  }, [sentAt, seconds]);

  if (remaining > 0) {
    const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
    const ss = String(remaining % 60).padStart(2, '0');
    return (
      <Text style={styles.waiting} accessibilityLiveRegion="polite">
        {strings.auth.resendOtpIn(`${mm}:${ss}`)}
      </Text>
    );
  }

  return (
    <Pressable
      onPress={onResend}
      disabled={disabled}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={strings.auth.resendOtp}
    >
      <Text style={[styles.resend, disabled && styles.resendDisabled]}>
        {strings.auth.resendOtp}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  waiting: {
    fontSize: normalizeFont(12),
    lineHeight: normalizeFont(16),
    fontFamily: fonts.medium,
    color: colors.mutedText,
  },
  resend: {
    fontSize: normalizeFont(12),
    lineHeight: normalizeFont(16),
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
  resendDisabled: {
    opacity: 0.5,
  },
});

export default ResendOtp;
