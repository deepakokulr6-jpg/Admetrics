import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import GradientButton from '../shared/GradientButton';
import CopyButton from '../shared/CopyButton';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';
import strings from '../../constants/strings';

const t = strings.authenticator;
const CODE_LENGTH = 6;

/** "ABCDEFGHIJKLMNOP" → "ABCD EFGH IJKL MNOP" (easier to type by hand). */
const groupKey = (key: string) => key.replace(/(.{4})(?=.)/g, '$1 ');

// ---------------------------------------------------------------- Step 1

type SetupProps = {
  /** otpauth:// link the authenticator app reads from the QR code. */
  otpauthUri: string;
  secret: string;
  onNext: () => void;
};

export const SetupStep: React.FC<SetupProps> = ({
  otpauthUri,
  secret,
  onNext,
}) => (
  <View>
    <Text style={styles.title}>{t.setupTitle}</Text>
    <Text style={styles.body}>{t.setupIntro}</Text>

    <Text style={[styles.stepTitle, styles.gapLarge]}>{t.step1Title}</Text>
    <Text style={styles.body}>{t.step1Body}</Text>

    <Text style={[styles.stepTitle, styles.gapLarge]}>{t.step2Title}</Text>
    {/* QR stays black on white in dark mode so every app can read it. */}
    <View style={styles.qr}>
      <QRCode
        value={otpauthUri}
        size={scale(190)}
        color={colors.shadow}
        backgroundColor={colors.onAccent}
        quietZone={scale(8)}
      />
    </View>

    <Text style={styles.small}>{t.cantScan}</Text>
    <View style={styles.keyRow}>
      <Text style={styles.key} selectable>
        {groupKey(secret)}
      </Text>
      <CopyButton value={secret} />
    </View>

    <GradientButton title={t.verifyCode} onPress={onNext} style={styles.cta} />
  </View>
);

// ---------------------------------------------------------------- Step 2

type VerifyProps = {
  onVerify: (code: string) => void;
  /** Login uses its own wording ("Enter your code" / "Log In"). */
  title?: string;
  intro?: string;
  buttonTitle?: string;
  /** Shown under the field (e.g. wrong code from the server). */
  error?: string | null;
  loading?: boolean;
};

export const VerifyStep: React.FC<VerifyProps> = ({
  onVerify,
  title = t.verifyTitle,
  intro = t.verifyIntro,
  buttonTitle = t.verifyEnable,
  error,
  loading = false,
}) => {
  const [code, setCode] = useState('');

  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{intro}</Text>

      <Text style={[styles.label, styles.gapLarge]}>{t.codeLabel}</Text>
      <TextInput
        value={code}
        onChangeText={value =>
          setCode(value.replace(/\D/g, '').slice(0, CODE_LENGTH))
        }
        placeholder={t.codePlaceholder}
        placeholderTextColor={colors.placeholder}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={CODE_LENGTH}
        autoFocus
        style={styles.input}
        accessibilityLabel={t.codeLabel}
      />
      {error ? (
        <Text style={[styles.small, styles.hint, styles.error]}>{error}</Text>
      ) : (
        <Text style={[styles.small, styles.hint]}>{t.codeHint}</Text>
      )}

      <GradientButton
        title={buttonTitle}
        disabled={code.length !== CODE_LENGTH}
        loading={loading}
        onPress={() => onVerify(code)}
        style={styles.ctaFar}
      />
    </View>
  );
};

// ---------------------------------------------------------------- Step 3

export type RecoveryCode = { code: string; used: boolean };

type RecoveryProps = {
  codes: RecoveryCode[];
  onNewCodes: () => void;
  onDone: () => void;
};

export const RecoveryStep: React.FC<RecoveryProps> = ({
  codes,
  onNewCodes,
  onDone,
}) => (
  <View>
    <Text style={styles.title}>{t.recoveryTitle}</Text>
    <Text style={styles.body}>{t.recoveryIntro}</Text>
    <Text style={[styles.body, styles.gapSmall]}>{t.recoveryOnce}</Text>

    <View style={styles.codes}>
      {codes.map(({ code, used }) => (
        <View
          key={code}
          style={styles.codeRow}
          accessible
          accessibilityLabel={used ? t.usedCode(code) : code}
        >
          <Text style={[styles.key, used && styles.used]} selectable={!used}>
            {code}
          </Text>
          <CopyButton value={code} disabled={used} />
        </View>
      ))}
    </View>

    <Pressable onPress={onNewCodes} accessibilityRole="button" hitSlop={8}>
      <Text style={styles.link}>{t.getNewCodes}</Text>
    </Pressable>

    <GradientButton title={t.okay} onPress={onDone} style={styles.cta} />
  </View>
);

const styles = themedStyles(() =>
  StyleSheet.create({
    title: {
      fontSize: normalizeFont(18),
      lineHeight: normalizeFont(24),
      fontFamily: fonts.bold,
      color: colors.textStrong,
      marginBottom: verticalScale(8),
    },
    body: {
      fontSize: normalizeFont(12),
      lineHeight: normalizeFont(18),
      fontFamily: fonts.regular,
      color: colors.bodyText,
    },
    stepTitle: {
      fontSize: normalizeFont(12),
      fontFamily: fonts.semibold,
      color: colors.textStrong,
      marginBottom: verticalScale(6),
    },
    label: {
      fontSize: normalizeFont(12),
      fontFamily: fonts.regular,
      color: colors.text,
      marginBottom: verticalScale(8),
    },
    gapLarge: {
      marginTop: verticalScale(18),
    },
    gapSmall: {
      marginTop: verticalScale(8),
    },
    error: {
      color: colors.red,
    },
    qr: {
      alignSelf: 'center',
      marginTop: verticalScale(8),
      marginBottom: verticalScale(16),
    },
    small: {
      fontSize: normalizeFont(10),
      fontFamily: fonts.regular,
      color: colors.bodyText,
    },
    hint: {
      marginTop: verticalScale(10),
    },
    keyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: verticalScale(14),
    },
    key: {
      fontSize: normalizeFont(18),
      fontFamily: fonts.bold,
      color: colors.textStrong,
      letterSpacing: 0.5,
    },
    used: {
      color: colors.borderLight,
    },
    codes: {
      marginTop: verticalScale(14),
      marginBottom: verticalScale(14),
      gap: verticalScale(14),
    },
    codeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    link: {
      fontSize: normalizeFont(12),
      fontFamily: fonts.semibold,
      color: colors.buttonPrimary,
    },
    input: {
      height: verticalScale(40),
      paddingHorizontal: scale(16),
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: scale(6),
      fontSize: normalizeFont(14),
      fontFamily: fonts.semibold,
      color: colors.textStrong,
      letterSpacing: 1,
    },
    cta: {
      marginTop: verticalScale(36),
    },
    ctaFar: {
      marginTop: verticalScale(80),
    },
  }),
);
