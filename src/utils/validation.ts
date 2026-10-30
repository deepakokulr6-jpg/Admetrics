/**
 * Small, dependency-free validation helpers shared by the auth and clinic
 * registration flows.
 */

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Indian mobile numbers, optionally prefixed with +91 / 0. */
export const MOBILE_PATTERN = /^(?:\+91[-\s]?|0)?[6-9]\d{9}$/;

export const PINCODE_PATTERN = /^\d{6}$/;
export const YEAR_PATTERN = /^(18|19|20)\d{2}$/;
export const GST_PATTERN =
  /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/i;
export const PAN_PATTERN = /^[A-Z]{5}\d{4}[A-Z]$/i;
export const TIME_PATTERN = /^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i;

export const isValidEmail = (value: string): boolean =>
  EMAIL_PATTERN.test(value.trim());

export const isValidMobile = (value: string): boolean =>
  MOBILE_PATTERN.test(value.replace(/\s/g, ''));

export const isValidPincode = (value: string): boolean =>
  PINCODE_PATTERN.test(value.trim());

export const isValidYear = (value: string): boolean => {
  const trimmed = value.trim();

  if (!YEAR_PATTERN.test(trimmed)) {
    return false;
  }

  const year = Number(trimmed);
  const currentYear = new Date().getFullYear();

  return year >= 1800 && year <= currentYear;
};

export const isValidTime = (value: string): boolean =>
  TIME_PATTERN.test(value.trim());

export const isBlank = (value: string): boolean => value.trim().length === 0;
