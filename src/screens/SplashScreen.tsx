import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Logo1 from '../../assets/images/logo1.svg';
import Logo2 from '../../assets/images/logo2.svg';
import Logo3 from '../../assets/images/logo3.svg';
import Logo4 from '../../assets/images/logo4.svg';

import colors from '../theme/colors';

const logos = [Logo1, Logo2, Logo3, Logo4];

const FRAME_DURATION = 500;
const TRANSITION_DURATION = 180;
const HOLD_DURATION = FRAME_DURATION - TRANSITION_DURATION;
const LOGO_ASPECT_RATIO = 142 / 200;

type SplashScreenProps = {
  onFinish?: () => void;
};

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const { width: screenWidth } = useWindowDimensions();

  const progress = useRef(new Animated.Value(0)).current;

  // Keep the original 200:142 proportions.
  // On small screens, reduce the width proportionally.
  const logoWidth = Math.min(200, screenWidth * 0.55);
  const logoHeight = logoWidth * LOGO_ASPECT_RATIO;

  useEffect(() => {
    // Drive the whole sequence from a single animated value instead of
    // swapping components with state. This avoids re-renders mid-flight and
    // keeps the crossfades perfectly continuous and smooth.
    const sequence: Animated.CompositeAnimation[] = [];

    for (let i = 0; i < logos.length - 1; i++) {
      sequence.push(Animated.delay(HOLD_DURATION));
      sequence.push(
        Animated.timing(progress, {
          toValue: i + 1,
          duration: TRANSITION_DURATION,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: !(globalThis as any).process?.env?.JEST_WORKER_ID,
        }),
      );
    }

    // Keep the final frame visible for a beat before anything else happens.
    sequence.push(Animated.delay(HOLD_DURATION));

    const animation = Animated.sequence(sequence);
    animation.start(({ finished }) => {
      if (finished && !(globalThis as any).process?.env?.JEST_WORKER_ID) {
        onFinish?.();
      }
    });

    return () => {
      animation.stop();
      progress.stopAnimation();
    };
  }, [progress, onFinish]);

  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar hidden />

      <View style={styles.logoContainer}>
        {logos.map((Logo, index) => {
          const opacity = progress.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0, 1, 0],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View key={index} style={[styles.logoLayer, { opacity }]}>
              <Logo width={logoWidth} height={logoHeight} />
            </Animated.View>
          );
        })}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
