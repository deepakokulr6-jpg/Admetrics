import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getClinicRegistrations,
  saveClinicRegistration,
} from '../../services/clinicService';
import type {
  ClinicRegistrationDraft,
  ClinicRegistrationRecord,
} from '../../types/clinic';
import { signOut } from './authSlice';

/**
 * Registered clinics for the signed-in account. Not persisted: the service
 * (the future API) is the source of truth and is re-read on focus.
 */
type ClinicsState = {
  items: ClinicRegistrationRecord[];
  status: 'idle' | 'loading' | 'loaded' | 'failed';
};

const initialState: ClinicsState = { items: [], status: 'idle' };

export const fetchClinics = createAsyncThunk(
  'clinics/fetch',
  (ownerEmail: string) => getClinicRegistrations(ownerEmail),
);

export const registerClinic = createAsyncThunk(
  'clinics/register',
  ({ owner, draft }: { owner: string; draft: ClinicRegistrationDraft }) =>
    saveClinicRegistration(owner, draft),
);

const clinicsSlice = createSlice({
  name: 'clinics',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchClinics.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchClinics.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'loaded';
      })
      .addCase(fetchClinics.rejected, state => {
        // Keep the last list so the screen doesn't flash empty.
        state.status = 'failed';
      })
      .addCase(registerClinic.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(signOut.fulfilled, () => initialState);
  },
});

export default clinicsSlice.reducer;
