import { Linking, Platform } from 'react-native';
import * as Keychain from 'react-native-keychain';

import strings from '../constants/strings';

/**
 * Biometric app lock (Face ID / Touch ID / Fingerprint / Face unlock).
 *
 * "On" = a small Keychain / Keystore item that can only be read after a
 * biometric check. Reading it shows the system prompt, so unlocking uses
 * the OS's own secure check, and the item is wiped automatically if the
 * phone's enrolled fingers / face change (BIOMETRY_CURRENT_SET).
 */
const SERVICE = 'admetrics.biometricLock';

export type BiometryKind = 'faceId' | 'touchId' | 'fingerprint' | 'face';

export type Biometry = {
  kind: BiometryKind;
  /** User-facing name, e.g. "Face ID" or "Fingerprint". */
  label: string;
};

const LABELS: Record<BiometryKind, string> = {
  faceId: strings.biometrics.faceId,
  touchId: strings.biometrics.touchId,
  fingerprint: strings.biometrics.fingerprint,
  face: strings.biometrics.faceUnlock,
};

/**
 * What this phone supports and has set up, or null (no sensor, or nothing
 * enrolled) — in which case the option is hidden.
 */
export const getBiometry = async (): Promise<Biometry | null> => {
  try {
    const type = await Keychain.getSupportedBiometryType();
    const kind: BiometryKind | null =
      type === Keychain.BIOMETRY_TYPE.FACE_ID
        ? 'faceId'
        : type === Keychain.BIOMETRY_TYPE.TOUCH_ID
        ? 'touchId'
        : type === Keychain.BIOMETRY_TYPE.FINGERPRINT
        ? 'fingerprint'
        : type === Keychain.BIOMETRY_TYPE.FACE ||
          type === Keychain.BIOMETRY_TYPE.IRIS
        ? 'face'
        : null;
    return kind ? { kind, label: LABELS[kind] } : null;
  } catch {
    return null;
  }
};

/** Whether the lock is on (never shows a prompt). */
export const isBiometricEnabled = async () => {
  try {
    return await Keychain.hasGenericPassword({ service: SERVICE });
  } catch {
    return false;
  }
};

/** Shows the system biometric prompt. Resolves false if cancelled / failed. */
export const authenticate = async (reason: string): Promise<boolean> => {
  try {
    const result = await Keychain.getGenericPassword({
      service: SERVICE,
      authenticationPrompt: {
        title: reason,
        cancel: strings.biometrics.cancel,
      },
    });
    return result !== false;
  } catch {
    return false;
  }
};

/**
 * Turns the lock on after a successful biometric check, so only the phone's
 * owner can enable it. Resolves false if the check is cancelled.
 */
export const enableBiometric = async (biometry: Biometry) => {
  try {
    await Keychain.setGenericPassword('admetrics', 'unlock', {
      service: SERVICE,
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
      accessible: Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
      // Android: biometric-bound key; saving it already shows the prompt.
      storage: Keychain.STORAGE_TYPE.AES_GCM,
      authenticationPrompt: {
        title: strings.biometrics.enablePrompt(biometry.label),
        cancel: strings.biometrics.cancel,
      },
    });
  } catch {
    return false;
  }
  if (Platform.OS !== 'ios') {
    return true;
  }
  // iOS doesn't prompt when saving, so check once now.
  const ok = await authenticate(
    strings.biometrics.enablePrompt(biometry.label),
  );
  if (!ok) {
    await disableBiometric();
  }
  return ok;
};

export const disableBiometric = async () => {
  try {
    await Keychain.resetGenericPassword({ service: SERVICE });
  } catch {
    // Nothing stored → already off.
  }
};

/**
 * Opens the phone's settings so the user can enrol a face / fingerprint.
 * Android goes straight to biometric enrolment where supported; iOS only
 * allows opening this app's page in Settings.
 */
export const openBiometricSetup = async () => {
  if (Platform.OS === 'android') {
    for (const action of [
      'android.settings.BIOMETRIC_ENROLL',
      'android.settings.FINGERPRINT_ENROLL',
      'android.settings.SECURITY_SETTINGS',
    ]) {
      try {
        await Linking.sendIntent(action);
        return;
      } catch {
        // Not available on this Android version → try the next one.
      }
    }
  }
  await Linking.openSettings();
};
