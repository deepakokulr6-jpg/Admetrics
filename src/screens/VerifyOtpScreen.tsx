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

import AppLogo from '../components/AppLogo';
import AuthHeader from '../components/AuthHeader';
import InputField from '../components/InputField';
import OtpInput from '../components/OtpInput';
import GradientButton from '../components/GradientButton';
import AuthFooter from '../components/AuthFooter';
import InputStatusIcon from '../components/InputStatusIcon';
import { isValidEmail } from '../utils/validation';
import type { AuthScreenProps } from '../navigation/types';

const TEST_OTP = '123456';

/**
 * Dedicated OTP verification screen. The main registration entry point handles
 * email + OTP on one screen, but this route remains available for flows that
 * separate the two steps.
 */
const VerifyOtpScreen: React.FC<AuthScreenProps<'VerifyOtp'>> = ({
  navigation,
  route,
}) => {
  const [email, setEmail] = useState(route.params.email);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isEmailValid = isValidEmail(email);

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

    navigation.navigate('ConfirmPassword', { email: email.trim() });
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
                }}
                iconName="email"
                keyboardType="email-address"
                textContentType="emailAddress"
                rightElement={
                  isEmailValid ? (
                    <InputStatusIcon status="success" />
                  ) : undefined
                }
              />

              <Text style={styles.otpLabel}>OTP</Text>

              <OtpInput value={otp} onChangeText={setOtp} />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <View style={styles.button}>
                <GradientButton title="Verify" onPress={handleVerify} />
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

  otpLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: '#221E25',
    marginBottom: 8,
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

export default VerifyOtpScreen;
