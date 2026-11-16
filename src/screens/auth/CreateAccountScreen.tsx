import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppLogo from '../../components/shared/AppLogo';
import AuthHeader from '../../components/auth/AuthHeader';
import InputField from '../../components/shared/InputField';
import OtpInput from '../../components/auth/OtpInput';
import ResendOtp from '../../components/auth/ResendOtp';
import GradientButton from '../../components/shared/GradientButton';
import AuthFooter from '../../components/auth/AuthFooter';
import InputStatusIcon from '../../components/auth/InputStatusIcon';
import { useAuth } from '../../contexts/AuthContext';
import { DEVELOPMENT_OTP } from '../../services/authService';
import { isValidEmail } from '../../utils/validation';
import type { AuthScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';

// No email service yet: the local auth flow accepts this fixed code.
const TEST_OTP = DEVELOPMENT_OTP;

const CreateAccountScreen: React.FC<AuthScreenProps<'CreateAccount'>> = ({
  navigation,
}) => {
  const { isEmailRegistered } = useAuth();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpSentAt, setOtpSentAt] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const isEmailValid = isValidEmail(email);

  const showOtpSent = (target: string) => {
    setInfo(
      strings.auth.otpSentTo(target) +
        (__DEV__ ? strings.auth.testCode(TEST_OTP) : ''),
    );
  };

  const handleGetOtp = async () => {
    const trimmedEmail = email.trim();
    setError(null);
    setInfo(null);

    if (!isValidEmail(trimmedEmail)) {
      setError(strings.auth.pleaseEnterAValidEmail);
      return;
    }

    setIsChecking(true);

    try {
      const alreadyRegistered = await isEmailRegistered(trimmedEmail);

      if (alreadyRegistered) {
        setError(strings.createAccount.anAccountWithThisEmail);
        return;
      }

      // Stay on this screen: unlock the OTP boxes and tell the user.
      setOtpSent(true);
      setOtpSentAt(Date.now());
      setOtp('');
      showOtpSent(trimmedEmail);
    } catch {
      setError(strings.createAccount.unableToCheckThisEmail);
    } finally {
      setIsChecking(false);
    }
  };

  const handleVerify = () => {
    setError(null);

    if (!isEmailValid) {
      setError(strings.auth.pleaseEnterAValidEmail);
      return;
    }

    if (otp.length !== 6) {
      setError(strings.auth.pleaseEnterAllSixOtp);
      return;
    }

    if (otp !== TEST_OTP) {
      setError(strings.createAccount.incorrectOtpPleaseCheckThe);
      return;
    }

    navigation.navigate('ConfirmPassword', {
      email: email.trim(),
      mode: 'signup',
    });
  };

  const handleResendOtp = () => {
    setOtpSentAt(Date.now());
    setOtp('');
    setError(null);
    showOtpSent(email.trim());
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.logo}>
              <AppLogo width={scale(200)} />
            </View>

            <AuthHeader
              title={strings.common.createYourAccount}
              subtitle={strings.common.enterYourEmailAddressTo}
            />

            <View style={styles.form}>
              <InputField
                containerStyle={styles.field}
                label={strings.common.emailId}
                placeholder={strings.common.enterYourEmail}
                value={email}
                onChangeText={value => {
                  setEmail(value);
                  setError(null);
                  setInfo(null);
                  setOtpSent(false);
                  setOtp('');
                }}
                iconName="email"
                keyboardType="email-address"
                textContentType="emailAddress"
                rightElement={
                  isChecking ? (
                    <InputStatusIcon status={'loading'} />
                  ) : isEmailValid ? (
                    <InputStatusIcon status={'success'} />
                  ) : undefined
                }
              />

              <View style={styles.otpHeader}>
                <Text
                  style={[styles.otpLabel, !otpSent && styles.otpLabelDisabled]}
                >
                  {strings.auth.otp}
                </Text>

                {otpSent ? (
                  <ResendOtp sentAt={otpSentAt} onResend={handleResendOtp} />
                ) : null}
              </View>

              <OtpInput
                value={otp}
                onChangeText={value => {
                  setOtp(value);
                  setError(null);
                }}
                disabled={!otpSent}
                autoFocus={otpSent}
                key={otpSentAt}
              />

              {info && !error ? <Text style={styles.info}>{info}</Text> : null}
              {error ? <Text style={styles.error}>{error}</Text> : null}

              <View style={styles.button}>
                <GradientButton
                  title={otpSent ? strings.common.verify : strings.auth.getOtp}
                  onPress={otpSent ? handleVerify : handleGetOtp}
                  loading={isChecking}
                />
              </View>

              <View style={styles.footer}>
                <AuthFooter
                  text={strings.auth.alreadyHaveAnAccount}
                  highlight={strings.auth.logIn}
                  onPress={() => navigation.popTo('Login')}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },

  flex: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: scale(24),
    // Figma: logo top at y144 of 800 (status bar ≈ 24).
    paddingTop: verticalScale(120),
    paddingBottom: verticalScale(32),
  },

  content: {
    width: '100%',
    maxWidth: scale(360),
    alignSelf: 'center',
  },

  logo: {
    alignItems: 'center',
    marginBottom: verticalScale(40),
  },

  field: {
    marginBottom: verticalScale(24),
  },

  form: {
    marginTop: verticalScale(24),
  },

  otpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },

  otpLabel: {
    fontSize: normalizeFont(12),
    lineHeight: normalizeFont(16),
    color: colors.text,
  },

  otpLabelDisabled: {
    color: colors.borderLight,
  },

  error: {
    marginTop: verticalScale(12),
    fontSize: normalizeFont(12),
    lineHeight: normalizeFont(16),
    fontFamily: fonts.medium,
    color: colors.red,
    textAlign: 'center',
  },

  info: {
    marginTop: verticalScale(12),
    fontSize: normalizeFont(12),
    lineHeight: normalizeFont(16),
    color: colors.green,
    textAlign: 'center',
  },

  button: {
    marginTop: verticalScale(85),
  },

  footer: {
    marginTop: verticalScale(24),
  },
});

export default CreateAccountScreen;
