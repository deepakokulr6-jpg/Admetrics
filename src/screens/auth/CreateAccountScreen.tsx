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

import AppLogo from '../../components/shared/AppLogo';
import AuthHeader from '../../components/auth/AuthHeader';
import InputField from '../../components/shared/InputField';
import OtpInput from '../../components/auth/OtpInput';
import GradientButton from '../../components/shared/GradientButton';
import AuthFooter from '../../components/auth/AuthFooter';
import InputStatusIcon from '../../components/auth/InputStatusIcon';
import { useAuth } from '../../contexts/AuthContext';
import { isValidEmail } from '../../utils/validation';
import type { AuthScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';

const TEST_OTP = '123456';

const CreateAccountScreen: React.FC<AuthScreenProps<'CreateAccount'>> = ({
  navigation,
}) => {
  const { isEmailRegistered } = useAuth();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEmailValid = isValidEmail(email);

  const showDevelopmentOtp = () => {
    Alert.alert(
      'OTP Sent',
      `This is a development build, so no email was sent. Use ${TEST_OTP} to verify your email.`,
    );
  };

  const handleGetOtp = async () => {
    const trimmedEmail = email.trim();
    setError(null);

    if (!isValidEmail(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsChecking(true);

    try {
      const alreadyRegistered = await isEmailRegistered(trimmedEmail);

      if (alreadyRegistered) {
        setError(
          'An account with this email already exists. Please log in instead.',
        );
        return;
      }

      setOtpSent(true);
      setOtp('');
      showDevelopmentOtp();
      navigation.navigate('VerifyOtp', { email: trimmedEmail });
    } catch {
      setError(
        'Unable to check this email right now. Please try again in a moment.',
      );
    } finally {
      setIsChecking(false);
    }
  };

  const handleVerify = () => {
    setError(null);

    if (!isEmailValid) {
      setError('Please enter a valid email address.');
      return;
    }

    if (otp.length !== 6) {
      setError('Please enter all six OTP digits.');
      return;
    }

    if (otp !== TEST_OTP) {
      setError(`Incorrect OTP. Use ${TEST_OTP} in this development build.`);
      return;
    }

    navigation.navigate('ConfirmPassword', {
      email: email.trim(),
      mode: 'signup',
    });
  };

  const handleResendOtp = () => {
    setOtp('');
    setError(null);
    showDevelopmentOtp();
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
              title="Create Your Account"
              subtitle="Enter your email address to get started"
            />

            <View style={styles.form}>
              <InputField
                containerStyle={styles.field}
                label="Email ID"
                placeholder="Enter your email"
                value={email}
                onChangeText={value => {
                  setEmail(value);
                  setError(null);
                  setOtpSent(false);
                  setOtp('');
                }}
                iconName="email"
                keyboardType="email-address"
                textContentType="emailAddress"
                rightElement={
                  isChecking ? (
                    <InputStatusIcon status="loading" />
                  ) : isEmailValid ? (
                    <InputStatusIcon status="success" />
                  ) : undefined
                }
              />

              <View style={styles.otpHeader}>
                <Text style={[styles.otpLabel, !otpSent && styles.otpLabelDisabled]}>
                  OTP
                </Text>

                {otpSent ? (
                  <Pressable
                    onPress={handleResendOtp}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel="Resend OTP"
                  >
                    <Text style={styles.resend}>Resend OTP</Text>
                  </Pressable>
                ) : null}
              </View>

              <OtpInput
                value={otp}
                onChangeText={setOtp}
                disabled={!otpSent}
              />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <View style={styles.button}>
                <GradientButton
                  title={otpSent ? 'Verify' : 'Get OTP'}
                  onPress={otpSent ? handleVerify : handleGetOtp}
                  loading={isChecking}
                />
              </View>

              <View style={styles.footer}>
                <AuthFooter
                  text="Already have an account?"
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
};

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
    color: '#221E25',
  },

  otpLabelDisabled: {
    color: '#DDDDDD',
  },

  resend: {
    fontSize: normalizeFont(12),
    lineHeight: normalizeFont(16),
    fontWeight: '600',
    color: '#0265FB',
  },

  error: {
    marginTop: verticalScale(12),
    fontSize: normalizeFont(12),
    lineHeight: normalizeFont(16),
    fontWeight: '500',
    color: '#FF2A2A',
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
