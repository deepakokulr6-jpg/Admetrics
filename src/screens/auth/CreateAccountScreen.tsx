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
import { useAuth } from '../../hooks/useAuth';
import { apiErrorMessage } from '../../utils/apiErrorMessage';
import { isValidEmail } from '../../utils/validation';
import type { AuthScreenProps } from '../../navigation/types';
import { normalizeFont, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';
import { LIMITS } from '../../constants/fieldLimits';
import { themedStyles } from '../../theme/themedStyles';

const OTP_LENGTH = 6;

const CreateAccountScreen: React.FC<AuthScreenProps<'CreateAccount'>> = ({
  navigation,
}) => {
  const { requestSignupOtp, verifySignupOtp } = useAuth();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpSentAt, setOtpSentAt] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const isEmailValid = isValidEmail(email);

  /**
   * Ask the server to email a code. It answers the same way whether or not
   * the email is invited (no account probing), so the message is neutral.
   */
  const sendOtp = async () => {
    const trimmedEmail = email.trim();
    setError(null);
    setInfo(null);

    if (!isValidEmail(trimmedEmail)) {
      setError(strings.auth.pleaseEnterAValidEmail);
      return;
    }

    setIsChecking(true);
    try {
      await requestSignupOtp(trimmedEmail);
      // Stay on this screen: unlock the OTP boxes and tell the user.
      setOtpSent(true);
      setOtpSentAt(Date.now());
      setOtp('');
      setInfo(strings.auth.otpSentTo(trimmedEmail));
    } catch (requestError) {
      setError(apiErrorMessage(requestError, 'otp'));
    } finally {
      setIsChecking(false);
    }
  };

  const handleGetOtp = () => sendOtp();

  const handleVerify = async () => {
    setError(null);

    if (!isEmailValid) {
      setError(strings.auth.pleaseEnterAValidEmail);
      return;
    }
    if (otp.length !== OTP_LENGTH) {
      setError(strings.auth.pleaseEnterAllSixOtp);
      return;
    }

    setIsChecking(true);
    try {
      const verificationToken = await verifySignupOtp(email.trim(), otp);
      navigation.navigate('ConfirmPassword', {
        email: email.trim(),
        mode: 'signup',
        verificationToken,
      });
    } catch (verifyError) {
      setError(apiErrorMessage(verifyError, 'otp'));
    } finally {
      setIsChecking(false);
    }
  };

  const handleResendOtp = () => sendOtp();

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
        autoComplete="email"
        maxLength={LIMITS.email.max}
        returnKeyType="send"
        submitBehavior="blurAndSubmit"
        onSubmitEditing={() => {
          if (!otpSent) {
            handleGetOtp();
          }
        }}
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

const styles = themedStyles(() =>
  StyleSheet.create({
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
  }),
);

export default CreateAccountScreen;
