import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../../components/shared/ScreenHeader';
import GradientButton from '../../components/shared/GradientButton';
import {
  SetupStep,
  VerifyStep,
} from '../../components/settings/AuthenticatorSteps';
import { useAuth } from '../../hooks/useAuth';
import { ApiError } from '../../api/client';
import type { MfaSetup } from '../../api/auth';
import { apiErrorMessage } from '../../utils/apiErrorMessage';
import type { AuthScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';
import strings from '../../constants/strings';

const t = strings.mfaLogin;

type Phase =
  | { name: 'loading' }
  /** First login: QR + key, then the first code (confirm). */
  | { name: 'setup'; setup: MfaSetup }
  | { name: 'confirm'; setup: MfaSetup }
  /** Later logins: the current code (verify). */
  | { name: 'verify' }
  | { name: 'failed'; message: string };

/**
 * After the password: the authenticator step. First login sets up the
 * authenticator (QR / key → first code); every later login asks for the
 * current code. Success saves the session and the app opens.
 */
const MfaScreen: React.FC<AuthScreenProps<'Mfa'>> = ({ navigation, route }) => {
  const { email, challengeToken, setupRequired } = route.params;
  const { startMfaSetup, confirmMfa, verifyMfa, completeSignIn } = useAuth();

  const [phase, setPhase] = useState<Phase>(
    setupRequired === false ? { name: 'verify' } : { name: 'loading' },
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadSetup = useCallback(async () => {
    setPhase({ name: 'loading' });
    try {
      setPhase({ name: 'setup', setup: await startMfaSetup(challengeToken) });
    } catch (setupError) {
      // Login didn't say; setup refused → already enrolled → ask for code.
      const status = setupError instanceof ApiError ? setupError.status : 0;
      if (setupRequired === undefined && status >= 400 && status < 500) {
        setPhase({ name: 'verify' });
        return;
      }
      setPhase({
        name: 'failed',
        message: apiErrorMessage(setupError, 'mfa'),
      });
    }
  }, [challengeToken, setupRequired, startMfaSetup]);

  useEffect(() => {
    if (setupRequired !== false) {
      loadSetup();
    }
  }, [loadSetup, setupRequired]);

  // Back from the code step returns to the QR / key (not to Login), on
  // the header arrow, iOS swipe and Android back alike.
  useEffect(
    () =>
      navigation.addListener('beforeRemove', event => {
        // Signing in (submitting) must never be blocked.
        if (phase.name !== 'confirm' || submitting) {
          return;
        }
        event.preventDefault();
        setError(null);
        setPhase({ name: 'setup', setup: phase.setup });
      }),
    [navigation, phase, submitting],
  );

  const submitCode = async (code: string, firstTime: boolean) => {
    setError(null);
    setSubmitting(true);
    try {
      const tokens = firstTime
        ? await confirmMfa(challengeToken, code)
        : await verifyMfa(challengeToken, code);
      // Signed in: RootNavigator swaps to the app.
      await completeSignIn(email, tokens);
    } catch (codeError) {
      setError(apiErrorMessage(codeError, 'mfa'));
      setSubmitting(false);
    }
  };

  const body = () => {
    switch (phase.name) {
      case 'loading':
        return (
          <View style={styles.center}>
            <ActivityIndicator color={colors.buttonPrimary} />
            <Text style={styles.muted}>{t.loading}</Text>
          </View>
        );
      case 'setup':
        return (
          <SetupStep
            otpauthUri={phase.setup.otpauthUri}
            secret={phase.setup.secret}
            onNext={() => setPhase({ name: 'confirm', setup: phase.setup })}
          />
        );
      case 'confirm':
        return (
          <VerifyStep
            intro={t.confirmIntro}
            buttonTitle={t.finishSetup}
            error={error}
            loading={submitting}
            onVerify={code => submitCode(code, true)}
          />
        );
      case 'verify':
        return (
          <VerifyStep
            title={t.enterTitle}
            intro={t.enterIntro}
            buttonTitle={t.logIn}
            error={error}
            loading={submitting}
            onVerify={code => submitCode(code, false)}
          />
        );
      case 'failed':
        return (
          <View style={styles.center}>
            <Text style={styles.failure}>{phase.message}</Text>
            <GradientButton title={t.retry} onPress={loadSetup} />
            <GradientButton
              title={t.backToLogin}
              onPress={() => navigation.popTo('Login')}
              style={styles.secondary}
            />
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScreenHeader title={t.headerTitle} onBackPress={navigation.goBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {body()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.white,
    },
    content: {
      flexGrow: 1,
      paddingHorizontal: scale(24),
      paddingTop: verticalScale(24),
      paddingBottom: verticalScale(32),
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: verticalScale(16),
    },
    muted: {
      fontSize: normalizeFont(13),
      fontFamily: fonts.regular,
      color: colors.mutedText,
    },
    failure: {
      fontSize: normalizeFont(14),
      lineHeight: normalizeFont(20),
      fontFamily: fonts.medium,
      color: colors.red,
      textAlign: 'center',
    },
    secondary: {
      marginTop: verticalScale(4),
    },
  }),
);

export default MfaScreen;
