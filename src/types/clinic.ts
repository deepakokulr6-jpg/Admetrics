export type ClinicInfo = {
  clinicName: string;
  medicalRegistrationNumber: string;
  establishmentYear: string;
  licenceNumber: string;
  gstNumber: string;
  panNumber: string;
  address: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
};

export type PersonalInfo = {
  contactPerson: string;
  designation: string;
  mobile: string;
  email: string;
};

export type WorkingHour = {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
};

export type ClinicPhotos = {
  entrance: string | null;
  reception: string | null;
};

export type ClinicRegistrationDraft = {
  clinic: ClinicInfo;
  personal: PersonalInfo;
  workingHours: WorkingHour[];
  photos: ClinicPhotos;
};

export type ClinicRegistrationRecord = ClinicRegistrationDraft & {
  id: string;
  ownerEmail: string;
  createdAt: string;
};

export const WEEK_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export const createEmptyClinicInfo = (): ClinicInfo => ({
  clinicName: '',
  medicalRegistrationNumber: '',
  establishmentYear: '',
  licenceNumber: '',
  gstNumber: '',
  panNumber: '',
  address: '',
  street: '',
  city: '',
  state: '',
  pincode: '',
});

export const createEmptyPersonalInfo = (): PersonalInfo => ({
  contactPerson: '',
  designation: '',
  mobile: '',
  email: '',
});

export const createDefaultWorkingHours = (): WorkingHour[] =>
  WEEK_DAYS.map(day => ({
    day,
    enabled: day !== 'Sunday',
    startTime: day === 'Sunday' ? '' : '09:30AM',
    endTime: day === 'Sunday' ? '' : '09:30PM',
  }));

export const createEmptyPhotos = (): ClinicPhotos => ({
  entrance: null,
  reception: null,
});

export const createEmptyDraft = (): ClinicRegistrationDraft => ({
  clinic: createEmptyClinicInfo(),
  personal: createEmptyPersonalInfo(),
  workingHours: createDefaultWorkingHours(),
  photos: createEmptyPhotos(),
});
