/**
 * App colour palette – taken from the Figma design (Admetrics › clinic).
 * Always use these keys (colors.text, colors.primary, …), never raw hex
 * values in components.
 */
const lightColors = {
  // Always white / black in both themes: text and icons on blue, gradient
  // or dark banners, and shadows.
  onAccent: '#FFFFFF',
  shadow: '#000000',

  // Brand
  primary: '#0265FB',
  secondary: '#B43AFC',
  gradientStart: '#0265FB',
  gradientEnd: '#B43AFC',
  /** Solid blue for buttons and text links (Figma "Sign In"). */
  buttonPrimary: '#1D5FFB',
  /** Step badges along the brand gradient (Clinic → Contact → Photos). */
  stepBlue: '#1D5FFB',
  stepViolet: '#644EFB',
  stepPurple: '#8B47FC',
  stepTick: '#ECEFF1',

  // Text
  text: '#221E25',
  textStrong: '#111111',
  textDark: '#121212',
  black: '#000000',
  secondaryText: '#565656',
  bodyText: '#444444',
  mutedText: '#787878',
  placeholder: '#AAAAAA',

  // Surfaces
  white: '#FFFFFF',
  background: '#F5F3EF',
  cardBackground: '#FFFFFF',
  surfaceMuted: '#F3F4F6',
  disabled: '#EEEEEE',
  disabledButton: '#D9D9D9',
  switchTrack: '#E5E5E5',

  // Borders & dividers
  border: '#AAAAAA',
  borderLight: '#DDDDDD',
  divider: '#EAEAEA',

  // Status
  red: '#FF2A2A',
  green: '#14AB00',
  success: '#14AB00',
  pending: '#F25C5C',
  successBackground: '#DDF0D9',
  successTint: '#DDEFDA',
  errorBackground: '#F6DADA',
  errorTint: '#F4DBDB',
  star: '#F5BE0B',

  // Support "Need immediate assistance?" banner
  slate: '#4C5263',
  slateText: '#C9CCD3',

  // Placeholder tiles shown before a clinic photo loads
  photoPlaceholder1: '#B8C8D4',
  photoPlaceholder2: '#C8C3B8',

  // Translucent
  overlay: 'rgba(0, 0, 0, 0.05)',
  backdrop: 'rgba(0, 0, 0, 0.4)',
  signatureOverlay: 'rgba(0, 0, 0, 0.78)',
  transparent: 'transparent',
  whiteTranslucent: 'rgba(255, 255, 255, 0.3)',
};

export type ColorName = keyof typeof lightColors;
export type Palette = Record<ColorName, string>;

/**
 * Dark theme: only the tokens that change. Brand, status and on-accent
 * colours stay the same. `white` is the card / surface colour and `black`
 * the strongest text, so they swap roles here.
 */
export const darkOverrides: Partial<Palette> = {
  text: '#ECE9F0',
  textStrong: '#F4F3F6',
  textDark: '#F0EEF2',
  black: '#FFFFFF',
  secondaryText: '#B4AFBA',
  bodyText: '#CFCAD4',
  mutedText: '#948E9B',
  placeholder: '#77727D',

  white: '#1D1B21',
  background: '#121115',
  cardBackground: '#1D1B21',
  surfaceMuted: '#27252C',
  disabled: '#2C2A31',
  disabledButton: '#3B3940',
  switchTrack: '#3B3940',

  border: '#4A4751',
  borderLight: '#302E35',
  divider: '#2A282F',

  successBackground: '#1E3A1C',
  successTint: '#1E3A1C',
  errorBackground: '#4A2226',
  errorTint: '#4A2226',

  photoPlaceholder1: '#36434D',
  photoPlaceholder2: '#45413A',
  overlay: 'rgba(255, 255, 255, 0.06)',
  backdrop: 'rgba(0, 0, 0, 0.6)',
};

/**
 * The live palette. Filled with the chosen theme at launch (index.js) before
 * any screen's StyleSheet is created, so `colors.x` is correct everywhere.
 */
const colors: Palette = { ...lightColors };

let paletteVersion = 0;
/** Bumped on every palette change; themed styles rebuild when it moves. */
export const getPaletteVersion = () => paletteVersion;

export const applyPalette = (scheme: 'light' | 'dark') => {
  paletteVersion += 1;
  Object.assign(colors, lightColors, scheme === 'dark' ? darkOverrides : {});
};

export default colors;
