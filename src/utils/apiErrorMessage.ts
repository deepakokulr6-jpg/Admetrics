import { ApiError } from '../api/client';
import strings from '../constants/strings';

const t = strings.apiErrors;

/** Which step failed, so 400/401 can be explained in context. */
export type AuthStep = 'otp' | 'password' | 'login' | 'mfa' | 'general';

/**
 * Friendly message for a failed auth call. The server currently sends no
 * body on errors, so the HTTP status decides; a server message, when sent,
 * is used for 400s.
 */
export const apiErrorMessage = (error: unknown, step: AuthStep): string => {
  if (!(error instanceof ApiError)) {
    return t.unexpected;
  }
  switch (error.status) {
    case 0:
      return error.message === 'timeout' ? t.timeout : t.network;
    case 401:
    case 403:
      return step === 'otp'
        ? t.badOtp
        : step === 'login'
        ? t.badLogin
        : step === 'mfa'
        ? t.badMfa
        : step === 'password'
        ? t.sessionExpired
        : t.unauthorized;
    case 404:
      return step === 'otp' ? t.notInvited : t.unexpected;
    case 409:
      return t.alreadyRegistered;
    case 410:
      return t.sessionExpired;
    case 429:
      return t.tooMany;
    case 400:
    case 422:
      return error.message.startsWith('HTTP') ? t.invalid : error.message;
    default:
      return error.status >= 500 ? t.server : t.unexpected;
  }
};
