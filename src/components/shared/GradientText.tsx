import React from 'react';
import { Text, TextStyle } from 'react-native';
import colors from '../../theme/colors';

type GradientTextProps = {
  children: string;
  style: TextStyle;
};

// Link / highlight text in the solid brand blue (Figma #1D5FFB).
// Name kept so existing callers don't change.
const GradientText: React.FC<GradientTextProps> = ({ children, style }) => (
  <Text style={[style, { color: colors.buttonPrimary }]}>{children}</Text>
);

export default GradientText;
