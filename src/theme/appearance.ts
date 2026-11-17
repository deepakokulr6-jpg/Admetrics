import { useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

import { applyPalette } from './colors';

/** What the user picked in Settings › Appearance. */
export type ThemePreference = 'light' | 'dark' | 'system';
export type ColorScheme = 'light' | 'dark';

const STORAGE_KEY = 'admetrics.themePreference';

let preference: ThemePreference = 'light';
let activeScheme: ColorScheme = 'light';
const listeners = new Set<() => void>();

const resolve = (pref: ThemePreference): ColorScheme =>
  pref === 'system'
    ? Appearance.getColorScheme() === 'dark'
      ? 'dark'
      : 'light'
    : pref;

/** Swaps the palette and tells subscribed roots to re-render. */
const activate = (scheme: ColorScheme) => {
  if (scheme === activeScheme) {
    return;
  }
  activeScheme = scheme;
  applyPalette(scheme);
  listeners.forEach(listener => listener());
};

/**
 * Runs once at launch, before the first render, so the app opens straight
 * in the saved theme (no light flash).
 */
export const initAppearance = async () => {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      preference = saved;
    }
  } catch {
    // Unreadable storage → keep the light default.
  }
  activeScheme = resolve(preference);
  applyPalette(activeScheme);

  // "Device" mode follows the phone's setting while the app is open.
  Appearance.addChangeListener(() => {
    if (preference === 'system') {
      activate(resolve('system'));
    }
  });
};

export const getThemePreference = () => preference;
export const isDarkTheme = () => activeScheme === 'dark';
export const statusBarStyle = () =>
  activeScheme === 'dark' ? 'light-content' : 'dark-content';

/** Saves the choice and switches the palette in place (no reload). */
export const setThemePreference = (next: ThemePreference) => {
  if (next === preference) {
    return;
  }
  preference = next;
  AsyncStorage.setItem(STORAGE_KEY, next).catch(() => undefined);
  activate(resolve(next));
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** Current 'light' | 'dark'; components using it re-render on a switch. */
export const useColorScheme = () =>
  useSyncExternalStore(subscribe, () => activeScheme);
