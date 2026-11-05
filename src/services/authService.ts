import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

/**
 * TEMPORARY LOCAL AUTHENTICATION
 * ---------------------------------------------------------------------------
 * This module is the single place that knows how Admetrics stores development
 * accounts and sessions while there is no backend. When the real API arrives,
 * replace the implementations below with network calls; screens and the auth
 * context should not need to change.
 *
 * Passwords are never stored in plain text, but the local hash below is a
 * lightweight development obfuscation (not a production password hash).
 * Production authentication must happen on a server.
 */

const ACCOUNTS_KEY = '@admetrics/accounts/v1';
const SESSION_KEY = '@admetrics/session/v1';
const LOGGED_OUT_KEY = '@admetrics/logged-out/v1';
const KEYCHAIN_SERVICE = 'com.admetrics.session';

/** Development-only OTP used by the local auth flows. */
export const DEVELOPMENT_OTP = '123456';

const PASSWORD_RESET_TTL_MS = 10 * 60 * 1000;

export type AuthUser = {
  email: string;
  name: string;
};

type StoredAccount = AuthUser & {
  passwordHash: string;
  createdAt: string;
};

type StoredSession = {
  email: string;
  token: string;
  createdAt: string;
};

type PasswordResetTicket = {
  token: string;
  expiresAt: number;
};

/**
 * Password-reset tickets are intentionally kept in memory: they only need to
 * survive long enough for the user to move from OTP verification to the
 * confirm-password screen. A real backend would issue a short-lived token.
 */
