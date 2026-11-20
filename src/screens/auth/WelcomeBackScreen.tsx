import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AuthScreenLayout from '../../components/auth/AuthScreenLayout';
import AuthFooter from '../../components/auth/AuthFooter';
import ForgotPasswordLink from '../../components/auth/ForgotPasswordLink';
import GradientButton from '../../components/shared/GradientButton';
import GradientText from '../../components/shared/GradientText';
import InputField from '../../components/shared/InputField';
import { useAuth } from '../../hooks/useAuth';
import { AuthError } from '../../services/authService';
import type { AuthScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { useFieldChain } from '../../utils/useFieldChain';
import strings from '../../constants/strings';
import { LIMITS } from '../../constants/fieldLimits';
import { themedStyles } from '../../theme/themedStyles';

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
      setError(strings.welcomeBack.pleaseEnterYourEmailAnd);
      return;
    }

    setIsSubmitting(true);

    try {
      await signIn(trimmedEmail, password);
    } catch (signInError) {
      setError(
        signInError instanceof AuthError
          ? signInError.message
          : strings.welcomeBack.unableToSignInRight,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Keyboard: email Next → password Done signs in.
  const chain = useFieldChain(['email', 'password'] as const, () =>
    handleSignIn(),
  );

  return (
    <AuthScreenLayout
      header={
        <>
          <Text style={styles.title}>{strings.welcomeBack.welcomeBack}</Text>
          <View style={styles.subtitleRow}>
            <Text style={styles.subtitle}>
              {strings.welcomeBack.signInToContinueTo}{' '}
            </Text>
            <GradientText style={styles.brand}>
              {strings.welcomeBack.admetrics}
            </GradientText>
          </View>
        </>
      }
    >
      <InputField
        containerStyle={styles.field}
        label={strings.common.emailId}
        placeholder={strings.common.enterYourEmail}
        value={email}
        onChangeText={value => {
          setEmail(value);
          setError(null);
        }}
        iconName="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
        maxLength={LIMITS.email.max}
        {...chain('email')}
      />

      <InputField
        containerStyle={styles.passwordField}
        label={strings.welcomeBack.password}
        placeholder={strings.auth.enterYourPassword}
        value={password}
        onChangeText={value => {
          setPassword(value);
          setError(null);
        }}
        iconName="password"
        secureTextEntry={!showPassword}
        textContentType="password"
        autoComplete="current-password"
        maxLength={LIMITS.password.max}
        {...chain('password')}
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
            <Feather
              name={showPassword ? 'eye-off' : 'eye'}
              size={scale(18)}
              color={colors.border}
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
          title={strings.welcomeBack.signIn}
          onPress={handleSignIn}
          loading={isSubmitting}
        />
      </View>

      <View style={styles.footer}>
        <AuthFooter
          text={strings.welcomeBack.newUser}
          accent
          onPress={() => navigation.navigate('CreateAccount')}
        />
      </View>
    </AuthScreenLayout>
  );
}

// Layout follows Figma "Android Large - 2": logo at y144, title 20px bold,
// fields 312px wide (24px gutters), Sign In at y634, "New User?" 24 below.
const styles = themedStyles(() =>
  StyleSheet.create({
    title: {
      fontSize: normalizeFont(20),
      lineHeight: normalizeFont(24),
      fontFamily: fonts.bold,
      color: colors.text,
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
      color: colors.text,
    },
    brand: {
      fontSize: normalizeFont(14),
      fontFamily: fonts.semibold,
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
      color: colors.red,
      textAlign: 'center',
    },
    button: {
      marginTop: verticalScale(62),
    },
    footer: {
      marginTop: verticalScale(24),
    },
  }),
);
