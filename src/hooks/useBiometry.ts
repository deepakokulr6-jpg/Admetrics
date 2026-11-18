import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';

import {
  type Biometry,
  disableBiometric,
  enableBiometric,
  getBiometry,
  isBiometricEnabled,
} from '../services/biometricService';

/**
 * The phone's biometric option for Settings: what it is (null while nothing
 * is enrolled), whether the app lock is on, and a toggle that asks for a
 * biometric check before turning it on. Re-checks when the user comes back
 * from the phone's settings, so a newly added face / finger shows up.
 */
export const useBiometry = () => {
  const [biometry, setBiometry] = useState<Biometry | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const [kind, on] = await Promise.all([getBiometry(), isBiometricEnabled()]);
    setBiometry(kind);
    setEnabled(Boolean(kind) && on);
  }, []);

  useEffect(() => {
    refresh();
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        refresh();
      }
    });
    return () => sub.remove();
  }, [refresh]);

  const toggle = useCallback(
    async (next: boolean) => {
      if (!biometry || busy) {
        return;
      }
      setBusy(true);
      if (next) {
        setEnabled(await enableBiometric(biometry));
      } else {
        await disableBiometric();
        setEnabled(false);
      }
      setBusy(false);
    },
    [biometry, busy],
  );

  return { biometry, enabled, busy, toggle };
};

export default useBiometry;
