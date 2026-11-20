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
import { AppAlertHost } from './src/components/shared/AppAlert';
import { BottomSheetProvider } from '@swmansion/react-native-bottom-sheet';
import { statusBarStyle, useColorScheme } from './src/theme/appearance';
import { lockFontScaling } from './src/utils/lockFontScaling';

lockFontScaling();

export default function App() {
  useColorScheme(); // re-render the status bar on a theme switch
  // Restore the Keychain session once on launch (splash stays up meanwhile).
  useEffect(() => {
    store.dispatch(bootstrapAuth());
  }, []);

  return (
    <Provider store={store}>
      {/* Waits for the saved registration draft before rendering screens. */}
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics ?? undefined}>
          <StatusBar barStyle={statusBarStyle()} />
          {/* Bottom sheets render here, inside the app window, so the
              iOS keyboard shows above them. */}
          <BottomSheetProvider>
            <RootNavigator />
            {/* Themed alerts (appAlert) above every screen. */}
            <AppAlertHost />
          </BottomSheetProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
