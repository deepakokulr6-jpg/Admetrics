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
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import AppLogo from '../../components/shared/AppLogo';
import AuthHeader from '../../components/auth/AuthHeader';
import InputField from '../../components/shared/InputField';
import OtpInput from '../../components/auth/OtpInput';
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
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEmailValid = isValidEmail(email);

  const handleSendOtp = async () => {
    const trimmedEmail = email.trim();
    setError(null);

    if (!isEmailValid) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      await requestPasswordReset(trimmedEmail);
      setOtpSent(true);
      setOtp('');
      Alert.alert(
        'OTP Sent',
        `This is a development build, so no email was sent. Use ${DEVELOPMENT_OTP} to reset your password.`,
      );
    } catch (sendError) {
      setError(
        sendError instanceof AuthError
          ? sendError.message
          : 'Unable to send the OTP right now. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    const trimmedEmail = email.trim();
    setError(null);

    if (!isEmailValid) {
      setError('Please enter a valid email address.');
      return;
    }

    if (otp.length !== 6) {
      setError('Please enter all six OTP digits.');
      return;
    }

    if (!isReset && otp !== DEVELOPMENT_OTP) {
      setError(
        `Incorrect OTP. Use ${DEVELOPMENT_OTP} in this development build.`,
      );
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
          : 'Unable to verify the OTP right now. Please try again.',
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
    handleSendOtp();
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
              <AppLogo width={scale(160)} />
            </View>

            <AuthHeader
              title={isReset ? 'Forgot Password' : 'Create Your Account'}
              subtitle={
                isReset
                  ? 'Enter your registered email to reset your password'
                  : 'Enter your email address to get started'
              }
            />

            <View style={styles.form}>
              <InputField
                label="Email ID"
                placeholder="Enter your email"
                value={email}
                onChangeText={handleEmailChange}
                iconName="email"
                keyboardType="email-address"
                textContentType="emailAddress"
                rightElement={
                  isEmailValid ? (
                    <InputStatusIcon status="success" />
                  ) : undefined
                }
              />

              {isReset && otpSent ? (
                <View style={styles.otpHeader}>
                  <Text style={styles.otpLabel}>OTP</Text>

                  <Pressable
                    onPress={handleResendOtp}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel="Resend OTP"
                  >
                    <Text style={styles.resend}>Resend OTP</Text>
                  </Pressable>
                </View>
              ) : (
                <Text style={styles.otpLabel}>OTP</Text>
              )}

              <OtpInput value={otp} onChangeText={setOtp} />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <View style={styles.button}>
                <GradientButton
                  title={isReset && !otpSent ? 'Get OTP' : 'Verify'}
                  onPress={isReset && !otpSent ? handleSendOtp : handleVerify}
                  loading={isSubmitting}
                />
              </View>

              <View style={styles.footer}>
                <AuthFooter
                  text={
                    isReset
                      ? 'Remember your password?'
                      : 'Already have an account?'
                  }
                  highlight="Log In"
                  onPress={() => navigation.navigate('Login')}
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
    backgroundColor: '#FFFFFF',
  },

  flex: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(32),
  },

  content: {
    width: '100%',
    maxWidth: scale(360),
    alignSelf: 'center',
  },

  logo: {
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },

  form: {
    marginTop: verticalScale(28),
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
    color: '#221E25',
    marginBottom: verticalScale(8),
  },

  resend: {
    fontSize: normalizeFont(12),
    lineHeight: normalizeFont(16),
    fontWeight: '600',
    color: '#7B35FF',
    marginBottom: verticalScale(8),
  },

  error: {
    marginTop: verticalScale(12),
    fontSize: normalizeFont(12),
    lineHeight: normalizeFont(16),
    fontWeight: '500',
    color: '#D93025',
    textAlign: 'center',
  },

  button: {
    marginTop: verticalScale(28),
  },

  footer: {
    marginTop: verticalScale(24),
  },
});

export default VerifyOtpScreen;
