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
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import AppLogo from '../components/AppLogo';
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
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
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
      // A successful sign-in updates AuthContext, which swaps the root
      // navigator to the authenticated stack. No manual navigation is needed.
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
    navigation.navigate('ForgotPassword');
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
              onChangeText={value => {
                setEmail(value);
                setError(null);
              }}
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
              secureTextEntry={true}
              value={password}
              onChangeText={value => {
                setPassword(value);
                setError(null);
              }}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
          </View>
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={handleForgotPassword}
            accessibilityRole="button"
            accessibilityLabel="Forgot Password?"
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Gradient Sign In Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.buttonWrapper}
          onPress={handleSignIn}
          disabled={isSubmitting}
          accessibilityRole="button"
          accessibilityState={{ busy: isSubmitting, disabled: isSubmitting }}
        >
          <LinearGradient
            colors={['#0265FB', '#B43AFC']}
            start={{ x: 0.0, y: 0.2 }}
            end={{ x: 1.0, y: 0.8 }}
            style={styles.signInButton}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* New User Footer Link */}
        <View style={styles.newUserContainer}>
          <Text style={styles.newUserText}>New User? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('CreateAccount')}
            accessibilityRole="button"
            accessibilityLabel="Sign Up"
          >
            <Text style={styles.signUpLinkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default WelcomeBackScreen;

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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#18181b',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#71717a',
    textAlign: 'center',
    marginBottom: 32,
  },
  brandText: {
    color: '#B43AFC',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    color: '#3f3f46',
    marginBottom: 6,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d4d4d8',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    height: 52,
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
    fontSize: 13,
    fontWeight: '500',
  },
  error: {
    marginTop: 14,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: '#D93025',
    textAlign: 'center',
  },
  buttonWrapper: {
    marginTop: 24,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#0265FB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  signInButton: {
    height: 52,
    borderRadius: 28,
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
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  newUserText: {
    color: '#71717a',
    fontSize: 14,
  },
  signUpLinkText: {
    color: '#B43AFC',
    fontSize: 14,
    fontWeight: '600',
  },
});
