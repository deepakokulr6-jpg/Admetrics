import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import {
  type Biometry,
  getBiometry,
  isBiometricEnabled,
} from '../services/biometricService';

/** Re-lock after the app has been in the background this long. */
const RELOCK_AFTER_MS = 60 * 1000;

/**
 * Biometric app lock, as in banking apps: when it is on, the app is locked
 * on launch (restored session) and after a minute in the background.
 * A fresh password login never locks.
 */
export const useAppLock = (signedIn: boolean, sessionRestored: boolean) => {
  const [lock, setLock] = useState<Biometry | null>(null);
  const backgroundedAt = useRef<number | null>(null);
  const checkedLaunch = useRef(false);

  const lockIfEnabled = useCallback(async () => {
    const [biometry, enabled] = await Promise.all([
      getBiometry(),
      isBiometricEnabled(),
    ]);
    if (biometry && enabled) {
      setLock(biometry);
    }
  }, []);

  // Launch: lock once when a saved session is restored.
  useEffect(() => {
    if (sessionRestored && !checkedLaunch.current) {
      checkedLaunch.current = true;
      if (signedIn) {
        lockIfEnabled();
      }
    }
  }, [sessionRestored, signedIn, lockIfEnabled]);

  // Back from the background after a while → lock again.
  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state === 'background') {
        backgroundedAt.current = Date.now();
      } else if (state === 'active' && backgroundedAt.current) {
        const away = Date.now() - backgroundedAt.current;
        backgroundedAt.current = null;
        if (signedIn && away >= RELOCK_AFTER_MS) {
          lockIfEnabled();
        }
      }
    });
    return () => sub.remove();
  }, [signedIn, lockIfEnabled]);

  // Signing out always clears the lock.
  useEffect(() => {
    if (!signedIn) {
      setLock(null);
    }
  }, [signedIn]);

  return { lock, unlock: useCallback(() => setLock(null), []) };
};

export default useAppLock;
