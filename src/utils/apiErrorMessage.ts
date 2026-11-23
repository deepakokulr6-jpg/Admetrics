import { ApiError } from '../api/errors';
import { HTTP_STATUS } from '../api/constants';
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
  if (error.isTimeout) {
    return t.timeout;
  }
  if (error.isNetwork) {
    return t.network;
  }
  switch (error.status) {
    case HTTP_STATUS.UNAUTHORIZED:
    case HTTP_STATUS.FORBIDDEN:
      return step === 'otp'
        ? t.badOtp
        : step === 'login'
        ? t.badLogin
        : step === 'mfa'
        ? t.badMfa
        : step === 'password'
        ? t.sessionExpired
        : t.unauthorized;
    case HTTP_STATUS.NOT_FOUND:
      return step === 'otp' ? t.notInvited : t.unexpected;
    case HTTP_STATUS.CONFLICT:
      return t.alreadyRegistered;
    case HTTP_STATUS.GONE:
      return t.sessionExpired;
    case HTTP_STATUS.TOO_MANY_REQUESTS:
      return t.tooMany;
    case HTTP_STATUS.BAD_REQUEST:
    case HTTP_STATUS.UNPROCESSABLE:
      return error.message.startsWith('HTTP') ? t.invalid : error.message;
    default:
      return error.isServer ? t.server : t.unexpected;
  }
};
