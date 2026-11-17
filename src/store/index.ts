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

const rootReducer = combineReducers({ auth, clinicDraft, clinics });

/**
 * Only the registration draft is persisted.
 * - auth: session is in the Keychain (secure), restored by bootstrapAuth.
 * - clinics: always re-read from the service / API.
 */
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['clinicDraft'],
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
