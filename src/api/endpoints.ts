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
    forgotPassword: '/auth/forgot-password',
    forgotPasswordVerifyOtp: '/auth/forgot-password/verify-otp',
    resetPassword: '/auth/reset-password',
    changePassword: '/auth/change-password',
    mfa: {
      setup: '/auth/mfa/setup',
      confirm: '/auth/mfa/confirm',
      verify: '/auth/mfa/verify',
      enroll: '/auth/mfa/enroll',
      disable: '/auth/mfa/disable',
    },
  },
  /**
   * MOU for a clinic. Paths as proposed to the backend: confirm with the
   * final Postman collection before use.
   */
  mou: {
    get: (clinicId: string) => `/clinics/${clinicId}/mou`,
    sign: (clinicId: string) => `/clinics/${clinicId}/mou/sign`,
    document: (clinicId: string) => `/clinics/${clinicId}/mou/document`,
  },
} as const;
