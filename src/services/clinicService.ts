import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  ClinicRegistrationDraft,
  ClinicRegistrationRecord,
} from '../types/clinic';

/**
 * TEMPORARY LOCAL CLINIC STORAGE
 * ---------------------------------------------------------------------------
 * There is no backend yet, so completed registrations and in-progress drafts
 * are kept on the device. Replace this module with API calls once the clinic
 * endpoint is available.
 */

const CLINICS_KEY = '@admetrics/clinics/v1';
const DRAFTS_KEY = '@admetrics/clinic-drafts/v1';

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

const readDrafts = async (): Promise<
  Record<string, ClinicRegistrationDraft>
> => {
  const raw = await AsyncStorage.getItem(DRAFTS_KEY);

  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);

    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, ClinicRegistrationDraft>)
      : {};
  } catch {
    return {};
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

/**
 * Keeps the values entered on the registration screens so a half-completed
 * registration survives app restarts. Each account has its own draft.
 */
export const saveClinicDraft = async (
  ownerEmail: string,
  draft: ClinicRegistrationDraft,
): Promise<void> => {
  const drafts = await readDrafts();
  drafts[normalizeOwner(ownerEmail)] = draft;

  await AsyncStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
};

export const getClinicDraft = async (
  ownerEmail: string,
): Promise<ClinicRegistrationDraft | null> => {
  const drafts = await readDrafts();

  return drafts[normalizeOwner(ownerEmail)] ?? null;
};

export const clearClinicDraft = async (ownerEmail: string): Promise<void> => {
  const drafts = await readDrafts();
  const owner = normalizeOwner(ownerEmail);

  if (!(owner in drafts)) {
    return;
  }

  delete drafts[owner];

  if (Object.keys(drafts).length === 0) {
    await AsyncStorage.removeItem(DRAFTS_KEY);
    return;
  }

  await AsyncStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
};
