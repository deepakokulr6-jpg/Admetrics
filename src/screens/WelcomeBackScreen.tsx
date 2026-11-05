import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import AppLogo from '../components/AppLogo';
import { useAuth } from '../contexts/AuthContext';
import { AuthError } from '../services/authService';
import type { AuthScreenProps } from '../navigation/types';

export default function WelcomeBackScreen({
  navigation,
}: AuthScreenProps<'Login'>) {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const handleSignIn = async () => {
    const trimmedEmail = email.trim();
    setError(null);

    if (!trimmedEmail || !password) {
      setError('Please enter your email and password.');
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.innerContainer}
      >
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <AppLogo width={160} />
        </View>

        {/* Header Text */}
        <Text style={styles.title}>Welcome Back!</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Sign in to continue to <Text style={styles.brandText}>Admetrics</Text>
        </Text>

        {/* Email Input Group */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email ID</Text>
          <View
            style={[
              styles.inputContainer,
              emailFocused ? styles.inputContainerFocused : null,
            ]}
          >
            <Feather
              name="user"
              size={20}
              color="#221E25"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, email.length > 0 && styles.inputFilled]}
              placeholder="Enter your email"
              placeholderTextColor="#a1a1aa"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </View>
        </View>

        {/* Password Input Group */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View
            style={[
              styles.inputContainer,
              passwordFocused ? styles.inputContainerFocused : null,
            ]}
          >
            <Feather
              name="lock"
              size={20}
              color="#221E25"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, password.length > 0 && styles.inputFilled]}
              placeholder="Enter your Password"
              placeholderTextColor="#a1a1aa"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={value => {
                setPassword(value);
                setError(null);
              }}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(previous => !previous)}
              hitSlop={10}
            >
              <Feather
                name={showPassword ? 'eye-off' : 'eye'}
                size={18}
                color="#71717a"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={() => {
              Alert.alert(
                'Forgot Password',
                'Password recovery flow triggered.',
              );
            }}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Gradient Sign In Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.buttonWrapper}
          onPress={handleSignIn}
          disabled={isSubmitting}
        >
          <LinearGradient
            colors={['#0265FB', '#B43AFC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.signInButton}
            pointerEvents="none"
          >
            {isSubmitting ? (
              <Text style={styles.signInButtonText}>Signing in...</Text>
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* New User Link - Navigates to CreateAccount screen */}
        <TouchableOpacity
          style={styles.newUserContainer}
          activeOpacity={0.7}
          onPress={() => navigation?.navigate('CreateAccount')}
        >
          <Text style={styles.newUserText}>New User?</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#221E25',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#221E25',
    textAlign: 'center',
    marginBottom: 32,
    alignSelf: 'center',
  },
  brandText: {
    color: '#B43AFC',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 18,
    width: '100%',
    alignSelf: 'center',
  },
  label: {
    fontSize: 12,
    color: '#221E25',
    marginBottom: 6,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#AAAAAA',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    height: 40,
    width: '100%',
  },

  inputContainerFocused: {
    borderColor: '#221E25',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: '#221E25',
    paddingLeft: 4,
    height: '100%',
  },

  inputFilled: {
    fontWeight: '600',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: '#B43AFC',
    fontSize: 12,
    fontWeight: '500',
  },
  errorText: {
    marginTop: 8,
    fontSize: 12,
    color: '#D93025',
    textAlign: 'center',
  },
  buttonWrapper: {
    marginTop: 24,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#0265FB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    alignSelf: 'center',
    width: '100%',
  },
  signInButton: {
    height: 48,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  newUserContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  newUserText: {
    color: '#B43AFC',
    fontSize: 14,
    fontWeight: '700',
  },
});
