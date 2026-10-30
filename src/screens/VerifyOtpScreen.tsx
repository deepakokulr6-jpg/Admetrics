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

import AppLogo from '../components/AppLogo';
import AuthHeader from '../components/AuthHeader';
import InputField from '../components/InputField';
import OtpInput from '../components/OtpInput';
import GradientButton from '../components/GradientButton';
import AuthFooter from '../components/AuthFooter';
import InputStatusIcon from '../components/InputStatusIcon';

type VerifyOtpScreenProps = {
  onBackToLogin?: () => void;
  initialEmail?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VerifyOtpScreen: React.FC<VerifyOtpScreenProps> = ({
  onBackToLogin,
  initialEmail = '',
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');

  const isEmailValid = EMAIL_PATTERN.test(email.trim());

  const handleVerify = () => {
    if (!email.trim() || otp.length !== 6) {
      Alert.alert(
        'Missing details',
        'Enter your email and all six OTP digits.',
      );
      return;
    }

    // Connect your OTP verification API here.
    Alert.alert('Verify OTP', 'Connect your OTP verification API here.');
  };

  const handleLogin = () => {
    if (onBackToLogin) {
      onBackToLogin();
      return;
    }
    Alert.alert('Log In', 'Open the Welcome Back screen here.');
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
                onChangeText={setEmail}
                iconName="email"
                keyboardType="email-address"
                rightElement={
                  isEmailValid ? (
                    <InputStatusIcon status="success" />
                  ) : undefined
                }
              />

              <Text style={styles.otpLabel}>OTP</Text>

              <OtpInput value={otp} onChangeText={setOtp} />

              <View style={styles.button}>
                <GradientButton title="Verify" onPress={handleVerify} />
              </View>

              <View style={styles.footer}>
                <AuthFooter
                  text="Already have an account?"
                  highlight="Log In"
                  onPress={handleLogin}
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

  button: {
    marginTop: 44,
  },

  footer: {
    marginTop: 24,
  },
});

export default VerifyOtpScreen;
