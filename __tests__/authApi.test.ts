import { ApiError } from '../src/api/client';
import {
  confirmMfa,
  login,
  requestSignupOtp,
  startMfaSetup,
  verifySignupOtp,
} from '../src/api/auth';

const respond = (status: number, body?: unknown) =>
  jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(body === undefined ? '' : JSON.stringify(body)),
  });

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

test('request-otp returns expiry and resend timers', async () => {
  globalThis.fetch = respond(200, {
    message: 'sent',
    otpExpiresIn: 600,
    resendAfter: 60,
  });
  await expect(requestSignupOtp('a@b.com')).resolves.toEqual({
    expiresIn: 600,
    resendAfter: 60,
  });
});

test('verify-otp returns the verification token', async () => {
  globalThis.fetch = respond(200, { verificationToken: 'vt' });
  await expect(verifySignupOtp('a@b.com', '123456')).resolves.toBe('vt');
});

test('a wrong code becomes ApiError 401 (empty body)', async () => {
  globalThis.fetch = respond(401);
  await expect(verifySignupOtp('a@b.com', '000000')).rejects.toEqual(
    new ApiError(401, 'HTTP 401'),
  );
});

test('login with a challenge asks for the authenticator', async () => {
  globalThis.fetch = respond(200, {
    challengeToken: 'ct',
    mfaSetupRequired: true,
  });
  await expect(login('a@b.com', 'pw')).resolves.toEqual({
    kind: 'mfa',
    challengeToken: 'ct',
    setupRequired: true,
  });
});

test('login with tokens signs straight in', async () => {
  globalThis.fetch = respond(200, { accessToken: 'at', refreshToken: 'rt' });
  await expect(login('a@b.com', 'pw')).resolves.toEqual({
    kind: 'signedIn',
    tokens: { accessToken: 'at', refreshToken: 'rt' },
  });
});

test('mfa setup reads the key from the otpauth link when needed', async () => {
  globalThis.fetch = respond(200, {
    otpauthUrl: 'otpauth://totp/Admetrics:a?secret=ABCD2345&issuer=Admetrics',
  });
  await expect(startMfaSetup('ct')).resolves.toEqual({
    secret: 'ABCD2345',
    otpauthUri: 'otpauth://totp/Admetrics:a?secret=ABCD2345&issuer=Admetrics',
  });
});

test('mfa confirm returns the session tokens', async () => {
  globalThis.fetch = respond(200, { tokens: { accessToken: 'at' } });
  await expect(confirmMfa('ct', '123456')).resolves.toEqual({
    accessToken: 'at',
    refreshToken: undefined,
  });
});

test('a network failure becomes ApiError 0', async () => {
  globalThis.fetch = jest.fn().mockRejectedValue(new TypeError('Network'));
  await expect(login('a@b.com', 'pw')).rejects.toMatchObject({ status: 0 });
});
