import { StyleSheet, Text, TextInput } from 'react-native';
import { fonts, FontName } from '../theme/typography';

const WEIGHT_TO_FONT: Record<string, FontName> = {
  '100': 'regular',
  '200': 'regular',
  '300': 'regular',
  '400': 'regular',
  normal: 'regular',
  '500': 'medium',
  '600': 'semibold',
  '700': 'bold',
  '800': 'bold',
  '900': 'bold',
  bold: 'bold',
};

const withFont = (style: any) => {
  if (
    !style ||
    typeof style !== 'object' ||
    style.fontFamily ||
    (style.fontSize == null && style.fontWeight == null)
  ) {
    return style;
  }

  const { fontWeight, ...rest } = style;
  const name = WEIGHT_TO_FONT[String(fontWeight ?? '400')] ?? 'regular';
  return { ...rest, fontFamily: fonts[name] };
};

/**
 * Safety net so every text renders in Inter.
 *
 * Styles should pick a font with `fontFamily: fonts.medium` (see
 * theme/typography). Any StyleSheet text style that has no fontFamily yet
 * gets Inter-Regular, and a leftover `fontWeight` is turned into the matching
 * Inter file (500 → Inter-Medium …) so Android never fakes bold.
 *
 * Must run before any screen module is imported (see index.js).
 */
export function applyAppFont() {
  const create = StyleSheet.create;
  (StyleSheet as any).create = (styles: Record<string, any>) => {
    const patched: Record<string, any> = {};
    Object.keys(styles).forEach(key => {
      patched[key] = withFont(styles[key]);
    });
    return create(patched);
  };

  // Unstyled <Text> / <TextInput> still default to Inter-Regular.
  [Text, TextInput].forEach(Component => {
    const C = Component as any;
    C.defaultProps = C.defaultProps ?? {};
    C.defaultProps.style = [
      { fontFamily: fonts.regular },
      C.defaultProps.style,
    ];
  });
}

export default applyAppFont;
