import { useCallback, useMemo } from 'react';

import { type AuthUser, startSession } from '../services/authService';
import * as authApi from '../api/auth';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  sessionStarted,
  signOut as signOutThunk,
} from '../store/slices/authSlice';

/**
 * Auth for screens. State (user, isBootstrapping) lives in the Redux `auth`
 * slice; API steps (OTP, password, login, authenticator) go through
 * services/authApi. `completeSignIn` saves the tokens and opens the app.
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const isBootstrapping = useAppSelector(state => state.auth.isBootstrapping);

  const completeSignIn = useCallback(
    async (email: string, tokens: authApi.AuthTokens): Promise<AuthUser> => {
      const signedIn = await startSession(email, tokens);
      dispatch(sessionStarted(signedIn));
      return signedIn;
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
      signOut,
      completeSignIn,
      // Signup: email code → password.
      requestSignupOtp: authApi.requestSignupOtp,
      verifySignupOtp: authApi.verifySignupOtp,
      registerPassword: authApi.registerPassword,
      // Login: password → authenticator (set up on first login).
      login: authApi.login,
      startMfaSetup: authApi.startMfaSetup,
      confirmMfa: authApi.confirmMfa,
      verifyMfa: authApi.verifyMfa,
      // Forgot password: email code → token → new password.
      requestPasswordReset: authApi.requestPasswordReset,
      verifyPasswordResetOtp: authApi.verifyPasswordResetOtp,
      resetPassword: (_email: string, token: string, password: string) =>
        authApi.resetPassword(token, password),
      // Signed in: the server knows the account from the access token.
      changePassword: (
        _email: string,
        currentPassword: string,
        newPassword: string,
      ) => authApi.changePassword(currentPassword, newPassword),
    }),
    [user, isBootstrapping, signOut, completeSignIn],
  );
};

export default useAuth;
