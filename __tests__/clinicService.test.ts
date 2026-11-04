import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  clearClinicDraft,
  getClinicDraft,
  getClinicRegistrations,
  saveClinicDraft,
  saveClinicRegistration,
} from '../src/services/clinicService';
import { ClinicRegistrationDraft, createEmptyDraft } from '../src/types/clinic';

const createDraft = (): ClinicRegistrationDraft => {
  const draft = createEmptyDraft();

  draft.clinic.clinicName = 'Admetrics Clinic';
  draft.clinic.city = 'Bengaluru';
  draft.personal.contactPerson = 'Dr Rao';
  draft.personal.designation = 'Doctor';
  draft.personal.mobile = '9876543210';
  draft.personal.email = 'doctor@example.com';
  draft.photos.entrance = 'file:///entrance.jpg';
  draft.photos.reception = 'file:///reception.jpg';

  return draft;
};

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

test('stores a completed registration for its owner', async () => {
  const record = await saveClinicRegistration(
    'Owner@Example.com',
    createDraft(),
  );

  expect(record.ownerEmail).toBe('owner@example.com');

  const ownerRecords = await getClinicRegistrations('owner@example.com');

  expect(ownerRecords).toHaveLength(1);
  expect(ownerRecords[0].clinic.clinicName).toBe('Admetrics Clinic');
  expect(ownerRecords[0].personal.contactPerson).toBe('Dr Rao');
  expect(ownerRecords[0].photos.entrance).toBe('file:///entrance.jpg');
  expect(ownerRecords[0].photos.reception).toBe('file:///reception.jpg');

  expect(await getClinicRegistrations('other@example.com')).toHaveLength(0);
});

test('keeps an in-progress draft per account and clears it on reset', async () => {
  await saveClinicDraft('Owner@Example.com', createDraft());

  const restored = await getClinicDraft('owner@example.com');

  expect(restored?.clinic.clinicName).toBe('Admetrics Clinic');
  expect(restored?.personal.email).toBe('doctor@example.com');
  expect(await getClinicDraft('other@example.com')).toBeNull();

  await clearClinicDraft('owner@example.com');

  expect(await getClinicDraft('owner@example.com')).toBeNull();
});
