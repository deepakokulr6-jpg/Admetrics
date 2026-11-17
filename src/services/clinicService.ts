import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  ClinicRegistrationDraft,
  ClinicRegistrationRecord,
} from '../types/clinic';

/**
 * TEMPORARY LOCAL CLINIC STORAGE
 * ---------------------------------------------------------------------------
 * There is no backend yet, so completed registrations are kept on the device
 * (in-progress drafts live in the Redux store, persisted by redux-persist). Replace this module with API calls once the clinic
 * endpoint is available.
 */

const CLINICS_KEY = '@admetrics/clinics/v1';

const normalizeOwner = (ownerEmail: string) => ownerEmail.trim().toLowerCase();

const readRecords = async (): Promise<ClinicRegistrationRecord[]> => {
  const raw = await AsyncStorage.getItem(CLINICS_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? (parsed as ClinicRegistrationRecord[]) : [];
  } catch {
    return [];
  }
};

export const saveClinicRegistration = async (
  ownerEmail: string,
  draft: ClinicRegistrationDraft,
): Promise<ClinicRegistrationRecord> => {
  const records = await readRecords();
  const record: ClinicRegistrationRecord = {
    ...draft,
    id: `clinic_${Date.now().toString(36)}_${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    ownerEmail: normalizeOwner(ownerEmail),
    createdAt: new Date().toISOString(),
  };

  await AsyncStorage.setItem(CLINICS_KEY, JSON.stringify([...records, record]));

  return record;
};

export const getClinicRegistrations = async (
  ownerEmail: string,
): Promise<ClinicRegistrationRecord[]> => {
  const records = await readRecords();
  const owner = normalizeOwner(ownerEmail);

  return records.filter(record => record.ownerEmail === owner);
};
