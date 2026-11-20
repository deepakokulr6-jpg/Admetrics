import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

import {
  AuthError,
  changePassword,
  DEVELOPMENT_OTP,
  isEmailRegistered,
  logout,
  registerAccount,
  requestPasswordReset,
  resetLocalAuthForTests,
  resetPassword,
  restoreSession,
  startSession,
  verifyPasswordResetOtp,
} from '../src/services/authService';

beforeEach(async () => {
  await resetLocalAuthForTests();
  jest.clearAllMocks();
});

test('registers an account without storing the plain-text password', async () => {
  const user = await registerAccount('Dr.Sharma@Clinic.com', 'password123');

  expect(user).toEqual({ email: 'dr.sharma@clinic.com', name: 'Dr Sharma' });
  expect(await isEmailRegistered('dr.sharma@clinic.com')).toBe(true);

  const raw = await AsyncStorage.getItem('@admetrics/accounts/v1');

  expect(raw).toContain('dr.sharma@clinic.com');
  expect(raw).not.toContain('password123');
});

test('prevents duplicate email registrations', async () => {
  await registerAccount('clinic@example.com', 'password123');

  await expect(
    registerAccount('CLINIC@example.com', 'anotherpass'),
  ).rejects.toThrow(AuthError);
});

/** Unsigned JWT with the given `exp` (seconds) — enough for expiry checks. */
const jwt = (exp: number) =>
  `h.${btoa(JSON.stringify({ exp }))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/[=]+$/, '')}.s`;
declare const btoa: (data: string) => string;
const future = () => Math.floor(Date.now() / 1000) + 3600;

test('starts an API session, restores it, and logs out', async () => {
  const user = await startSession('Owner@Example.com', {
    accessToken: jwt(future()),
    refreshToken: 'refresh',
  });
  expect(user).toEqual({ email: 'owner@example.com', name: 'Owner' });

  expect(await restoreSession()).toEqual(user);

  await logout();
  expect(await restoreSession()).toBeNull();
});

test('keeps tokens out of AsyncStorage', async () => {
  const accessToken = jwt(future());
  await startSession('owner@example.com', { accessToken });

  const keys = await AsyncStorage.getAllKeys();
  const values = await Promise.all(keys.map(key => AsyncStorage.getItem(key)));
  expect(JSON.stringify(values)).not.toContain(accessToken);
});

test('treats an expired access token as signed out', async () => {
  await startSession('owner@example.com', {
    accessToken: jwt(Math.floor(Date.now() / 1000) - 60),
  });
  expect(await restoreSession()).toBeNull();
});

test('refreshes an expired access token on launch', async () => {
  const fresh = jwt(future());
  globalThis.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    text: () => Promise.resolve(JSON.stringify({ accessToken: fresh })),
  }) as unknown as typeof fetch;
  jest.spyOn(console, 'log').mockImplementation(() => {});

  await startSession('owner@example.com', {
    accessToken: jwt(Math.floor(Date.now() / 1000) - 60),
    refreshToken: 'r'.repeat(40),
  });

  expect(await restoreSession()).toEqual({
    email: 'owner@example.com',
    name: 'Owner',
  });
  expect(globalThis.fetch).toHaveBeenCalledWith(
    expect.stringContaining('/auth/refresh'),
    expect.objectContaining({ method: 'POST' }),
  );
});

test('logout tells the server, then clears the session', async () => {
  globalThis.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 204,
    text: () => Promise.resolve(''),
  }) as unknown as typeof fetch;
  jest.spyOn(console, 'log').mockImplementation(() => {});
  const accessToken = jwt(future());
  await startSession('owner@example.com', { accessToken });

  await logout();

  expect(globalThis.fetch).toHaveBeenCalledWith(
    expect.stringContaining('/auth/logout'),
    expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: `Bearer ${accessToken}`,
      }),
    }),
  );
  expect(await restoreSession()).toBeNull();
});

test('stays logged out even when the keychain cannot be cleared', async () => {
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

  try {
    await startSession('owner@example.com', { accessToken: jwt(future()) });

    (Keychain.resetGenericPassword as jest.Mock).mockRejectedValueOnce(
      new Error('keychain unavailable'),
    );

    await logout();

    expect(await restoreSession()).toBeNull();
  } finally {
    warnSpy.mockRestore();
  }
});

test('resets an existing password only after OTP verification', async () => {
  await registerAccount('reset@example.com', 'oldpassword');

  await requestPasswordReset('reset@example.com');
  const resetToken = await verifyPasswordResetOtp(
    'reset@example.com',
    DEVELOPMENT_OTP,
  );

  await resetPassword('reset@example.com', resetToken, 'newpassword');

  // The new password is now the current one.
  await expect(
    changePassword('reset@example.com', 'oldpassword', 'x'.repeat(8)),
  ).rejects.toBeInstanceOf(AuthError);
  await changePassword('reset@example.com', 'newpassword', 'another123');
});

test('rejects password reset without a valid verification token', async () => {
  await registerAccount('reset@example.com', 'oldpassword');

  await expect(
    resetPassword('reset@example.com', 'not-a-token', 'newpassword'),
  ).rejects.toThrow(
    'Your password reset session has expired. Please start again.',
  );
});

test('does not create an account during password reset', async () => {
  await expect(requestPasswordReset('missing@example.com')).rejects.toThrow(
    'No account found for this email. Please create an account first.',
  );

  expect(await isEmailRegistered('missing@example.com')).toBe(false);
});

test('changes the password only when the current one is correct', async () => {
  await registerAccount('doc@clinic.com', 'oldpass123');

  await expect(
    changePassword('doc@clinic.com', 'wrongpass', 'newpass123'),
  ).rejects.toBeInstanceOf(AuthError);

  await changePassword('Doc@Clinic.com', 'oldpass123', 'newpass123');

  await expect(
    changePassword('doc@clinic.com', 'oldpass123', 'other1234'),
  ).rejects.toBeInstanceOf(AuthError);
  await changePassword('doc@clinic.com', 'newpass123', 'other1234');
});
