import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { scale } from '../../utils/responsive';

export interface AnimatedAppLogoProps {
  width?: number;
  height?: number;
  colorScheme?: 'white' | 'gradient';
  autoPlay?: boolean;
  loop?: boolean;
  holdDuration?: number;
  onFinish?: () => void;
  style?: ViewStyle;
}

const LOGO_VIEWBOX_WIDTH = 200;
const LOGO_VIEWBOX_HEIGHT = 142;
const LOGO_ASPECT_RATIO = LOGO_VIEWBOX_HEIGHT / LOGO_VIEWBOX_WIDTH;

// Canonical SVG Path definitions from brand vector assets
const PATH_A =
  'M75.9719 38.8203L54.4555 78.3935L26.0574 130.89C25.3707 132.159 24.2275 133.751 22.6972 133.751L3.03842 133.765C1.84461 133.765 0.577022 132.491 0.226712 131.651C-0.24344 130.521 0.0699948 129.012 0.687646 127.877L19.3324 93.7254L60.1849 18.2978C63.3009 12.5397 67.8964 8.56718 74.3817 8.05504C80.4384 7.5752 87.1634 10.2328 90.2977 16.0278L150.998 128.251C151.643 129.441 151.731 130.443 151.335 131.573C151.044 132.403 149.827 133.709 148.721 133.714L129.772 133.765C128.712 133.765 126.85 133.308 126.287 132.26L99.4841 82.3614L75.9673 38.8203H75.9719Z';

const PATH_TRIANGLE =
  'M94.3494 110.072L68.0439 126.664C66.9238 127.37 65.0202 127.047 64.1398 126.47C63.052 125.755 62.3053 124.449 62.3053 122.973V89.8037C62.3099 88.2395 63.3193 86.8323 64.4302 86.2187C65.6655 85.5358 67.3387 85.4528 68.6385 86.2694L94.4001 102.483C95.9027 103.428 96.843 104.531 96.843 106.183C96.843 107.95 96.0226 109.016 94.3494 110.072Z';

const PATH_LINE_TOP =
  'M173.957 58.5401C177.327 58.5401 179.272 61.8713 179.355 64.5427C179.438 67.2142 177.29 70.7069 174.04 70.7069L133.718 70.7576C130.542 70.7576 128.32 67.634 128.186 64.8842C128.053 62.1343 130.095 58.5632 133.303 58.5632L173.957 58.5401Z';

const PATH_LINE_MIDDLE =
  'M195.04 95.8801L146.827 95.917C143.646 95.917 141.692 92.2952 141.839 89.6699C141.992 86.9938 144.057 83.7687 147.205 83.7687H194.501C197.631 83.7641 199.719 86.6985 199.972 89.2961C200.235 91.986 198.622 95.8801 195.04 95.8801Z';

const PATH_LINE_BOTTOM =
  'M174.98 120.993L160.286 120.929C157.184 120.915 155.345 117.432 155.455 114.774C155.566 112.116 157.741 108.951 160.779 108.956L174.317 108.984C177.128 108.988 179.166 111.973 179.355 114.368C179.59 117.33 178.078 119.895 174.976 120.993H174.98Z';

