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
import Ionicons from 'react-native-vector-icons/Ionicons';

import AppLogo from '../components/AppLogo';
import AuthHeader from '../components/AuthHeader';
import InputField from '../components/InputField';
import GradientButton from '../components/GradientButton';
import AuthFooter from '../components/AuthFooter';
import ForgotPasswordLink from '../components/ForgotPasswordLink';
import { useAuth } from '../contexts/AuthContext';
import { AuthError } from '../services/authService';
import { isValidEmail } from '../utils/validation';
import type { AuthScreenProps } from '../navigation/types';

const WelcomeBackScreen: React.FC<AuthScreenProps<'Login'>> = ({
  navigation,
}) => {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async () => {
    const trimmedEmail = email.trim();
    setError(null);

    if (!trimmedEmail || !password) {
      setError('Please enter your email and password.');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      await signIn(trimmedEmail, password);
    } catch (signInError) {
      setError(
        signInError instanceof AuthError
          ? signInError.message
          : 'Unable to sign in right now. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Password reset is not connected in this development build. Please sign in with the email and password you registered on this device.',
    );
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
                onChangeText={value => {
                  setEmail(value);
                  setError(null);
                }}
                iconName="email"
                keyboardType="email-address"
                textContentType="emailAddress"
              />

              <InputField
                label="Password"
                placeholder="Enter your Password"
                value={password}
                onChangeText={value => {
                  setPassword(value);
                  setError(null);
                }}
                iconName="password"
                secureTextEntry={!showPassword}
                textContentType="password"
                containerStyle={styles.lastField}
                rightElement={
                  <Pressable
                    onPress={() => setShowPassword(previous => !previous)}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color="#777777"
                    />
                  </Pressable>
                }
              />

              <View style={styles.forgot}>
                <ForgotPasswordLink onPress={handleForgotPassword} />
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <View style={styles.button}>
                <GradientButton
                  title="Sign In"
                  onPress={handleSignIn}
                  loading={isSubmitting}
                />
              </View>

              <View style={styles.footer}>
                <AuthFooter
                  text="New User?"
                  highlight="Sign Up"
                  onPress={() => navigation.navigate('CreateAccount')}
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

  error: {
    marginTop: 14,
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

export default WelcomeBackScreen;
