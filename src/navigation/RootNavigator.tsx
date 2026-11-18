import React, { useCallback, useRef, useState } from 'react';
import {
  NavigationContainer,
  type NavigationState,
} from '@react-navigation/native';

import SplashScreen from '../screens/auth/SplashScreen';
import AuthNavigator, { navigationTheme } from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { useAuth } from '../hooks/useAuth';
import { useColorScheme } from '../theme/appearance';
import { useAppLock } from '../hooks/useAppLock';
import BiometricLock from '../components/shared/BiometricLock';

/**
 * Gate for the whole application:
 *   1. show the animated splash while the saved session is restored;
 *   2. then mount either the auth stack or the authenticated app stack.
 *
 * The login screen is never mounted before the session check finishes, which
 * avoids the "login flash" for already signed-in users.
 */
const RootNavigator = () => {
  const { user, isBootstrapping, signOut } = useAuth();
  const { lock, unlock } = useAppLock(Boolean(user), !isBootstrapping);
  const [splashFinished, setSplashFinished] = useState(false);
  const scheme = useColorScheme();
  // Last navigation state, so a theme switch re-draws every screen with the
  // new colours and lands back on the same screen (no app reload).
  const navState = useRef<NavigationState | undefined>(undefined);

  const handleSplashFinish = useCallback(() => {
    setSplashFinished(true);
  }, []);

  if (!splashFinished || isBootstrapping) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <>
      <NavigationContainer
        key={scheme}
        theme={navigationTheme()}
        initialState={navState.current}
        onStateChange={state => {
          navState.current = state;
        }}
      >
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
      {/* Biometric lock covers the app; navigation state stays underneath. */}
      {lock ? (
        <BiometricLock
          biometry={lock}
          onUnlock={unlock}
          onUsePassword={signOut}
        />
      ) : null}
    </>
  );
};

export default RootNavigator;
