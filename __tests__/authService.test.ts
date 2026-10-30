import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  AuthError,
  isEmailRegistered,
  login,
  logout,
  registerAccount,
  resetLocalAuthForTests,
  restoreSession,
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
