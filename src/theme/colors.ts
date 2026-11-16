/**
 * App colour palette – taken from the Figma design (Admetrics › clinic).
 * Always use these keys (colors.text, colors.primary, …), never raw hex
 * values in components.
 */
const colors = {
  // Brand
  primary: '#0265FB',
  secondary: '#B43AFC',
  gradientStart: '#0265FB',
  gradientEnd: '#B43AFC',
  /** Step badges along the brand gradient (Clinic → Contact → Photos). */
  stepBlue: '#1D5FFB',
  stepViolet: '#644EFB',
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
  whiteTranslucent: 'rgba(255, 255, 255, 0.3)',
} as const;

export type ColorName = keyof typeof colors;

export default colors;
