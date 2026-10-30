import React from 'react';
import { useWindowDimensions } from 'react-native';

import Logo5 from '../../assets/images/logo5.svg';

type Props = {
  width?: number;
  height?: number;
};

const LOGO_ASPECT_RATIO = 142 / 200;

const AppLogo: React.FC<Props> = ({ width, height }) => {
  const { width: screenWidth } = useWindowDimensions();

  // Keep the artwork's natural 200:142 ratio and scale it down on narrow
  // devices instead of stretching the SVG.
  const resolvedWidth = width ?? Math.min(200, screenWidth * 0.52);
  const resolvedHeight =
    height ?? Math.round(resolvedWidth * LOGO_ASPECT_RATIO);

  return (
    <Logo5
      width={resolvedWidth}
      height={resolvedHeight}
      accessibilityLabel="Admetrics logo"
    />
  );
};

export default AppLogo;