const passwordResetTickets = new Map<string, PasswordResetTicket>();

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const buildDisplayName = (email: string): string => {
  const localPart = normalizeEmail(email).split('@')[0] ?? '';
  const words = localPart.split(/[._-]+/).filter(Boolean);

  if (words.length === 0) {
    return 'User';
  }

  return words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Development-only password obfuscation. Do not use in production.
 */
const fnv1a = (input: string): string => {
  let hash = 0x811c9dc5;

  for (let index = 0; index < input.length; index++) {
    // eslint-disable-next-line no-bitwise
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  // eslint-disable-next-line no-bitwise
  return (hash >>> 0).toString(16).padStart(8, '0');
};

const hashPassword = (email: string, password: string): string => {
  const salt = 'admetrics-dev-only-salt-v1';
  let seed = `${salt}:${normalizeEmail(email)}:${password}`;
  let digest = '';

  for (let round = 0; round < 4; round++) {
    digest += fnv1a(`${seed}:${round}`);
    seed = digest;
  }

  return digest;
};

const createToken = (): string =>
  `dev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;

const readAccounts = async (): Promise<StoredAccount[]> => {
  try {
    const raw = await AsyncStorage.getItem(ACCOUNTS_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? (parsed as StoredAccount[]) : [];
  } catch (error) {
    console.warn('[authService] Unable to read local accounts', error);
    throw new AuthError(
      'Unable to access local storage. Please restart the app and try again.',
    );
  }
};

const writeAccounts = async (accounts: StoredAccount[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (error) {
    console.warn('[authService] Unable to save local accounts', error);
    throw new AuthError('Unable to save your account on this device.');
  }
};

const persistSession = async (session: StoredSession): Promise<void> => {
  // A fresh sign-in supersedes any previous logout.
  try {
    await AsyncStorage.removeItem(LOGGED_OUT_KEY);
  } catch (error) {
    console.warn('[authService] Unable to clear logout marker', error);
  }

  // Keychain is the preferred store on Android/iOS. AsyncStorage keeps a
  // fallback so the app still restores a session on devices where the native
  // keychain module is unavailable.
  try {
    await Keychain.setGenericPassword(session.email, session.token, {
      service: KEYCHAIN_SERVICE,
    });
  } catch (error) {
    console.warn(
      '[authService] Keychain unavailable, using AsyncStorage',
      error,
    );
  }

  try {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.warn('[authService] Unable to persist fallback session', error);
  }
};

const clearSession = async (): Promise<void> => {
  // The marker guarantees that a stale keychain entry cannot sign the user
  // back in if resetGenericPassword fails (for example on some devices).
  try {
    await AsyncStorage.setItem(LOGGED_OUT_KEY, '1');
  } catch (error) {
    console.warn('[authService] Unable to persist logout marker', error);
  }

  try {
    await Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICE });
  } catch (error) {
    console.warn('[authService] Unable to clear keychain session', error);
  }

  try {
    await AsyncStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.warn('[authService] Unable to clear fallback session', error);
  }
};

const findAccount = (
  accounts: StoredAccount[],
  email: string,
): StoredAccount | undefined =>
  accounts.find(account => account.email === normalizeEmail(email));

const toUser = (account: StoredAccount): AuthUser => ({
  email: account.email,
  name: account.name,
});

/**
 * Creates a local account. Does not sign the user in.
 */
export const registerAccount = async (
  email: string,
  password: string,
): Promise<AuthUser> => {
  const normalizedEmail = normalizeEmail(email);
  const accounts = await readAccounts();

  if (findAccount(accounts, normalizedEmail)) {
    throw new AuthError(
      'An account with this email already exists. Please sign in instead.',
    );
  }

  const account: StoredAccount = {
    email: normalizedEmail,
    name: buildDisplayName(normalizedEmail),
    passwordHash: hashPassword(normalizedEmail, password),
    createdAt: new Date().toISOString(),
  };

  await writeAccounts([...accounts, account]);

  return toUser(account);
};

export const isEmailRegistered = async (email: string): Promise<boolean> => {
  const accounts = await readAccounts();

  return Boolean(findAccount(accounts, email));
};

/**
 * Starts the local password-reset flow. In this development build no email is
 * sent; callers show the fixed DEVELOPMENT_OTP instead.
 */
export const requestPasswordReset = async (email: string): Promise<void> => {
  const accounts = await readAccounts();

  if (!findAccount(accounts, email)) {
    throw new AuthError(
      'No account found for this email. Please create an account first.',
    );
  }
};

/**
 * Verifies the development OTP and issues a short-lived reset token. The token
 * must be supplied when changing the password so the confirm-password screen
 * cannot be reached without verification.
 */
export const verifyPasswordResetOtp = async (
  email: string,
  otp: string,
): Promise<string> => {
  const normalizedEmail = normalizeEmail(email);
  const accounts = await readAccounts();

  if (!findAccount(accounts, normalizedEmail)) {
    throw new AuthError(
      'No account found for this email. Please create an account first.',
    );
  }

  if (otp.trim() !== DEVELOPMENT_OTP) {
    throw new AuthError('Incorrect OTP. Please try again.');
  }

  const token = createToken();
  passwordResetTickets.set(normalizedEmail, {
    token,
    expiresAt: Date.now() + PASSWORD_RESET_TTL_MS,
  });

  return token;
};

/**
 * Changes the password for an existing account. It never creates a new
 * account and requires a token produced by verifyPasswordResetOtp.
 */
export const resetPassword = async (
  email: string,
  token: string,
  newPassword: string,
): Promise<void> => {
  const normalizedEmail = normalizeEmail(email);
  const ticket = passwordResetTickets.get(normalizedEmail);

  if (
    !ticket ||
    !token ||
    ticket.token !== token ||
    ticket.expiresAt <= Date.now()
  ) {
    passwordResetTickets.delete(normalizedEmail);
    throw new AuthError(
      'Your password reset session has expired. Please start again.',
    );
  }

  const accounts = await readAccounts();
  const accountIndex = accounts.findIndex(
    account => account.email === normalizedEmail,
  );

  if (accountIndex === -1) {
    passwordResetTickets.delete(normalizedEmail);
    throw new AuthError(
      'No account found for this email. Please create an account first.',
    );
  }

  const updatedAccounts = [...accounts];
  updatedAccounts[accountIndex] = {
    ...updatedAccounts[accountIndex],
    passwordHash: hashPassword(normalizedEmail, newPassword),
  };

  await writeAccounts(updatedAccounts);
  passwordResetTickets.delete(normalizedEmail);
};

/**
 * Validates local credentials and persists the session.
 */
export const login = async (
  email: string,
  password: string,
): Promise<AuthUser> => {
  const accounts = await readAccounts();
  const account = findAccount(accounts, email);

  if (!account) {
    throw new AuthError(
      'No account found for this email. Please create an account first.',
    );
  }

  if (account.passwordHash !== hashPassword(email, password)) {
    throw new AuthError('Incorrect password. Please try again.');
  }

  await persistSession({
    email: account.email,
    token: createToken(),
    createdAt: new Date().toISOString(),
  });

  return toUser(account);
};

/**
 * Restores a previously saved session. Returns null when no valid session
 * exists or storage cannot be read.
 */
export const restoreSession = async (): Promise<AuthUser | null> => {
  let email: string | null = null;
  let token: string | null = null;

  try {
    const loggedOut = await AsyncStorage.getItem(LOGGED_OUT_KEY);

    if (loggedOut === '1') {
      // The user explicitly signed out. Clear any keychain entry that could
      // not be removed earlier and keep the sign-in screen on screen.
      await clearSession();
      return null;
    }
  } catch (error) {
    console.warn('[authService] Unable to read logout marker', error);
  }

  try {
    const credentials = await Keychain.getGenericPassword({
      service: KEYCHAIN_SERVICE,
    });

    if (credentials) {
      email = credentials.username;
      token = credentials.password;
    }
  } catch (error) {
    console.warn('[authService] Unable to read keychain session', error);
  }

  if (!email || !token) {
    try {
      const raw = await AsyncStorage.getItem(SESSION_KEY);

      if (raw) {
        const session = JSON.parse(raw) as StoredSession;
        email = session.email ?? null;
        token = session.token ?? null;
      }
    } catch (error) {
      console.warn('[authService] Unable to read fallback session', error);
    }
  }

  if (!email || !token) {
    return null;
  }

  try {
    const accounts = await readAccounts();
    const account = findAccount(accounts, email);

    if (!account) {
      await clearSession();
      return null;
    }

    return toUser(account);
  } catch (error) {
    console.warn('[authService] Unable to validate saved session', error);
    return null;
  }
};

export const logout = async (): Promise<void> => {
  passwordResetTickets.clear();
  await clearSession();
};

export const resetLocalAuthForTests = async (): Promise<void> => {
  await AsyncStorage.removeItem(ACCOUNTS_KEY);
  passwordResetTickets.clear();
  await clearSession();
  await AsyncStorage.removeItem(LOGGED_OUT_KEY);
};
