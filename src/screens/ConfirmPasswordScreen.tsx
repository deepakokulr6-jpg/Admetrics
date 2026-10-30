import React, { useState } from 'react';
import {
  View,
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
import GradientButton from '../components/GradientButton';

const ConfirmPasswordScreen = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleConfirm = () => {
    if (!password || !confirmPassword) {
      Alert.alert('Missing details', 'Enter both password fields.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Weak password', 'Use at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Both passwords must match.');
      return;
    }

    // Connect your password reset API here.
    Alert.alert('Confirm', 'Connect your password reset API here.');
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
                label="Create Password"
                placeholder="Enter your Password"
                value={password}
                onChangeText={setPassword}
                iconName="password"
                secureTextEntry
              />

              <InputField
                label="Confirm Password"
                placeholder="Re-enter your Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                iconName="password"
                secureTextEntry
                containerStyle={styles.lastField}
              />

              <View style={styles.button}>
                <GradientButton title="Confirm" onPress={handleConfirm} />
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

  lastField: {
    marginBottom: 0,
  },

  button: {
    marginTop: 44,
  },
});

export default ConfirmPasswordScreen;
