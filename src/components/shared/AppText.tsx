import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

import colors from '../../theme/colors';
import {
  FONT_FAMILY,
  FontWeightName,
  TextVariant,
  fontWeights,
  textVariants,
} from '../../theme/typography';
import { normalizeFont } from '../../utils/responsive';

export type AppTextProps = TextProps & {
  /** A Figma text style – sets size, weight and colour in one go. */
  variant?: TextVariant;
  /** Override the weight: 'regular' | 'medium' | 'semibold' | 'bold'. */
  weight?: FontWeightName;
  /** Override the size (in Figma px; scaled for the screen). */
  size?: number;
  /** Colour value or a key from theme/colors, e.g. "red" or "#FF2A2A". */
  color?: keyof typeof colors | string;
  align?: TextStyle['textAlign'];
};

/**
 * The app's text component. Always renders Inter.
 *
 *   <AppText variant="heading">Clinic Information</AppText>
 *   <AppText variant="label" color="red">*</AppText>
 *   <AppText weight="semibold" size={13}>Custom</AppText>
 *
 * Shorthands: <RegularText>, <MediumText>, <SemiBoldText>, <BoldText>.
 */
const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  weight,
  size,
  color,
  align,
  style,
  ...rest
}) => (
  <Text
    {...rest}
    style={[
      textVariants[variant],
      weight ? { fontWeight: fontWeights[weight] } : null,
      size ? { fontSize: normalizeFont(size) } : null,
      color
        ? { color: (colors as Record<string, string>)[color] ?? color }
        : null,
      align ? { textAlign: align } : null,
      style,
      { fontFamily: FONT_FAMILY },
    ]}
  />
);

type WeightedTextProps = Omit<AppTextProps, 'weight'>;

export const RegularText: React.FC<WeightedTextProps> = props => (
  <AppText {...props} weight="regular" />
);
export const MediumText: React.FC<WeightedTextProps> = props => (
  <AppText {...props} weight="medium" />
);
export const SemiBoldText: React.FC<WeightedTextProps> = props => (
  <AppText {...props} weight="semibold" />
);
export const BoldText: React.FC<WeightedTextProps> = props => (
  <AppText {...props} weight="bold" />
);

export default AppText;
