/**
 * Min / max length for every free-text field, in one place. `max` is set on
 * the input (typing stops there); `min` is checked on submit. Fixed-format
 * fields (PAN, GST, IFSC, pincode, mobile, OTP) are checked by their
 * pattern instead.
 */
export type FieldLimit = { min: number; max: number };

export const LIMITS = {
  // Clinic
  clinicName: { min: 3, max: 80 },
  medicalRegistrationNumber: { min: 4, max: 30 },
  licenceNumber: { min: 4, max: 30 },
  address: { min: 5, max: 120 },
  street: { min: 3, max: 100 },
  city: { min: 2, max: 50 },
  // Contact
  contactPerson: { min: 3, max: 50 },
  designation: { min: 2, max: 50 },
  email: { min: 6, max: 254 },
  mobile: { min: 10, max: 15 },
  // Bank
  holderName: { min: 3, max: 60 },
  // Account
  password: { min: 8, max: 64 },
  // Devices & support
  deviceName: { min: 2, max: 40 },
  displayName: { min: 2, max: 40 },
  complaint: { min: 10, max: 1000 },
} as const satisfies Record<string, FieldLimit>;
