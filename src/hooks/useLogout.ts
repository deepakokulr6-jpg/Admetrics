import { useCallback } from 'react';
import { Alert } from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import strings from '../constants/strings';

/**
 * Confirmed Log Out (used by the side menu). Signing out swaps the root
 * navigator back to the auth screens, so no manual navigation is needed.
 */
export const useLogout = () => {
  const { signOut } = useAuth();

  return useCallback(() => {
    Alert.alert(strings.home.logOut, strings.home.areYouSureYouWant, [
      { text: strings.common.cancel, style: 'cancel' },
      {
        text: strings.home.logOut,
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch {
            Alert.alert(
              strings.home.logOutFailed,
              strings.home.unableToClearYourSession,
            );
          }
        },
      },
    ]);
  }, [signOut]);
};
