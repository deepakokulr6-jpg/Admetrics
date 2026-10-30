import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AppLogo from '../components/AppLogo';
import AuthHeader from '../components/AuthHeader';
import InputField from '../components/InputField';
import GradientButton from '../components/GradientButton';
import { useAuth } from '../contexts/AuthContext';
import { AuthError } from '../services/authService';
import type { AuthScreenProps } from '../navigation/types';

const ConfirmPasswordScreen: React.FC<AuthScreenProps<'ConfirmPassword'>> = ({
  navigation,
  route,
}) => {
  const { signUp } = useAuth();
  const { email } = route.params;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setError(null);

    if (!password || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }

    if (password.length < 8) {
      setError('Use at least 8 characters for your password.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Both passwords must match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await signUp(email, password);
      navigation.reset({
        index: 1,
        routes: [{ name: 'Login' }, { name: 'AccountCreated' }],
      });
    } catch (signUpError) {
      setError(
        signUpError instanceof AuthError
          ? signUpError.message
          : 'Unable to create your account right now. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
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

            <Text style={styles.emailHint} numberOfLines={1}>
              {email}
            </Text>

            <View style={styles.form}>
              <InputField
                label="Create Password"
                placeholder="Enter your Password"
                value={password}
                onChangeText={value => {
                  setPassword(value);
                  setError(null);
                }}
                iconName="password"
                secureTextEntry={!showPassword}
                textContentType="newPassword"
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

              <InputField
                label="Confirm Password"
                placeholder="Re-enter your Password"
                value={confirmPassword}
                onChangeText={value => {
                  setConfirmPassword(value);
                  setError(null);
                }}
                iconName="password"
                secureTextEntry={!showConfirmPassword}
                textContentType="newPassword"
                containerStyle={styles.lastField}
                rightElement={
                  <Pressable
                    onPress={() =>
                      setShowConfirmPassword(previous => !previous)
                    }
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel={
                      showConfirmPassword
                        ? 'Hide confirm password'
                        : 'Show confirm password'
                    }
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? 'eye-off-outline' : 'eye-outline'
                      }
                      size={18}
                      color="#777777"
                    />
                  </Pressable>
                }
              />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <View style={styles.button}>
                <GradientButton
                  title="Confirm"
                  onPress={handleConfirm}
                  loading={isSubmitting}
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

  emailHint: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#7B35FF',
    textAlign: 'center',
  },

  form: {
    marginTop: 20,
  },

  lastField: {
    marginBottom: 0,
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
});

export default ConfirmPasswordScreen;
