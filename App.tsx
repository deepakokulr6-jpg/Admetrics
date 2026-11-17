import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from './src/store';
import { bootstrapAuth } from './src/store/slices/authSlice';
import RootNavigator from './src/navigation/RootNavigator';
import { lockFontScaling } from './src/utils/lockFontScaling';

lockFontScaling();

export default function App() {
  // Restore the Keychain session once on launch (splash stays up meanwhile).
  useEffect(() => {
    store.dispatch(bootstrapAuth());
  }, []);

  return (
    <Provider store={store}>
      {/* Waits for the saved registration draft before rendering screens. */}
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics ?? undefined}>
          <StatusBar barStyle="dark-content" />
          <RootNavigator />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
