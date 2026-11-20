import strings from '../constants/strings';

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

/** Person names: letters (any language), spaces and . ' - */
export const NAME_PATTERN = /^[\p{L}][\p{L} .'-]*[\p{L}.]$/u;

/** Drops anything a name can't contain and collapses repeated spaces. */
export const sanitizeName = (value: string): string =>
  value
    .replace(/[^\p{L} .'-]/gu, '')
    .replace(/\s{2,}/g, ' ')
    .trimStart();

export const isValidName = (value: string): boolean =>
  NAME_PATTERN.test(value.trim());

export const isBlank = (value: string): boolean => value.trim().length === 0;

/**
 * "Too short / too long" message for a field, or undefined when its trimmed
 * length is within `limit`. Blank is the caller's "required" check.
 */
export const lengthError = (
  value: string,
  limit: { min: number; max: number },
): string | undefined => {
  const length = value.trim().length;
  if (length === 0) {
    return undefined;
  }
  if (length < limit.min) {
    return strings.validation.tooShort(limit.min);
  }
  if (length > limit.max) {
    return strings.validation.tooLong(limit.max);
  }
  return undefined;
};

/** Indian bank account numbers: 9–18 digits. */
export const ACCOUNT_NUMBER_PATTERN = /^\d{9,18}$/;
/** IFSC: 4 bank letters, a 0, then 6 branch letters/digits (e.g. CNRB0003241). */
export const IFSC_PATTERN = /^[A-Z]{4}0[A-Z0-9]{6}$/;

export const isValidAccountNumber = (value: string): boolean =>
  ACCOUNT_NUMBER_PATTERN.test(value);
export const isValidIfsc = (value: string): boolean =>
  IFSC_PATTERN.test(value.trim().toUpperCase());

/** "823423422321" → "8234 2342 2321" for display. */
export const groupDigits = (value: string): string =>
  value.replace(/(\d{4})(?=\d)/g, '$1 ');
