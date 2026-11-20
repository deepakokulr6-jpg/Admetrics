import { LIMITS } from '../src/constants/fieldLimits';
import { lengthError } from '../src/utils/validation';
import { validateClinic } from '../src/utils/clinicValidation';
import type { ClinicInfo } from '../src/types/clinic';

const validClinic: ClinicInfo = {
  clinicName: 'Sunrise Eye Care Clinic',
  medicalRegistrationNumber: 'KMC54321',
  establishmentYear: '2015',
  licenceNumber: 'KPME2015BLR789',
  gstNumber: '29ABCDE1234F1Z5',
  panNumber: 'ABCDE1234F',
  address: '45, Prestige Meridian',
  street: '100 Feet Road, Indiranagar',
  city: 'Bangalore',
  state: 'Karnataka',
  pincode: '560038',
  latitude: '',
  longitude: '',
};

describe('lengthError', () => {
  it('passes values within the limit and ignores blank', () => {
    expect(lengthError('Clinic', LIMITS.clinicName)).toBeUndefined();
    expect(lengthError('   ', LIMITS.clinicName)).toBeUndefined();
  });

  it('flags too-short and too-long values (trimmed)', () => {
    expect(lengthError(' ab ', LIMITS.clinicName)).toMatch(/at least 3/);
    expect(lengthError('x'.repeat(81), LIMITS.clinicName)).toMatch(/80/);
  });
});

describe('validateClinic limits', () => {
  it('accepts the Karnataka sample clinic', () => {
    expect(validateClinic(validClinic)).toEqual({});
  });

  it('rejects a too-short name, licence and street', () => {
    const errors = validateClinic({
      ...validClinic,
      clinicName: 'AB',
      licenceNumber: 'L1',
      street: 'MG',
    });
    expect(Object.keys(errors).sort()).toEqual([
      'clinicName',
      'licenceNumber',
      'street',
    ]);
  });
});
