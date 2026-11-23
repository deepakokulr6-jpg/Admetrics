import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import {
  type AuthUser,
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

export const signOut = createAsyncThunk('auth/signOut', () => logout());

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Login (password + authenticator code) finished; session saved. */
    sessionStarted(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isBootstrapping = false;
      })
      .addCase(signOut.fulfilled, state => {
        state.user = null;
      });
  },
});

export const { sessionStarted } = authSlice.actions;
export default authSlice.reducer;
