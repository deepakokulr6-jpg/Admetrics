import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  type ClinicInfo,
  type ClinicPhotos,
  type ClinicRegistrationDraft,
  createEmptyDraft,
  type PersonalInfo,
  type WorkingHour,
} from '../../types/clinic';

/**
 * In-progress clinic registration, one draft per account (keyed by the
 * normalised email) so switching accounts never mixes drafts.
 * Persisted by redux-persist, so a half-finished registration survives an
 * app restart.
 */
type ClinicDraftState = {
  byOwner: Record<string, ClinicRegistrationDraft>;
};

const initialState: ClinicDraftState = { byOwner: {} };

type OwnerPayload<T> = PayloadAction<{ owner: string } & T>;

export const ownerKey = (email: string) => email.trim().toLowerCase();

/** Draft for `owner`, created on first write. */
const draftFor = (state: ClinicDraftState, owner: string) => {
  const key = ownerKey(owner);
  if (!state.byOwner[key]) {
    state.byOwner[key] = createEmptyDraft();
  }
  return state.byOwner[key];
};

const clinicDraftSlice = createSlice({
  name: 'clinicDraft',
  initialState,
  reducers: {
    updateClinicInfo(
      state,
      { payload }: OwnerPayload<{ patch: Partial<ClinicInfo> }>,
    ) {
      Object.assign(draftFor(state, payload.owner).clinic, payload.patch);
    },
    updatePersonalInfo(
      state,
      { payload }: OwnerPayload<{ patch: Partial<PersonalInfo> }>,
    ) {
      Object.assign(draftFor(state, payload.owner).personal, payload.patch);
    },
    updateWorkingHour(
      state,
      { payload }: OwnerPayload<{ index: number; patch: Partial<WorkingHour> }>,
    ) {
      const hour = draftFor(state, payload.owner).workingHours[payload.index];
      if (hour) {
        Object.assign(hour, payload.patch);
      }
    },
    setPhoto(
      state,
      {
        payload,
      }: OwnerPayload<{ slot: keyof ClinicPhotos; uri: string | null }>,
    ) {
      draftFor(state, payload.owner).photos[payload.slot] = payload.uri;
    },
    setSignature(
      state,
      { payload }: OwnerPayload<{ signature: string | null }>,
    ) {
      draftFor(state, payload.owner).signature = payload.signature;
    },
    resetDraft(state, { payload }: OwnerPayload<{}>) {
      delete state.byOwner[ownerKey(payload.owner)];
    },
  },
});

export const clinicDraftActions = clinicDraftSlice.actions;
export default clinicDraftSlice.reducer;