export default function AnimatedAppLogo({
  width,
  height,
  colorScheme = 'white',
  autoPlay = true,
  loop = false,
  holdDuration = 700,
  onFinish,
  style,
}: AnimatedAppLogoProps) {
  const finalWidth = width ?? scale(200);
  // Enforce integer pixel boundaries to eliminate subpixel anti-aliasing fuzziness
  const pixelWidth = Math.round(finalWidth);
  const pixelHeight = Math.round(height || finalWidth * LOGO_ASPECT_RATIO);
  const isJest = Boolean((globalThis as any).process?.env?.JEST_WORKER_ID);

  // Animated Values
  // 1. "A" Chevron + Play Triangle - pure opacity fade-in at native 100% scale
  const aOpacity = useRef(new Animated.Value(0)).current;

  // 2. Top Speed Line (Progress 0 -> 1)
  const line1Progress = useRef(new Animated.Value(0)).current;

  // 3. Middle Speed Line (Progress 0 -> 1)
  const line2Progress = useRef(new Animated.Value(0)).current;

  // 4. Bottom Speed Line (Progress 0 -> 1)
  const line3Progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!autoPlay) return;

    if (isJest) {
      aOpacity.setValue(1);
      line1Progress.setValue(1);
      line2Progress.setValue(1);
      line3Progress.setValue(1);
      onFinish?.();
      return;
    }

    const easeDecel = Easing.bezier(0.16, 1, 0.3, 1);

    const animation = Animated.sequence([
      // Step 1: "A" chevron & triangle fade in cleanly at 100% retina crispness
      Animated.timing(aOpacity, {
        toValue: 1,
        duration: 350,
        easing: easeDecel,
        useNativeDriver: !isJest,
      }),

      // Step 2: Top Line flies in swiftly from right
      Animated.timing(line1Progress, {
        toValue: 1,
        duration: 300,
        easing: easeDecel,
        useNativeDriver: !isJest,
      }),

      // Step 3: Middle Line flies in swiftly from right
      Animated.timing(line2Progress, {
        toValue: 1,
        duration: 320,
        easing: easeDecel,
        useNativeDriver: !isJest,
      }),

      // Step 4: Bottom Line flies in swiftly from right
      Animated.timing(line3Progress, {
        toValue: 1,
        duration: 280,
        easing: easeDecel,
        useNativeDriver: !isJest,
      }),

      // Step 5: Hold completed logo
      Animated.delay(holdDuration),
    ]);

    if (loop) {
      Animated.loop(animation).start();
    } else {
      animation.start(({ finished }) => {
        if (finished && !isJest) {
          onFinish?.();
        }
      });
    }

    return () => {
      animation.stop();
    };
  }, [
    autoPlay,
    loop,
    holdDuration,
    onFinish,
    aOpacity,
    line1Progress,
    line2Progress,
    line3Progress,
    isJest,
  ]);

  // Derived Translations - pure translation keeps vector edges 100% crisp without texture scaling
  const entranceDistance = Math.round(pixelWidth * 1.15);

  const line1TranslateX = line1Progress.interpolate({
    inputRange: [0, 1],
    outputRange: [entranceDistance, 0],
  });
  const line1Opacity = line1Progress.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 1, 1],
  });

  const line2TranslateX = line2Progress.interpolate({
    inputRange: [0, 1],
    outputRange: [Math.round(entranceDistance * 1.25), 0],
  });
  const line2Opacity = line2Progress.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 1, 1],
  });

  const line3TranslateX = line3Progress.interpolate({
    inputRange: [0, 1],
    outputRange: [entranceDistance, 0],
  });
  const line3Opacity = line3Progress.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 1, 1],
  });

  const fillColor = colorScheme === 'gradient' ? 'url(#animLogoGradient)' : '#FFFFFF';

  return (
    <View
      shouldRasterizeIOS={false}
      renderToHardwareTextureAndroid={false}
      style={[
        styles.container,
        { width: pixelWidth, height: pixelHeight },
        style,
      ]}
    >
      {/* Layer 1: "A" Chevron + Play Triangle */}
      <Animated.View
        shouldRasterizeIOS={false}
        renderToHardwareTextureAndroid={false}
        style={[
          StyleSheet.absoluteFill,
          styles.layer,
          { opacity: aOpacity },
        ]}
      >
        <Svg
          width={pixelWidth}
          height={pixelHeight}
          viewBox={`0 0 ${LOGO_VIEWBOX_WIDTH} ${LOGO_VIEWBOX_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          style={styles.svg}
        >
          {colorScheme === 'gradient' && (
            <Defs>
              <LinearGradient
                id="animLogoGradient"
                x1="-21.9465"
                y1="133.765"
                x2="148.182"
                y2="131.317"
                gradientUnits="userSpaceOnUse"
              >
                <Stop offset="0" stopColor="#0265FB" />
                <Stop offset="1" stopColor="#B43AFC" />
              </LinearGradient>
            </Defs>
          )}
          <Path d={PATH_A} fill={fillColor} />
          <Path d={PATH_TRIANGLE} fill={fillColor} />
        </Svg>
      </Animated.View>

      {/* Layer 2: Top Speed Line */}
      <Animated.View
        shouldRasterizeIOS={false}
        renderToHardwareTextureAndroid={false}
        style={[
          StyleSheet.absoluteFill,
          styles.layer,
          {
            opacity: line1Opacity,
            transform: [{ translateX: line1TranslateX }],
          },
        ]}
      >
        <Svg
          width={pixelWidth}
          height={pixelHeight}
          viewBox={`0 0 ${LOGO_VIEWBOX_WIDTH} ${LOGO_VIEWBOX_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          style={styles.svg}
        >
          <Path d={PATH_LINE_TOP} fill={fillColor} />
        </Svg>
      </Animated.View>

      {/* Layer 3: Middle Speed Line */}
      <Animated.View
        shouldRasterizeIOS={false}
        renderToHardwareTextureAndroid={false}
        style={[
          StyleSheet.absoluteFill,
          styles.layer,
          {
            opacity: line2Opacity,
            transform: [{ translateX: line2TranslateX }],
          },
        ]}
      >
        <Svg
          width={pixelWidth}
          height={pixelHeight}
          viewBox={`0 0 ${LOGO_VIEWBOX_WIDTH} ${LOGO_VIEWBOX_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          style={styles.svg}
        >
          <Path d={PATH_LINE_MIDDLE} fill={fillColor} />
        </Svg>
      </Animated.View>

      {/* Layer 4: Bottom Speed Line */}
      <Animated.View
        shouldRasterizeIOS={false}
        renderToHardwareTextureAndroid={false}
        style={[
          StyleSheet.absoluteFill,
          styles.layer,
          {
            opacity: line3Opacity,
            transform: [{ translateX: line3TranslateX }],
          },
        ]}
      >
        <Svg
          width={pixelWidth}
          height={pixelHeight}
          viewBox={`0 0 ${LOGO_VIEWBOX_WIDTH} ${LOGO_VIEWBOX_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          style={styles.svg}
        >
          <Path d={PATH_LINE_BOTTOM} fill={fillColor} />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  layer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  svg: {
    backgroundColor: 'transparent',
  },
});
