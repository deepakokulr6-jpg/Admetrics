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

type CreateAccountScreenProps = {
  onBackToLogin?: () => void;
  onGetOtp?: (email: string) => void;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CreateAccountScreen: React.FC<CreateAccountScreenProps> = ({
  onBackToLogin,
  onGetOtp,
}) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);

  const isEmailValid = EMAIL_PATTERN.test(email.trim());

  const handleGetOtp = () => {
    if (!isEmailValid) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

    // Connect your send-OTP API here.
    setSendingOtp(true);

    if (onGetOtp) {
      setSendingOtp(false);
      onGetOtp(email.trim());
      return;
    }

    Alert.alert('Get OTP', 'Connect your send-OTP API here.');
    setSendingOtp(false);
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
                  sendingOtp ? (
                    <InputStatusIcon status="loading" />
                  ) : isEmailValid ? (
                    <InputStatusIcon status="success" />
                  ) : undefined
                }
              />

              <Text style={styles.otpLabel}>OTP</Text>

              <OtpInput value={otp} onChangeText={setOtp} />

              <View style={styles.button}>
                <GradientButton
                  title="Get OTP"
                  onPress={handleGetOtp}
                  disabled={sendingOtp}
                />
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
    color: '#AAAAAA',
    marginBottom: 8,
  },

  button: {
    marginTop: 44,
  },

  footer: {
    marginTop: 24,
  },
});

export default CreateAccountScreen;
