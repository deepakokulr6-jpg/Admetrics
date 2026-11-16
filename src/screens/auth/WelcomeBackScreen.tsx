import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import AppLogo from '../../components/shared/AppLogo';
import AuthFooter from '../../components/auth/AuthFooter';
import ForgotPasswordLink from '../../components/auth/ForgotPasswordLink';
import GradientButton from '../../components/shared/GradientButton';
import GradientText from '../../components/shared/GradientText';
import InputField from '../../components/shared/InputField';
import { useAuth } from '../../contexts/AuthContext';
import { AuthError } from '../../services/authService';
import type { AuthScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';

export default function WelcomeBackScreen({
  navigation,
}: AuthScreenProps<'Login'>) {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <SafeAreaView style={styles.safeArea}>
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

            <Text style={styles.title}>Welcome Back!</Text>
            <View style={styles.subtitleRow}>
              <Text style={styles.subtitle}>Sign in to continue to </Text>
              <GradientText style={styles.brand}>Admetrics</GradientText>
            </View>

            <View style={styles.form}>
              <InputField
                containerStyle={styles.field}
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
                containerStyle={styles.passwordField}
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
                rightElement={
                  <Pressable
                    onPress={() => setShowPassword(previous => !previous)}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    <Feather
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={scale(18)}
                      color="#AAAAAA"
                    />
                  </Pressable>
                }
              />

              <ForgotPasswordLink
                onPress={() => navigation.navigate('ForgotPassword')}
              />

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
                  accent
                  onPress={() => navigation.navigate('CreateAccount')}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Layout follows Figma "Android Large - 2": logo at y144, title 20px bold,
// fields 312px wide (24px gutters), Sign In at y634, "New User?" 24 below.
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
    paddingTop: verticalScale(120),
    paddingBottom: verticalScale(32),
  },
  content: {
    width: '100%',
    maxWidth: scale(360),
  },
  logo: {
    alignItems: 'center',
    marginBottom: verticalScale(40),
  },
  title: {
    fontSize: normalizeFont(20),
    lineHeight: normalizeFont(24),
    fontWeight: '700',
    color: '#221E25',
    textAlign: 'center',
  },
  subtitleRow: {
    marginTop: verticalScale(8),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: normalizeFont(14),
    color: '#221E25',
  },
  brand: {
    fontSize: normalizeFont(14),
    fontWeight: '600',
  },
  form: {
    marginTop: verticalScale(24),
  },
  field: {
    marginBottom: verticalScale(24),
  },
  passwordField: {
    marginBottom: verticalScale(8),
  },
  error: {
    marginTop: verticalScale(12),
    fontSize: normalizeFont(12),
    color: '#FF2A2A',
    textAlign: 'center',
  },
  button: {
    marginTop: verticalScale(62),
  },
  footer: {
    marginTop: verticalScale(24),
  },
});
