import { useCallback } from 'react';

import { useAuth } from '../hooks/useAuth';
import strings from '../constants/strings';
import { appAlert } from '../components/shared/AppAlert';

/**
 * Confirmed Log Out (used by the side menu). Signing out swaps the root
 * navigator back to the auth screens, so no manual navigation is needed.
 */
export const useLogout = () => {
  const { signOut } = useAuth();

  return useCallback(() => {
    appAlert(strings.home.logOut, strings.home.areYouSureYouWant, [
      { text: strings.common.cancel, style: 'cancel' },
      {
        text: strings.home.logOut,
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch {
            appAlert(
              strings.home.logOutFailed,
              strings.home.unableToClearYourSession,
            );
          }
        },
      },
    ]);
  }, [signOut]);
};
