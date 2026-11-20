import { apiRequest } from './client';
import { ENDPOINTS } from './endpoints';

/**
 * Admetrics auth API (see the backend Postman collection):
 *
 *   signup  POST /auth/signup/request-otp {email}
 *           POST /auth/signup/verify-otp  {email, otp} → verificationToken
 *           POST /auth/register           {verificationToken, password}
 *   login   POST /auth/login              {email, password} → challengeToken
 *   MFA     POST /auth/mfa/setup          {challengeToken} → secret + otpauth
 *  (1st)    POST /auth/mfa/confirm        {challengeToken, code} → tokens
 *  (later)  POST /auth/mfa/verify         {challengeToken, code} → tokens
 *  session  POST /auth/refresh            {refreshToken} → tokens
 *           POST /auth/logout             (Bearer) {refreshToken}
 *
 * Response field names aren't documented yet, so each reader accepts the
 * usual spellings; `[api]` dev logs show the real shape.
 */

type Json = Record<string, unknown>;

const asRecord = (value: unknown): Json =>
  value && typeof value === 'object' ? (value as Json) : {};

/** First string found at any of `paths` ("a.b" = nested). */
const pick = (body: unknown, paths: string[]): string | undefined => {
  for (const path of paths) {
    let current: unknown = body;
    for (const key of path.split('.')) {
      current = asRecord(current)[key];
    }
    if (typeof current === 'string' && current) {
      return current;
    }
  }
  return undefined;
};

const pickFlag = (body: unknown, paths: string[]): boolean | undefined => {
  for (const path of paths) {
    let current: unknown = body;
    for (const key of path.split('.')) {
      current = asRecord(current)[key];
    }
    if (typeof current === 'boolean') {
      return current;
    }
  }
  return undefined;
};

export type AuthTokens = { accessToken: string; refreshToken?: string };

const readTokens = (body: unknown): AuthTokens | null => {
  const accessToken = pick(body, [
    'accessToken',
    'access_token',
    'tokens.accessToken',
    'data.accessToken',
    'token',
  ]);
  if (!accessToken) {
    return null;
  }
  return {
    accessToken,
    refreshToken: pick(body, [
      'refreshToken',
      'refresh_token',
      'tokens.refreshToken',
      'data.refreshToken',
    ]),
  };
};

// ------------------------------------------------------------------ signup

export type OtpRequest = {
  /** Seconds until the code expires. */
  expiresIn: number;
  /** Seconds before another code can be requested. */
  resendAfter: number;
};

export const requestSignupOtp = async (email: string): Promise<OtpRequest> => {
  const body = asRecord(
    await apiRequest(ENDPOINTS.auth.signupRequestOtp, { body: { email } }),
  );
  return {
    expiresIn: Number(body.otpExpiresIn) || 600,
    resendAfter: Number(body.resendAfter) || 60,
  };
};

/** Returns the one-time token that lets the user set a password. */
export const verifySignupOtp = async (
  email: string,
  otp: string,
): Promise<string> => {
  const body = await apiRequest(ENDPOINTS.auth.signupVerifyOtp, {
    body: { email, otp },
  });
  const token = pick(body, [
    'verificationToken',
    'token',
    'data.verificationToken',
  ]);
  if (!token) {
    throw new Error('verify-otp: no verificationToken in response');
  }
  return token;
};

export const registerPassword = async (
  verificationToken: string,
  password: string,
): Promise<void> => {
  await apiRequest(ENDPOINTS.auth.register, {
    body: { verificationToken, password },
  });
};

// ------------------------------------------------------------------- login

export type LoginResult =
  | { kind: 'signedIn'; tokens: AuthTokens }
  /** Password OK; an authenticator code is needed next. */
  | { kind: 'mfa'; challengeToken: string; setupRequired?: boolean };

