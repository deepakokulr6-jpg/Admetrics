import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { disableBiometric } from './biometricService';
import strings from '../constants/strings';
import { DeviceEventEmitter } from 'react-native';
import { configureAuth } from '../api/client';
import { type AuthTokens, logoutRemote, refreshTokens } from '../api/auth';

/** Emitted when the server session can't be renewed (App signs out). */
export const SESSION_EXPIRED_EVENT = 'admetrics.sessionExpired';

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
    throw new AuthError(strings.authService.unableToAccessLocalStorage);
  }
};

const writeAccounts = async (accounts: StoredAccount[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (error) {
    console.warn('[authService] Unable to save local accounts', error);
    throw new AuthError(strings.authService.unableToSaveYourAccount);
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

  // Tokens are secrets: never written to AsyncStorage. Only the old
  // development fallback entry is cleared.
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.warn('[authService] Unable to clear fallback session', error);
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
    throw new AuthError(strings.authService.anAccountWithThisEmail);
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
    throw new AuthError(strings.authService.noAccountFoundForThis);
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
    throw new AuthError(strings.authService.noAccountFoundForThis);
  }

  if (otp.trim() !== DEVELOPMENT_OTP) {
    throw new AuthError(strings.authService.incorrectOtpPleaseTryAgain);
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
    throw new AuthError(strings.authService.yourPasswordResetSessionHas);
  }

  const accounts = await readAccounts();
  const accountIndex = accounts.findIndex(
    account => account.email === normalizedEmail,
  );

  if (accountIndex === -1) {
    passwordResetTickets.delete(normalizedEmail);
    throw new AuthError(strings.authService.noAccountFoundForThis);
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
 * Signed-in password change: checks the current password, then saves the
 * new one. The session stays signed in.
 */
export const changePassword = async (
  email: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> => {
  const normalizedEmail = normalizeEmail(email);
  const accounts = await readAccounts();
  const index = accounts.findIndex(a => a.email === normalizedEmail);

  if (index === -1) {
    throw new AuthError(strings.authService.noAccountFoundForThis);
  }
  if (
    accounts[index].passwordHash !==
    hashPassword(normalizedEmail, currentPassword)
  ) {
    throw new AuthError(strings.changePassword.currentIncorrect);
  }

  const updated = [...accounts];
  updated[index] = {
    ...updated[index],
    passwordHash: hashPassword(normalizedEmail, newPassword),
  };
  await writeAccounts(updated);
};

/**
 * Saves a signed-in session from the API: the tokens go to the Keychain
 * only (never AsyncStorage). Returns the user for the auth slice.
 */
export const startSession = async (
  email: string,
  tokens: AuthTokens,
): Promise<AuthUser> => {
  const normalizedEmail = normalizeEmail(email);
  await persistSession({
    email: normalizedEmail,
    token: JSON.stringify(tokens),
    createdAt: new Date().toISOString(),
  });
  return { email: normalizedEmail, name: buildDisplayName(normalizedEmail) };
};

// Global in React Native (Hermes); not in the TS lib this project uses.
declare const atob: (data: string) => string;

/** `exp` (seconds) from a JWT, or null if it isn't a readable JWT. */
const jwtExpiry = (jwt: string): number | null => {
  try {
    const payload = jwt.split('.')[1];
    if (!payload) {
      return null;
    }
    const json = JSON.parse(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/')),
    ) as { exp?: number };
    return typeof json.exp === 'number' ? json.exp : null;
  } catch {
    return null;
  }
};

/** Saved tokens from the Keychain, or null. */
const readTokens = async (): Promise<{
  email: string;
  tokens: AuthTokens;
} | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: KEYCHAIN_SERVICE,
    });
    if (!credentials) {
      return null;
    }
    const tokens = JSON.parse(credentials.password) as AuthTokens;
    return tokens?.accessToken ? { email: credentials.username, tokens } : null;
  } catch {
    return null;
  }
};

const isExpired = (jwt: string) => {
  const exp = jwtExpiry(jwt);
  // 30 s early, so a token doesn't expire mid-request.
  return exp !== null && exp * 1000 - 30000 < Date.now();
};

/**
 * Valid tokens for `email`'s saved session: the stored ones, or new ones
 * from /auth/refresh when the access token has expired. Null = sign in.
 */
const freshTokens = async (
  force = false,
): Promise<{
  email: string;
  tokens: AuthTokens;
} | null> => {
  const saved = await readTokens();
  if (!saved) {
    return null;
  }
  if (!force && !isExpired(saved.tokens.accessToken)) {
    return saved;
  }
  if (!saved.tokens.refreshToken) {
    return null;
  }
  try {
    const tokens = await refreshTokens(saved.tokens.refreshToken);
    await persistSession({
      email: saved.email,
      token: JSON.stringify(tokens),
      createdAt: new Date().toISOString(),
    });
    return { email: saved.email, tokens };
  } catch (error) {
    console.warn('[authService] Token refresh failed', error);
    return null;
  }
};

/** Access token for API calls, or null when signed out / expired. */
export const getAccessToken = async (): Promise<string | null> =>
  (await freshTokens())?.tokens.accessToken ?? null;

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
    return null;
  }

  // API session: refresh an expired access token; no luck → sign in.
  const session = await freshTokens();
  if (!session) {
    await clearSession();
    return null;
  }

  return { email, name: buildDisplayName(email) };
};

export const logout = async (): Promise<void> => {
  passwordResetTickets.clear();
  // End the session on the server; offline / expired still logs out here.
  const saved = await readTokens();
  if (saved) {
    try {
      await logoutRemote(saved.tokens);
    } catch (error) {
      console.warn('[authService] Server logout failed', error);
    }
  }
  await clearSession();
  // The lock belongs to this account; the next user sets their own.
  await disableBiometric();
};

export const resetLocalAuthForTests = async (): Promise<void> => {
  await AsyncStorage.removeItem(ACCOUNTS_KEY);
  passwordResetTickets.clear();
  await clearSession();
  await AsyncStorage.removeItem(LOGGED_OUT_KEY);
};

// Signed-in API calls (`apiRequest(path, { auth: true })`) get their token,
// a one-time refresh on 401, and a sign-out when the session is gone.
configureAuth({
  getAccessToken,
  refreshAccessToken: async () =>
    (await freshTokens(true))?.tokens.accessToken ?? null,
  onSessionExpired: () => DeviceEventEmitter.emit(SESSION_EXPIRED_EVENT),
});
