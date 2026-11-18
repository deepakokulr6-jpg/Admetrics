import { combineReducers, configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

import auth from './slices/authSlice';
import clinicDraft from './slices/clinicDraftSlice';
import clinics from './slices/clinicsSlice';
import bankAccount from './slices/bankAccountSlice';

const rootReducer = combineReducers({
  auth,
  clinicDraft,
  clinics,
  bankAccount,
});

/**
 * Persisted: the registration draft and the saved bank account.
 * - auth: session is in the Keychain (secure), restored by bootstrapAuth.
 * - clinics: always re-read from the service / API.
 */
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['clinicDraft', 'bankAccount'],
};

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist's own actions carry functions.
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
