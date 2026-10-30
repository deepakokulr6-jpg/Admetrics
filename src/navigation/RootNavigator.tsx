import React, { useCallback, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import SplashScreen from '../screens/SplashScreen';
import AuthNavigator, { navigationTheme } from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { useAuth } from '../context/AuthContext';

/**
 * Gate for the whole application:
 *   1. show the animated splash while the saved session is restored;
 *   2. then mount either the auth stack or the authenticated app stack.
 *
 * The login screen is never mounted before the session check finishes, which
 * avoids the "login flash" for already signed-in users.
 */
const RootNavigator = () => {
  const { user, isBootstrapping } = useAuth();
  const [splashFinished, setSplashFinished] = useState(false);

  const handleSplashFinish = useCallback(() => {
    setSplashFinished(true);
  }, []);

  if (!splashFinished || isBootstrapping) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator;
