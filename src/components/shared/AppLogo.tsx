//=================================================updated code for logo color=========================================//
import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import AnimatedAppLogo from './AnimatedAppLogo';
import { scale } from '../../utils/responsive';

interface AppLogoProps {
  width?: number;
  height?: number;
  animated?: boolean;
  colorScheme?: 'white' | 'gradient';
  onAnimationFinish?: () => void;
}

export default function AppLogo({
  width,
  height,
  animated = false,
  colorScheme = 'gradient',
  onAnimationFinish,
}: AppLogoProps) {
  const targetWidth = width ?? scale(160);

  if (animated) {
    return (
      <AnimatedAppLogo
        width={targetWidth}
        height={height}
        colorScheme={colorScheme}
        onFinish={onAnimationFinish}
      />
    );
  }

  const calculatedHeight = height || (targetWidth * 126) / 200;
  const fillColor = colorScheme === 'white' ? '#FFFFFF' : 'url(#logoGradient)';

  return (
    <Svg
      width={targetWidth}
      height={calculatedHeight}
      viewBox="0 0 200 126"
      fill="none"
      style={styles.svg}
    >
      <Path
        d="M75.9719 30.8203L54.4555 70.3935L26.0574 122.89C25.3707 124.159 24.2275 125.751 22.6972 125.751L3.03842 125.765C1.84461 125.765 0.577022 124.491 0.226712 123.651C-0.24344 122.521 0.0699948 121.012 0.687646 119.877L19.3324 85.7254L60.1849 10.2978C63.3009 4.53973 67.8964 0.567181 74.3817 0.0550408C80.4384 -0.424802 87.1634 2.23279 90.2977 8.02781L150.998 120.251C151.643 121.441 151.731 122.443 151.335 123.573C151.044 124.403 149.827 125.709 148.721 125.714L129.772 125.765C128.712 125.765 126.85 125.308 126.287 124.26L99.4841 74.3614L75.9673 30.8203H75.9719Z"
        fill={fillColor}
      />
      <Path
        d="M94.3494 102.072L68.0439 118.664C66.9238 119.37 65.0202 119.047 64.1398 118.47C63.052 117.755 62.3053 116.449 62.3053 114.973V81.8036C62.3099 80.2395 63.3193 78.8323 64.4302 78.2187C65.6655 77.5358 67.3387 77.4528 68.6385 78.2694L94.4001 94.4826C95.9027 95.4284 96.843 96.5311 96.843 98.1829C96.843 99.95 96.0226 101.016 94.3494 102.072Z"
        fill={fillColor}
      />
      <Path
        d="M195.04 87.8801L146.827 87.917C143.646 87.917 141.692 84.2952 141.839 81.6699C141.992 78.9938 144.057 75.7687 147.205 75.7687H194.501C197.631 75.7641 199.719 78.6985 199.972 81.2961C200.235 83.986 198.622 87.8801 195.04 87.8801Z"
        fill={fillColor}
      />
      <Path
        d="M173.957 50.5401C177.327 50.5401 179.272 53.8713 179.355 56.5427C179.438 59.2142 177.29 62.7069 174.04 62.7069L133.718 62.7576C130.542 62.7576 128.32 59.6341 128.186 56.8842C128.053 54.1343 130.095 50.5632 133.303 50.5632L173.957 50.5401Z"
        fill={fillColor}
      />
      <Path
        d="M174.98 112.993L160.286 112.929C157.184 112.915 155.345 109.432 155.455 106.774C155.566 104.116 157.741 100.951 160.779 100.956L174.317 100.984C177.128 100.988 179.166 103.973 179.355 106.368C179.59 109.33 178.078 111.895 174.976 112.993H174.98Z"
        fill={fillColor}
      />
      {colorScheme === 'gradient' && (
        <Defs>
          <LinearGradient
            id="logoGradient"
            x1="-28.9583"
            y1="125.765"
            x2="195.49"
            y2="121.503"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0" stopColor="#0265FB" />
            <Stop offset="1" stopColor="#B43AFC" />
          </LinearGradient>
        </Defs>
      )}
    </Svg>
  );
}

const styles = StyleSheet.create({
  svg: {
    backgroundColor: 'transparent',
  },
});
