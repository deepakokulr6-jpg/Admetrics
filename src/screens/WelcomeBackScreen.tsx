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
import GradientButton from '../components/GradientButton';
import AuthFooter from '../components/AuthFooter';
import ForgotPasswordLink from '../components/ForgotPasswordLink';

type WelcomeBackScreenProps = {
  onCreateAccount?: () => void;
  onForgotPassword?: () => void;
};

const WelcomeBackScreen: React.FC<WelcomeBackScreenProps> = ({
  onCreateAccount,
  onForgotPassword,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please enter your email and password.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    Alert.alert('Sign In', 'Connect your login API here.');
  };

  const handleForgotPassword = () => {
    if (onForgotPassword) {
      onForgotPassword();
      return;
    }
    Alert.alert('Forgot Password', 'Navigate to your reset screen here.');
  };

  const handleNewUser = () => {
    if (onCreateAccount) {
      onCreateAccount();
      return;
    }
    Alert.alert('Create Account', 'Navigate to registration here.');
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

            <AuthHeader title="Welcome Back!" />

            <View style={styles.subtitle}>
              <Text style={styles.subtitleText}>Sign in to continue to </Text>
              <Text style={styles.brandText}>Admetrics</Text>
            </View>

            <View style={styles.form}>
              <InputField
                label="Email ID"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                iconName="email"
                keyboardType="email-address"
              />

              <InputField
                label="Password"
                placeholder="Enter your Password"
                value={password}
                onChangeText={setPassword}
                iconName="password"
                secureTextEntry
                containerStyle={styles.lastField}
              />

              <View style={styles.forgot}>
                <ForgotPasswordLink onPress={handleForgotPassword} />
              </View>

              <View style={styles.button}>
                <GradientButton title="Sign In" onPress={handleSignIn} />
              </View>

              <View style={styles.footer}>
                <AuthFooter text="New User?" accent onPress={handleNewUser} />
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

  subtitle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 28,
  },

  subtitleText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#221E25',
  },

  brandText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: '#7B35FF',
  },

  form: {
    width: '100%',
  },

  lastField: {
    marginBottom: 0,
  },

  forgot: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },

  button: {
    marginTop: 44,
  },

  footer: {
    marginTop: 24,
  },
});

export default WelcomeBackScreen;
