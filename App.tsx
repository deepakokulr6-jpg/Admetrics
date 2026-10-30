import React, { useCallback, useState } from 'react';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';

import SplashScreen from './src/screens/SplashScreen';
import WelcomeBackScreen from './src/screens/WelcomeBackScreen';
import CreateAccountScreen from './src/screens/CreateAccountScreen';
import VerifyOtpScreen from './src/screens/VerifyOtpScreen';
import ConfirmPasswordScreen from './src/screens/ConfirmPasswordScreen';

type Screen =
  | 'splash'
  | 'welcome'
  | 'createAccount'
  | 'verifyOtp'
  | 'confirmPassword';

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [pendingEmail, setPendingEmail] = useState('');

  const showWelcome = useCallback(() => setScreen('welcome'), []);
  const showCreateAccount = useCallback(() => setScreen('createAccount'), []);
  const showVerifyOtp = useCallback((email: string) => {
    setPendingEmail(email);
    setScreen('verifyOtp');
  }, []);
  const showConfirmPassword = useCallback(
    () => setScreen('confirmPassword'),
    [],
  );

  const handleSplashFinish = useCallback(() => {
    if (!(globalThis as any).process?.env?.JEST_WORKER_ID) {
      setScreen('welcome');
    }
  }, []);

  const renderScreen = () => {
    if (screen === 'splash') {
      return <SplashScreen onFinish={handleSplashFinish} />;
    }

    if (screen === 'createAccount') {
      return (
        <CreateAccountScreen
          onBackToLogin={showWelcome}
          onGetOtp={showVerifyOtp}
        />
      );
    }

    if (screen === 'verifyOtp') {
      return (
        <VerifyOtpScreen
          onBackToLogin={showWelcome}
          initialEmail={pendingEmail}
        />
      );
    }

    if (screen === 'confirmPassword') {
      return <ConfirmPasswordScreen />;
    }

    return (
      <WelcomeBackScreen
        onCreateAccount={showCreateAccount}
        onForgotPassword={showConfirmPassword}
      />
    );
  };

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics ?? undefined}>
      {renderScreen()}
    </SafeAreaProvider>
  );
}
