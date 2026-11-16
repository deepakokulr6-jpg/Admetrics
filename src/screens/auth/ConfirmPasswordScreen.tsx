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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AppLogo from '../../components/shared/AppLogo';
import AuthHeader from '../../components/auth/AuthHeader';
import InputField from '../../components/shared/InputField';
import GradientButton from '../../components/shared/GradientButton';
import { useAuth } from '../../contexts/AuthContext';
import { AuthError } from '../../services/authService';
import type { AuthScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';

const ConfirmPasswordScreen: React.FC<AuthScreenProps<'ConfirmPassword'>> = ({
  navigation,
  route,
}) => {
  const { signUp, resetPassword } = useAuth();
  const { email, mode = 'signup', resetToken } = route.params;
  const isPasswordReset = mode === 'reset';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setError(null);

    if (!password || !confirmPassword) {
      setError(strings.confirmPassword.pleaseFillInBothPassword);
      return;
    }

    if (password.length < 8) {
      setError(strings.confirmPassword.useAtLeast8Characters);
      return;
    }

    if (password !== confirmPassword) {
      setError(strings.confirmPassword.bothPasswordsMustMatch);
      return;
    }

    if (isPasswordReset && !resetToken) {
      setError(strings.confirmPassword.yourPasswordResetSessionHas);
      return;
    }

    setIsSubmitting(true);

    try {
      if (isPasswordReset) {
        await resetPassword(email, resetToken as string, password);

        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });

        Alert.alert(
          strings.confirmPassword.passwordUpdated,
          strings.confirmPassword.yourPasswordHasBeenChanged,
        );
        return;
      }

      await signUp(email, password);
      navigation.reset({
        index: 1,
        routes: [{ name: 'Login' }, { name: 'AccountCreated' }],
      });
    } catch (signUpError) {
      setError(
        signUpError instanceof AuthError
          ? signUpError.message
          : isPasswordReset
          ? strings.confirmPassword.unableToResetYourPassword
          : strings.confirmPassword.unableToCreateYourAccount,
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

            <AuthHeader
              title={
                isPasswordReset
                  ? strings.confirmPassword.resetYourPassword
                  : strings.common.createYourAccount
              }
              subtitle={
                isPasswordReset
                  ? strings.confirmPassword.chooseANewPasswordFor
                  : strings.common.enterYourEmailAddressTo
              }
            />

            <View style={styles.form}>
              <InputField
                containerStyle={styles.field}
                label={strings.confirmPassword.createPassword}
                placeholder={strings.auth.enterYourPassword}
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
                      showPassword
                        ? strings.auth.hidePassword
                        : strings.auth.showPassword
                    }
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={scale(18)}
                      color={colors.mutedText}
                    />
                  </Pressable>
                }
              />

              <InputField
                label={strings.confirmPassword.confirmPassword}
                placeholder={strings.confirmPassword.reEnterYourPassword}
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
                        ? strings.confirmPassword.hideConfirmPassword
                        : strings.confirmPassword.showConfirmPassword
                    }
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? 'eye-off-outline' : 'eye-outline'
                      }
                      size={scale(18)}
                      color={colors.mutedText}
                    />
                  </Pressable>
                }
              />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <View style={styles.button}>
                <GradientButton
                  title={strings.confirmPassword.confirm}
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
    backgroundColor: colors.white,
  },

  flex: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: scale(24),
    // Figma: logo top at y144 of 800 (status bar ≈ 24).
    paddingTop: verticalScale(120),
    paddingBottom: verticalScale(32),
  },

  content: {
    width: '100%',
    maxWidth: scale(360),
    alignSelf: 'center',
  },

  logo: {
    alignItems: 'center',
    marginBottom: verticalScale(40),
  },

  field: {
    marginBottom: verticalScale(24),
  },

  form: {
    marginTop: verticalScale(24),
  },

  lastField: {
    marginBottom: 0,
  },

  error: {
    marginTop: verticalScale(12),
    fontSize: normalizeFont(12),
    lineHeight: normalizeFont(16),
    fontFamily: fonts.medium,
    color: colors.red,
    textAlign: 'center',
  },

  button: {
    marginTop: verticalScale(85),
  },
});

export default ConfirmPasswordScreen;
