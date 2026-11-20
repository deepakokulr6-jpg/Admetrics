/**
 * Every backend path in one place (relative to ENV.api.baseUrl). Add new
 * APIs here first, then call them from a module in src/api/.
 */
export const ENDPOINTS = {
  auth: {
    signupRequestOtp: '/auth/signup/request-otp',
    signupVerifyOtp: '/auth/signup/verify-otp',
    register: '/auth/register',
    login: '/auth/login',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    mfa: {
      setup: '/auth/mfa/setup',
      confirm: '/auth/mfa/confirm',
      verify: '/auth/mfa/verify',
      enroll: '/auth/mfa/enroll',
      disable: '/auth/mfa/disable',
    },
  },
} as const;
