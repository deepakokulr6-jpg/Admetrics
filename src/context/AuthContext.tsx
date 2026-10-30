import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  AuthUser,
  isEmailRegistered as checkEmailRegistered,
  login,
  logout,
  registerAccount,
  restoreSession,
} from '../services/authService';

type AuthContextValue = {
  user: AuthUser | null;
  isBootstrapping: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  isEmailRegistered: (email: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      try {
        const restored = await restoreSession();

        if (!cancelled) {
          setUser(restored);
        }
      } catch (error) {
        console.warn('[AuthProvider] Session restore failed', error);
      } finally {
        if (!cancelled) {
          setIsBootstrapping(false);
        }
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const authenticatedUser = await login(email, password);
    setUser(authenticatedUser);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    // Registration deliberately does not create a session. The user is sent
    // to the account-created screen and signs in explicitly afterwards.
    return registerAccount(email, password);
  }, []);

  const signOut = useCallback(async () => {
    await logout();
    setUser(null);
  }, []);

  const isEmailRegistered = useCallback(
    (email: string) => checkEmailRegistered(email),
    [],
  );

  const value = useMemo(
    () => ({
      user,
      isBootstrapping,
      signIn,
      signUp,
      signOut,
      isEmailRegistered,
    }),
    [user, isBootstrapping, signIn, signUp, signOut, isEmailRegistered],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }

  return context;
};
