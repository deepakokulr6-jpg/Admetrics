import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import AuthScreenLayout from '../../components/auth/AuthScreenLayout';
import AuthHeader from '../../components/auth/AuthHeader';
import InputField from '../../components/shared/InputField';
import OtpInput from '../../components/auth/OtpInput';
import ResendOtp from '../../components/auth/ResendOtp';
import GradientButton from '../../components/shared/GradientButton';
import AuthFooter from '../../components/auth/AuthFooter';
import InputStatusIcon from '../../components/auth/InputStatusIcon';
import { useAuth } from '../../contexts/AuthContext';
import { DEVELOPMENT_OTP } from '../../services/authService';
import { isValidEmail } from '../../utils/validation';
import type { AuthScreenProps } from '../../navigation/types';
import { normalizeFont, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';

// No email service yet: the local auth flow accepts this fixed code.
const TEST_OTP = DEVELOPMENT_OTP;

const CreateAccountScreen: React.FC<AuthScreenProps<'CreateAccount'>> = ({
  navigation,
}) => {
  const { isEmailRegistered } = useAuth();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpSentAt, setOtpSentAt] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const isEmailValid = isValidEmail(email);

  const showOtpSent = (target: string) => {
    setInfo(
      strings.auth.otpSentTo(target) +
        (__DEV__ ? strings.auth.testCode(TEST_OTP) : ''),
    );
  };

  const handleGetOtp = async () => {
    const trimmedEmail = email.trim();
    setError(null);
    setInfo(null);

    if (!isValidEmail(trimmedEmail)) {
      setError(strings.auth.pleaseEnterAValidEmail);
      return;
    }

    setIsChecking(true);

    try {
      const alreadyRegistered = await isEmailRegistered(trimmedEmail);

      if (alreadyRegistered) {
        setError(strings.createAccount.anAccountWithThisEmail);
        return;
      }

      // Stay on this screen: unlock the OTP boxes and tell the user.
      setOtpSent(true);
      setOtpSentAt(Date.now());
      setOtp('');
      showOtpSent(trimmedEmail);
    } catch {
      setError(strings.createAccount.unableToCheckThisEmail);
    } finally {
      setIsChecking(false);
    }
  };

  const handleVerify = () => {
    setError(null);

    if (!isEmailValid) {
      setError(strings.auth.pleaseEnterAValidEmail);
      return;
    }

    if (otp.length !== 6) {
      setError(strings.auth.pleaseEnterAllSixOtp);
      return;
    }

    if (otp !== TEST_OTP) {
      setError(strings.createAccount.incorrectOtpPleaseCheckThe);
      return;
    }

    navigation.navigate('ConfirmPassword', {
      email: email.trim(),
      mode: 'signup',
    });
  };

  const handleResendOtp = () => {
    setOtpSentAt(Date.now());
    setOtp('');
    setError(null);
    showOtpSent(email.trim());
  };

  return (
    <AuthScreenLayout
      header={
        <AuthHeader
          title={strings.common.createYourAccount}
          subtitle={strings.common.enterYourEmailAddressTo}
        />
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
          setInfo(null);
          setOtpSent(false);
          setOtp('');
        }}
        iconName="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        rightElement={
          isChecking ? (
            <InputStatusIcon status={'loading'} />
          ) : isEmailValid ? (
            <InputStatusIcon status={'success'} />
          ) : undefined
        }
      />

      <View style={styles.otpHeader}>
        <Text style={[styles.otpLabel, !otpSent && styles.otpLabelDisabled]}>
          {strings.auth.otp}
        </Text>

        {otpSent ? (
          <ResendOtp sentAt={otpSentAt} onResend={handleResendOtp} />
        ) : null}
      </View>

      <OtpInput
        value={otp}
        onChangeText={value => {
          setOtp(value);
          setError(null);
        }}
        disabled={!otpSent}
        autoFocus={otpSent}
        key={otpSentAt}
      />

      {info && !error ? <Text style={styles.info}>{info}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.button}>
        <GradientButton
          title={otpSent ? strings.common.verify : strings.auth.getOtp}
          onPress={otpSent ? handleVerify : handleGetOtp}
          loading={isChecking}
        />
      </View>

      <View style={styles.footer}>
        <AuthFooter
          text={strings.auth.alreadyHaveAnAccount}
          highlight={strings.auth.logIn}
          onPress={() => navigation.popTo('Login')}
        />
      </View>
    </AuthScreenLayout>
  );
};

const styles = StyleSheet.create({
  field: {
    marginBottom: verticalScale(24),
  },

  otpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },

  otpLabel: {
    fontSize: normalizeFont(12),
    lineHeight: normalizeFont(16),
    color: colors.text,
  },

  otpLabelDisabled: {
    color: colors.borderLight,
  },

  error: {
    marginTop: verticalScale(12),
    fontSize: normalizeFont(12),
    lineHeight: normalizeFont(16),
    fontFamily: fonts.medium,
    color: colors.red,
    textAlign: 'center',
  },

  info: {
    marginTop: verticalScale(12),
    fontSize: normalizeFont(12),
    lineHeight: normalizeFont(16),
    color: colors.green,
    textAlign: 'center',
  },

  button: {
    marginTop: verticalScale(85),
  },

  footer: {
    marginTop: verticalScale(24),
  },
});

export default CreateAccountScreen;
