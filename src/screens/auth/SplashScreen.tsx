import React from 'react';
import {
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import AnimatedAppLogo from '../../components/shared/AnimatedAppLogo';
import colors from '../../theme/colors';

type SplashScreenProps = {
  onFinish?: () => void;
};

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const { width: screenWidth } = useWindowDimensions();

  // Keep responsive proportions matching the brand guidelines
  const logoWidth = Math.min(220, screenWidth * 0.6);

  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar hidden />

      <View style={styles.logoContainer}>
        <AnimatedAppLogo
          width={logoWidth}
          colorScheme="white"
          autoPlay={true}
          holdDuration={750}
          onFinish={onFinish}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
