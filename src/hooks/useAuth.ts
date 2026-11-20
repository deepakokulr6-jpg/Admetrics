import { useCallback, useMemo } from 'react';

import {
  changePassword,
  isEmailRegistered,
  registerAccount,
  requestPasswordReset,
  resetPassword,
  verifyPasswordResetOtp,
} from '../services/authService';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  signIn as signInThunk,
  signOut as signOutThunk,
} from '../store/slices/authSlice';

/**
 * Auth for screens. State (user, isBootstrapping) lives in the Redux `auth`
 * slice; one-off calls (OTP, reset, email check) go straight to the service
 * because they don't change app state.
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const isBootstrapping = useAppSelector(state => state.auth.isBootstrapping);

  const signIn = useCallback(
    async (email: string, password: string) => {
      await dispatch(signInThunk({ email, password })).unwrap();
    },
    [dispatch],
  );

  const signOut = useCallback(async () => {
    await dispatch(signOutThunk()).unwrap();
  }, [dispatch]);

  return useMemo(
    () => ({
      user,
      isBootstrapping,
      signIn,
      signOut,
      // Registration deliberately does not sign in: the user is sent to the
      // account-created screen and logs in explicitly.
      signUp: registerAccount,
      isEmailRegistered,
      requestPasswordReset,
      verifyPasswordResetOtp,
      resetPassword,
      changePassword,
    }),
    [user, isBootstrapping, signIn, signOut],
  );
};

export default useAuth;
