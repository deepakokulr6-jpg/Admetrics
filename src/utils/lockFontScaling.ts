import { Text, TextInput } from 'react-native';

/**
 * Locks font scaling across the app to prevent unintended line breaks
 * and UI clipping from system accessibility font scale overrides.
 */
export function lockFontScaling() {
  const TextComponent = Text as any;
  if (TextComponent.defaultProps == null) {
    TextComponent.defaultProps = {};
  }
  TextComponent.defaultProps.allowFontScaling = false;

  const TextInputComponent = TextInput as any;
  if (TextInputComponent.defaultProps == null) {
    TextInputComponent.defaultProps = {};
  }
  TextInputComponent.defaultProps.allowFontScaling = false;
}

export default lockFontScaling;

