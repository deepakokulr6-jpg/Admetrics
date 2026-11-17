import strings from '../constants/strings';
import type { ClinicInfo, PersonalInfo } from '../types/clinic';
import {
  GST_PATTERN,
  isBlank,
  isValidEmail,
  isValidMobile,
  isValidName,
  isValidPincode,
  isValidYear,
  PAN_PATTERN,
} from './validation';

export type ClinicErrors = Partial<Record<keyof ClinicInfo, string>>;
export type PersonalErrors = Partial<Record<keyof PersonalInfo, string>>;

/** Clinic step (Register Clinic and Edit Details). */
export const validateClinic = (clinic: ClinicInfo): ClinicErrors => {
  const errors: ClinicErrors = {};

  if (isBlank(clinic.clinicName)) {
    errors.clinicName = strings.clinicForm.clinicNameIsRequired;
  }

  if (isBlank(clinic.medicalRegistrationNumber)) {
    errors.medicalRegistrationNumber =
      strings.clinicForm.medicalRegistrationNumberIsRequired;
  }

  if (
    !isBlank(clinic.establishmentYear) &&
    !isValidYear(clinic.establishmentYear)
  ) {
    errors.establishmentYear = strings.registerClinic.enterAValidFourDigit;
  }

  if (isBlank(clinic.licenceNumber)) {
    errors.licenceNumber =
      strings.registerClinic.registrationLicenceNumberIsRequired;
  }

  if (isBlank(clinic.gstNumber)) {
    errors.gstNumber = strings.registerClinic.gstNumberIsRequired;
  } else if (!GST_PATTERN.test(clinic.gstNumber.trim())) {
    errors.gstNumber = strings.registerClinic.enterAValid15Character;
  }

  if (
    !isBlank(clinic.panNumber) &&
    !PAN_PATTERN.test(clinic.panNumber.trim())
  ) {
    errors.panNumber = strings.registerClinic.enterAValid10Character;
  }

  if (isBlank(clinic.street)) {
    errors.street = strings.registerClinic.streetIsRequired;
  }

  if (isBlank(clinic.pincode)) {
    errors.pincode = strings.registerClinic.pincodeIsRequired;
  } else if (!isValidPincode(clinic.pincode)) {
    errors.pincode = strings.registerClinic.enterAValidSixDigit;
  }

  return errors;
};

/** Contact step. */
export const validatePersonal = (personal: PersonalInfo): PersonalErrors => {
  const errors: PersonalErrors = {};

  if (isBlank(personal.contactPerson)) {
    errors.contactPerson = strings.registerPersonal.contactPersonIsRequired;
  } else if (!isValidName(personal.contactPerson)) {
    errors.contactPerson = strings.registerPersonal.enterAValidName;
  }

  if (!isBlank(personal.mobile) && !isValidMobile(personal.mobile)) {
    errors.mobile = strings.registerPersonal.enterAValid10Digit;
  }

  if (isBlank(personal.email)) {
    errors.email = strings.registerPersonal.emailIdIsRequired;
  } else if (!isValidEmail(personal.email)) {
    errors.email = strings.registerPersonal.enterAValidEmailAddress;
  }

  return errors;
};

/** Removes one field's error (used while the user edits that field). */
export const withoutError = <T extends object>(
  errors: Partial<Record<keyof T, string>>,
  key: keyof T,
) => {
  if (!errors[key]) {
    return errors;
  }
  const next = { ...errors };
  delete next[key];
  return next;
};

export const hasErrors = (errors: object) => Object.keys(errors).length > 0;
