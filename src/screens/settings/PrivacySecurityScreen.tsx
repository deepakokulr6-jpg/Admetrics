import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import ScreenHeader from '../../components/shared/ScreenHeader';
import BottomSheet from '../../components/shared/BottomSheet';
import {
  RecoveryStep,
  SetupStep,
  VerifyStep,
  type RecoveryCode,
} from '../../components/settings/AuthenticatorSteps';
import { useAuth } from '../../hooks/useAuth';
import { useBiometry } from '../../hooks/useBiometry';
import BiometryIcon from '../../components/shared/BiometryIcon';
import { openBiometricSetup } from '../../services/biometricService';
import type { AppScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';
import strings from '../../constants/strings';
import {
  SAMPLE_RECOVERY_CODES,
  SAMPLE_TOTP_SECRET,
} from '../../constants/mockData';

const t = strings.privacySecurity;

type Step = 'setup' | 'verify' | 'recovery' | null;

// Outline icons (24px grid, 1.5 stroke) matching the design.
/** Three asterisks (masked password) for Change Password. */
const PasswordIcon = ({ color }: { color: string }) => (
  <Path
    d={[4, 12, 20]
      .map(x => `M${x} 9.2v5.6M${x - 2.4} 10.6l4.8 2.8M${x - 2.4} 13.4l4.8-2.8`)
      .join('')}
    stroke={color}
    strokeWidth={1.4}
    strokeLinecap="round"
    fill="none"
  />
);

const AuthenticatorIcon = ({ color }: { color: string }) => (
  <>
    <Path
      d="M11 21c-4-1.3-7-5-7-9.5V5.5L12 3l8 2.5V10"
      stroke={color}
      strokeWidth={1.5}
      strokeLinejoin="round"
      strokeLinecap="round"
      fill="none"
    />
    <Circle
      cx={17.5}
      cy={15}
      r={2.5}
      stroke={color}
      strokeWidth={1.5}
      fill="none"
    />
    <Path
      d="M15.7 16.8L13 19.5l1.2 1.2M14 18.5l1 1"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      fill="none"
    />
  </>
);

const KeyIcon = ({ color }: { color: string }) => (
  <>
    <Circle
      cx={15.5}
      cy={8.5}
      r={4.5}
      stroke={color}
      strokeWidth={1.5}
      fill="none"
    />
    <Circle cx={16.5} cy={7.5} r={1} fill={color} />
    <Path
      d="M12.3 11.7L4 20l2 2M6.5 17.5l2 2M9 15l1.5 1.5"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </>
);

/** Random demo codes in the XXXX-XXXX format, until the API issues them. */
const newCodes = (): RecoveryCode[] => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const part = () =>
    Array.from(
      { length: 4 },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join('');
  return Array.from({ length: 8 }, () => ({
    code: `${part()}-${part()}`,
    used: false,
  }));
};

type RowProps = {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  right?: React.ReactNode;
};

const Row: React.FC<RowProps> = ({ icon, label, onPress, right }) => (
  <Pressable
    onPress={onPress}
    disabled={!onPress}
    accessibilityRole={onPress ? 'button' : undefined}
    style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
  >
    <View style={styles.icon}>{icon}</View>
    <Text style={styles.label}>{label}</Text>
    {right}
  </Pressable>
);

/**
 * Settings › Privacy & Security: change password, fingerprint toggle and
 * authenticator-app MFA (setup → verify → recovery codes, in one sheet).
 */
const PrivacySecurityScreen: React.FC<AppScreenProps<'PrivacySecurity'>> = ({
  navigation,
}) => {
  const { user } = useAuth();
  // Face ID / Touch ID / Fingerprint, depending on the phone (hidden if none).
  const { biometry, enabled, busy, toggle } = useBiometry();
  const [step, setStep] = useState<Step>(null);
  const [codes, setCodes] = useState<RecoveryCode[]>(SAMPLE_RECOVERY_CODES);

  const iconSize = scale(24);
  const svg = (child: React.ReactNode) => (
    <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24">
      {child}
    </Svg>
  );

  const otpauthUri = `otpauth://totp/Admetrics:${encodeURIComponent(
    user?.email ?? '',
  )}?secret=${SAMPLE_TOTP_SECRET}&issuer=Admetrics`;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScreenHeader title={t.title} onBackPress={() => navigation.goBack()} />

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <Row
          icon={svg(<PasswordIcon color={colors.textStrong} />)}
          label={t.changePassword}
          onPress={() => navigation.navigate('ChangePassword')}
        />

        <Text style={styles.section}>{t.mfaSection}</Text>

        <View style={styles.list}>
          {biometry ? (
            <Row
              icon={<BiometryIcon kind={biometry.kind} size={iconSize} />}
              label={biometry.label}
              right={
                <Switch
                  value={enabled}
                  disabled={busy}
                  onValueChange={toggle}
                  trackColor={{
                    false: colors.switchTrack,
                    true: colors.buttonPrimary,
                  }}
                  thumbColor={colors.onAccent}
                  ios_backgroundColor={colors.switchTrack}
                  accessibilityLabel={biometry.label}
                />
              }
            />
          ) : (
            // Phone supports it but no face / finger is enrolled yet.
            <Row
              icon={
                <BiometryIcon
                  kind={Platform.OS === 'ios' ? 'faceId' : 'fingerprint'}
                  size={iconSize}
                />
              }
              label={
                Platform.OS === 'ios'
                  ? strings.biometrics.notSetUpIos
                  : strings.biometrics.notSetUpAndroid
              }
              right={
                <Pressable
                  onPress={openBiometricSetup}
                  accessibilityRole="button"
                  accessibilityHint={strings.biometrics.setUpHint}
                  hitSlop={8}
                  style={styles.setUp}
                >
                  <Text style={styles.setUpText}>
                    {strings.biometrics.setUp}
                  </Text>
                </Pressable>
              }
            />
          )}
          <Row
            icon={svg(<AuthenticatorIcon color={colors.textStrong} />)}
            label={t.authenticatorApp}
            onPress={() => setStep('setup')}
          />
          <Row
            icon={svg(<KeyIcon color={colors.textStrong} />)}
            label={t.recoveryCodes}
            onPress={() => setStep('recovery')}
          />
        </View>
      </ScrollView>

      <BottomSheet visible={step !== null} onClose={() => setStep(null)}>
        {step === 'setup' ? (
          <SetupStep
            otpauthUri={otpauthUri}
            secret={SAMPLE_TOTP_SECRET}
            onNext={() => setStep('verify')}
          />
        ) : step === 'verify' ? (
          // TODO: check the code with the MFA API before enabling.
          <VerifyStep onVerify={() => setStep('recovery')} />
        ) : step === 'recovery' ? (
          <RecoveryStep
            codes={codes}
            onNewCodes={() => setCodes(newCodes())}
            onDone={() => setStep(null)}
          />
        ) : null}
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    flex: {
      flex: 1,
    },
    list: {
      gap: verticalScale(2),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      height: verticalScale(56),
      paddingHorizontal: scale(24),
      backgroundColor: colors.white,
    },
    rowPressed: {
      backgroundColor: colors.background,
    },
    icon: {
      width: scale(24),
      alignItems: 'center',
    },
    label: {
      flex: 1,
      marginLeft: scale(16),
      fontSize: normalizeFont(14),
      fontFamily: fonts.medium,
      color: colors.textStrong,
    },
    setUp: {
      paddingHorizontal: scale(12),
      paddingVertical: verticalScale(5),
      borderRadius: scale(14),
      borderWidth: 1,
      borderColor: colors.buttonPrimary,
    },
    setUpText: {
      fontSize: normalizeFont(12),
      fontFamily: fonts.semibold,
      color: colors.buttonPrimary,
    },
    // Beige band with the "Multi-Factor Authentication (MFA)" caption.
    section: {
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(24),
      paddingBottom: verticalScale(10),
      fontSize: normalizeFont(12),
      fontFamily: fonts.regular,
      color: colors.bodyText,
    },
  }),
);

export default PrivacySecurityScreen;