export const login = async (
  email: string,
  password: string,
): Promise<LoginResult> => {
  const body = await apiRequest(ENDPOINTS.auth.login, {
    body: { email, password },
  });

  const tokens = readTokens(body);
  const challengeToken = pick(body, [
    'challengeToken',
    'challenge.token',
    'data.challengeToken',
    'mfa.challengeToken',
  ]);
  if (challengeToken) {
    const step = (
      pick(body, ['nextStep', 'status', 'step', 'mfa.status']) ?? ''
    ).toUpperCase();
    const enrolled = pickFlag(body, [
      'mfaEnabled',
      'mfaEnrolled',
      'mfa.enabled',
    ]);
    const setupFlag = pickFlag(body, [
      'mfaSetupRequired',
      'requiresMfaSetup',
      'setupRequired',
      'mfa.setupRequired',
    ]);
    // Undefined = not stated; the screen then tries setup and falls back.
    const setupRequired =
      setupFlag ??
      (step.includes('SETUP') || step.includes('ENROL')
        ? true
        : step.includes('VERIFY')
        ? false
        : enrolled === undefined
        ? undefined
        : !enrolled);
    return { kind: 'mfa', challengeToken, setupRequired };
  }
  if (tokens) {
    return { kind: 'signedIn', tokens };
  }
  throw new Error('login: no challengeToken or accessToken in response');
};

// --------------------------------------------------------------------- MFA

export type MfaSetup = {
  /** Base32 key for typing into the authenticator app. */
  secret: string;
  /** otpauth:// link shown as a QR code. */
  otpauthUri: string;
};

export const startMfaSetup = async (
  challengeToken: string,
): Promise<MfaSetup> => {
  const body = await apiRequest(ENDPOINTS.auth.mfa.setup, {
    body: { challengeToken },
  });
  const otpauthUri =
    pick(body, [
      'otpauthUri',
      'otpauthUrl',
      'otpauth_url',
      'otpauth',
      'uri',
      'url',
      'data.otpauthUrl',
      'data.otpauthUri',
    ]) ?? '';
  // The key is also inside the otpauth link (…?secret=XXXX&…).
  const secret =
    pick(body, ['secret', 'base32', 'manualEntryKey', 'key', 'data.secret']) ??
    /[?&]secret=([^&]+)/.exec(otpauthUri)?.[1] ??
    '';
  if (!otpauthUri && !secret) {
    throw new Error('mfa/setup: no secret or otpauth link in response');
  }
  return {
    secret: decodeURIComponent(secret),
    otpauthUri:
      otpauthUri ||
      `otpauth://totp/Admetrics?secret=${encodeURIComponent(
        secret,
      )}&issuer=Admetrics`,
  };
};

const finishMfa = async (
  path: typeof ENDPOINTS.auth.mfa.confirm | typeof ENDPOINTS.auth.mfa.verify,
  challengeToken: string,
  code: string,
): Promise<AuthTokens> => {
  const body = await apiRequest(path, { body: { challengeToken, code } });
  const tokens = readTokens(body);
  if (!tokens) {
    throw new Error(`${path}: no accessToken in response`);
  }
  return tokens;
};

/** First login: confirm the new authenticator with its first code. */
export const confirmMfa = (challengeToken: string, code: string) =>
  finishMfa(ENDPOINTS.auth.mfa.confirm, challengeToken, code);

/** Every later login: the current authenticator code. */
export const verifyMfa = (challengeToken: string, code: string) =>
  finishMfa(ENDPOINTS.auth.mfa.verify, challengeToken, code);

// ----------------------------------------------------------------- session

/** New tokens for a still-valid refresh token (access token expired). */
export const refreshTokens = async (
  refreshToken: string,
): Promise<AuthTokens> => {
  const body = await apiRequest(ENDPOINTS.auth.refresh, {
    body: { refreshToken },
  });
  const tokens = readTokens(body);
  if (!tokens) {
    throw new Error('refresh: no accessToken in response');
  }
  // Keep the old refresh token if the server doesn't rotate it.
  return { ...tokens, refreshToken: tokens.refreshToken ?? refreshToken };
};

/** Ends the session on the server (the app clears its copy regardless). */
export const logoutRemote = async (tokens: AuthTokens): Promise<void> => {
  await apiRequest(ENDPOINTS.auth.logout, {
    token: tokens.accessToken,
    body: tokens.refreshToken ? { refreshToken: tokens.refreshToken } : {},
  });
};
