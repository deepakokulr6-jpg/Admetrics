import { useCallback } from 'react';
import { Alert } from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import strings from '../constants/strings';

/**
 * Profile menu shown from the avatar in the home header: who is signed in
 * and a confirmed Log Out. Signing out swaps the root navigator back to the
 * auth screens (see RootNavigator), so no manual navigation is needed.
 */
export const useProfileMenu = () => {
  const { user, signOut } = useAuth();

  const confirmLogout = useCallback(() => {
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

  const openProfileMenu = useCallback(() => {
    Alert.alert(
      strings.home.yourProfile,
      user?.email
        ? strings.home.signedInAs(user.email)
        : strings.home.youAreSignedInTo,
      [
        { text: strings.common.close, style: 'cancel' },
        {
          text: strings.home.logOut,
          style: 'destructive',
          onPress: confirmLogout,
        },
      ],
    );
  }, [user?.email, confirmLogout]);

  return { openProfileMenu, confirmLogout };
};

export default useProfileMenu;
