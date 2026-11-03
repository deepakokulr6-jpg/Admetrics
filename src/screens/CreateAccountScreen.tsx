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

import AppLogo from '../components/AppLogo';
import AuthHeader from '../components/AuthHeader';
import InputField from '../components/InputField';
import OtpInput from '../components/OtpInput';
import GradientButton from '../components/GradientButton';
import AuthFooter from '../components/AuthFooter';
import InputStatusIcon from '../components/InputStatusIcon';
import { useAuth } from '../contexts/AuthContext';
import { isValidEmail } from '../utils/validation';
import type { AuthScreenProps } from '../navigation/types';

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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.logo}>
              <AppLogo />
            </View>

            <AuthHeader
              title="Create Your Account"
              subtitle="Enter your email address to get started"
            />

            <View style={styles.form}>
              <InputField
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
                <Text style={styles.otpLabel}>OTP</Text>

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

              <OtpInput value={otp} onChangeText={setOtp} />

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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  content: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
  },

  logo: {
    alignItems: 'center',
    marginBottom: 24,
  },

  form: {
    marginTop: 28,
  },

  otpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  otpLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: '#221E25',
  },

  resend: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#7B35FF',
  },

  error: {
    marginTop: 12,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: '#D93025',
    textAlign: 'center',
  },

  button: {
    marginTop: 28,
  },

  footer: {
    marginTop: 24,
  },
});

export default CreateAccountScreen;
