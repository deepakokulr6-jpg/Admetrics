import { StyleSheet, Text, TextInput } from 'react-native';

export const APP_FONT = 'Inter';

const withFont = (style: any) =>
  style &&
  typeof style === 'object' &&
  !style.fontFamily &&
  (style.fontSize != null || style.fontWeight != null)
    ? { ...style, fontFamily: APP_FONT }
    : style;

/**
 * Uses Inter (the Figma font) for all text.
 *
 * A Text defaultProps style is dropped as soon as a component passes its own
 * style, so instead every StyleSheet text style (anything with a fontSize or
 * fontWeight) gets fontFamily: 'Inter' unless it already sets a font.
 * Weights 400/500/600/700 map to the bundled Inter files on both platforms.
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

  // Unstyled <Text> / <TextInput> still default to Inter.
  [Text, TextInput].forEach(Component => {
    const C = Component as any;
    C.defaultProps = C.defaultProps ?? {};
    C.defaultProps.style = [{ fontFamily: APP_FONT }, C.defaultProps.style];
  });
}

export default applyAppFont;
