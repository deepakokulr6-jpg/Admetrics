import { TextStyle } from 'react-native';
import colors from './colors';
import { normalizeFont } from '../utils/responsive';

/** The app font (bundled Inter files, see utils/applyAppFont). */
export const FONT_FAMILY = 'Inter';

/** Inter weights bundled with the app. */
export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export type FontWeightName = keyof typeof fontWeights;

const font = (
  size: number,
  weight: FontWeightName,
  color: string = colors.text,
  lineHeight?: number,
): TextStyle => ({
  fontFamily: FONT_FAMILY,
  fontSize: normalizeFont(size),
  fontWeight: fontWeights[weight],
  color,
  ...(lineHeight ? { lineHeight: normalizeFont(lineHeight) } : null),
});

/**
 * Text styles used in the Figma design. Pick one with
 * <AppText variant="label">…</AppText>.
 */
export const textVariants = {
  /** 20 bold – auth screen titles ("Welcome Back!") */
  title: font(20, 'bold', colors.text, 24),
  /** 18 bold – user name in the home header, success sheet title */
  headline: font(18, 'bold', colors.textStrong),
  /** 16 bold – amounts on statement cards */
  amount: font(16, 'bold'),
  /** 16 semibold – form section headings ("Clinic Information") */
  heading: font(16, 'semibold', colors.text, 19),
  /** 14 bold – screen header title ("Register Your Clinic") */
  headerTitle: font(14, 'bold', colors.textStrong),
  /** 14 semibold – card titles, values, list titles */
  subtitle: font(14, 'semibold'),
  /** 14 regular – body copy, subtitles */
  body: font(14, 'regular'),
  /** 14 bold – button text */
  button: font(14, 'bold', colors.white),
  /** 12 medium – step labels, statuses */
  labelMedium: font(12, 'medium'),
  /** 12 regular – field labels, secondary details */
  label: font(12, 'regular'),
  /** 12 regular grey – card details */
  caption: font(12, 'regular', colors.secondaryText),
  /** 10 regular – bottom navigation labels */
  tiny: font(10, 'regular', colors.mutedText),
} satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof textVariants;

/** Build a one-off style: typography.make(13, 'medium', '#444'). */
export const typography = {
  ...textVariants,
  make: font,
};

export default typography;
