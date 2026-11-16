import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import AppLogo from '../../components/shared/AppLogo';
import AuthHeader from '../../components/auth/AuthHeader';
import InputField from '../../components/shared/InputField';
import OtpInput from '../../components/auth/OtpInput';
import ResendOtp from '../../components/auth/ResendOtp';
import GradientButton from '../../components/shared/GradientButton';
import AuthFooter from '../../components/auth/AuthFooter';
import InputStatusIcon from '../../components/auth/InputStatusIcon';
import { useAuth } from '../../contexts/AuthContext';
import { AuthError, DEVELOPMENT_OTP } from '../../services/authService';
import { isValidEmail } from '../../utils/validation';
import type {
  AuthScreenProps,
  AuthStackParamList,
} from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';

type OtpMode = 'signup' | 'reset';
type OtpRouteName = 'VerifyOtp' | 'ForgotPassword';

type OtpVerificationProps<RouteName extends OtpRouteName> = {
  navigation: NativeStackNavigationProp<AuthStackParamList, RouteName>;
  mode: OtpMode;
  initialEmail?: string;
};

/**
 * Shared OTP verification screen.
 *
 * The sign-up flow reaches it after the create-account step, while the
 * forgot-password flow uses the same screen to verify the reset OTP before a
 * short-lived reset token is handed to the confirm-password screen.
 */
function OtpVerification<RouteName extends OtpRouteName>({
  navigation,
  mode,
  initialEmail,
}: OtpVerificationProps<RouteName>) {
  const { requestPasswordReset, verifyPasswordResetOtp } = useAuth();
  const isReset = mode === 'reset';

  const [email, setEmail] = useState(initialEmail ?? '');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(!isReset);
  // Sign-up arrives with the OTP already sent, so its timer starts now.
  const [otpSentAt, setOtpSentAt] = useState(() => Date.now());
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEmailValid = isValidEmail(email);

  const handleSendOtp = async () => {
    const trimmedEmail = email.trim();
    setError(null);

    if (!isEmailValid) {
      setError(strings.auth.pleaseEnterAValidEmail);
      return;
    }

    setIsSubmitting(true);

    try {
      await requestPasswordReset(trimmedEmail);
      setOtpSent(true);
      setOtpSentAt(Date.now());
      setOtp('');
      Alert.alert(
        strings.verifyOtp.otpSent,
        strings.auth.devOtpNotEmailed(DEVELOPMENT_OTP),
      );
    } catch (sendError) {
      setError(
        sendError instanceof AuthError
          ? sendError.message
          : strings.verifyOtp.unableToSendTheOtp,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    const trimmedEmail = email.trim();
    setError(null);

    if (!isEmailValid) {
      setError(strings.auth.pleaseEnterAValidEmail);
      return;
    }

    if (otp.length !== 6) {
      setError(strings.auth.pleaseEnterAllSixOtp);
      return;
    }

    if (!isReset && otp !== DEVELOPMENT_OTP) {
      setError(strings.auth.devIncorrectOtp(DEVELOPMENT_OTP));
      return;
    }

    setIsSubmitting(true);

    try {
      if (isReset) {
        const resetToken = await verifyPasswordResetOtp(trimmedEmail, otp);

        navigation.navigate('ConfirmPassword', {
          email: trimmedEmail,
          mode: 'reset',
          resetToken,
        });
        return;
      }

      navigation.navigate('ConfirmPassword', {
        email: trimmedEmail,
        mode: 'signup',
      });
    } catch (verifyError) {
      setError(
        verifyError instanceof AuthError
          ? verifyError.message
          : strings.verifyOtp.unableToVerifyTheOtp,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError(null);

    if (isReset) {
      setOtpSent(false);
      setOtp('');
    }
  };

  const handleResendOtp = () => {
    if (isReset) {
      handleSendOtp();
      return;
    }
    // Sign-up (development): nothing is emailed – restart the timer and
    // remind the tester of the code.
    setOtp('');
    setError(null);
    setOtpSentAt(Date.now());
    Alert.alert(
      strings.verifyOtp.otpSent,
      strings.auth.devOtpNotEmailed(DEVELOPMENT_OTP),
    );
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
              title={
                isReset
                  ? strings.verifyOtp.forgotPassword
                  : strings.common.createYourAccount
              }
              subtitle={
                isReset
                  ? strings.verifyOtp.enterYourRegisteredEmailTo
                  : strings.common.enterYourEmailAddressTo
              }
            />

            <View style={styles.form}>
              <InputField
                containerStyle={styles.field}
                label={strings.common.emailId}
                placeholder={strings.common.enterYourEmail}
                value={email}
                onChangeText={handleEmailChange}
                iconName="email"
                keyboardType="email-address"
                textContentType="emailAddress"
                rightElement={
                  isEmailValid ? (
                    <InputStatusIcon status={'success'} />
                  ) : undefined
                }
              />

              {otpSent ? (
                <View style={styles.otpHeader}>
                  <Text style={styles.otpLabel}>{strings.auth.otp}</Text>
                  <ResendOtp
                    sentAt={otpSentAt}
                    onResend={handleResendOtp}
                    disabled={isSubmitting}
                  />
                </View>
              ) : (
                <Text style={styles.otpLabel}>{strings.auth.otp}</Text>
              )}

              <OtpInput
                key={otpSentAt}
                value={otp}
                onChangeText={value => {
                  setOtp(value);
                  setError(null);
                }}
                autoFocus={otpSent}
              />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <View style={styles.button}>
                <GradientButton
                  title={
                    isReset && !otpSent
                      ? strings.auth.getOtp
                      : strings.common.verify
                  }
                  onPress={isReset && !otpSent ? handleSendOtp : handleVerify}
                  loading={isSubmitting}
                />
              </View>

              <View style={styles.footer}>
                <AuthFooter
                  text={
                    isReset
                      ? strings.verifyOtp.rememberYourPassword
                      : strings.auth.alreadyHaveAnAccount
                  }
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
}

export const VerifyOtpScreen: React.FC<AuthScreenProps<'VerifyOtp'>> = ({
  navigation,
  route,
}) => (
  <OtpVerification
    navigation={navigation}
    mode="signup"
    initialEmail={route.params.email}
  />
);

export const ForgotPasswordScreen: React.FC<
  AuthScreenProps<'ForgotPassword'>
> = ({ navigation }) => (
  <OtpVerification navigation={navigation} mode="reset" />
);

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
    marginBottom: verticalScale(8),
  },

  error: {
    marginTop: verticalScale(12),
    fontSize: normalizeFont(12),
    lineHeight: normalizeFont(16),
    fontFamily: fonts.medium,
    color: colors.red,
    textAlign: 'center',
  },

  button: {
    marginTop: verticalScale(85),
  },

  footer: {
    marginTop: verticalScale(24),
  },
});

export default VerifyOtpScreen;
