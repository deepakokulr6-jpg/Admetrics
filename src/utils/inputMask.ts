import { Platform, type KeyboardTypeOptions } from 'react-native';

/**
 * Fixed-format inputs (PAN, GST). Each mask character is one position:
 *   A = letter, 9 = digit, * = letter or digit, anything else = that literal.
 */
export const PAN_MASK = 'AAAAA9999A';
export const GST_MASK = '99AAAAA9999A*Z*';
/** IFSC: 4 bank letters, a fixed 0, 6 branch letters/digits. */
export const IFSC_MASK = 'AAAA0******';

const fits = (char: string, slot: string) => {
  switch (slot) {
    case 'A':
      return /[A-Z]/.test(char);
    case '9':
      return /\d/.test(char);
    case '*':
      return /[A-Z\d]/.test(char);
    default:
      return char === slot;
  }
};

const isLiteral = (slot: string) => !['A', '9', '*'].includes(slot);

/**
 * Upper-cases `raw` and keeps only characters valid for their position;
 * a fixed character (GST's "Z") is filled in when the next one is typed.
 * Paste-safe: "abcde 1234 f" → "ABCDE1234F".
 */
export const applyMask = (raw: string, mask: string): string => {
  let out = '';
  for (const char of raw.toUpperCase()) {
    if (out.length >= mask.length) {
      break;
    }
    // Spaces, dashes etc. never belong anywhere: ignore them.
    if (!/[A-Z\d]/.test(char)) {
      continue;
    }
    const slot = mask[out.length];
    if (fits(char, slot)) {
      out += char;
    } else if (
      isLiteral(slot) &&
      out.length + 1 < mask.length &&
      fits(char, mask[out.length + 1])
    ) {
      // Fixed character left out: fill it in, then place this one after it.
      out += slot + char;
    }
  }
  return out;
};

/** Letters keyboard without emoji on iOS; plain keyboard on Android. */
const LETTERS: KeyboardTypeOptions =
  Platform.OS === 'ios' ? 'ascii-capable' : 'default';

/** Keyboard for the next position: numbers for a digit, letters otherwise. */
export const keyboardForMask = (
  value: string,
  mask: string,
): KeyboardTypeOptions =>
  /[9\d]/.test(mask[value.length] ?? '') ? 'number-pad' : LETTERS;
