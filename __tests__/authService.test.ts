import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

import {
  AuthError,
  DEVELOPMENT_OTP,
  isEmailRegistered,
  login,
  logout,
  registerAccount,
  requestPasswordReset,
  resetLocalAuthForTests,
  resetPassword,
  restoreSession,
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

test('logs in, restores the session, and logs out', async () => {
  await registerAccount('owner@example.com', 'password123');

  const user = await login('owner@example.com', 'password123');
  expect(user.name).toBe('Owner');

  expect(await restoreSession()).toEqual(user);

  await logout();
  expect(await restoreSession()).toBeNull();
});

test('rejects an incorrect password', async () => {
  await registerAccount('owner@example.com', 'password123');

  await expect(login('owner@example.com', 'wrongpass')).rejects.toThrow(
    'Incorrect password. Please try again.',
  );
});

test('rejects unknown accounts', async () => {
  await expect(login('missing@example.com', 'password123')).rejects.toThrow(
    'No account found for this email. Please create an account first.',
  );
});

test('stays logged out even when the keychain cannot be cleared', async () => {
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

  try {
    await registerAccount('owner@example.com', 'password123');
    await login('owner@example.com', 'password123');

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

  await expect(login('reset@example.com', 'oldpassword')).rejects.toThrow(
    'Incorrect password. Please try again.',
  );

  const user = await login('reset@example.com', 'newpassword');
  expect(user.email).toBe('reset@example.com');
});

test('rejects password reset without a valid verification token', async () => {
  await registerAccount('reset@example.com', 'oldpassword');

  await expect(
    resetPassword('reset@example.com', 'not-a-token', 'newpassword'),
  ).rejects.toThrow('Your password reset session has expired. Please start again.');
});

test('does not create an account during password reset', async () => {
  await expect(requestPasswordReset('missing@example.com')).rejects.toThrow(
    'No account found for this email. Please create an account first.',
  );

  expect(await isEmailRegistered('missing@example.com')).toBe(false);
});
