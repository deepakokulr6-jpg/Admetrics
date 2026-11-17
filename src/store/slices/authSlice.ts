import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  type AuthUser,
  login,
  logout,
  restoreSession,
} from '../../services/authService';

/**
 * Signed-in user. Deliberately NOT persisted by redux-persist: the session
 * lives in the Keychain (authService) and is restored on launch by
 * `bootstrapAuth`, so the user never sits in plain AsyncStorage.
 */
type AuthState = {
  user: AuthUser | null;
  /** True until the saved session has been checked on launch. */
  isBootstrapping: boolean;
};

const initialState: AuthState = {
  user: null,
  isBootstrapping: true,
};

export const bootstrapAuth = createAsyncThunk('auth/bootstrap', async () => {
  try {
    return await restoreSession();
  } catch (error) {
    console.warn('[auth] Session restore failed', error);
    return null;
  }
});

export const signIn = createAsyncThunk(
  'auth/signIn',
  ({ email, password }: { email: string; password: string }) =>
    login(email, password),
);

export const signOut = createAsyncThunk('auth/signOut', () => logout());

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isBootstrapping = false;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(signOut.fulfilled, state => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;
