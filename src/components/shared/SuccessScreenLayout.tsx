import React, { useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  View,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import AppText from './AppText';
import GradientButton from './GradientButton';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';

type SuccessScreenLayoutProps = {
  title: string;
  description: string;
  buttonText: string;
  onButtonPress: () => void;
};

// Figma (Frame 37 / Frame 38): a white sheet, 682px tall on an 800px frame,
// with 40px top corners over the brand gradient. Check 80px, title 18px bold
// #121212, two-line 12px #444 description, standard 160x36 button.
//
// Entrance: the gradient fades in while the sheet glides up from the bottom
// (ease-out, no bounce), then the check pops in. Skipped with Reduce Motion.
const SuccessScreenLayout: React.FC<SuccessScreenLayoutProps> = ({
  title,
  description,
  buttonText,
  onButtonPress,
}) => {
  const { height } = useWindowDimensions();

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetOffset = useRef(new Animated.Value(height)).current;
  const checkScale = useRef(new Animated.Value(0.6)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start on the first frame (no waiting), then jump to the end if the
    // user has Reduce Motion on.
    const entrance = Animated.sequence([
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        // Smooth glide up with a soft landing – no bounce.
        Animated.timing(sheetOffset, {
          toValue: 0,
          duration: 520,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(checkScale, {
          toValue: 1,
          damping: 12,
          stiffness: 220,
          useNativeDriver: true,
        }),
        Animated.timing(checkOpacity, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
      ]),
    ]);
    entrance.start();

    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .then(reduceMotion => {
        if (reduceMotion && !cancelled) {
          entrance.stop();
          backdropOpacity.setValue(1);
          sheetOffset.setValue(0);
          checkScale.setValue(1);
          checkOpacity.setValue(1);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      entrance.stop();
    };
  }, [backdropOpacity, sheetOffset, checkScale, checkOpacity]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: backdropOpacity }]}
      >
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Animated.View
        style={[styles.sheet, { transform: [{ translateY: sheetOffset }] }]}
      >
        <Animated.Image
          source={require('../../../assets/images/figma/success_check.png')}
          style={[
            styles.check,
            { opacity: checkOpacity, transform: [{ scale: checkScale }] },
          ]}
          resizeMode="contain"
        />

        <AppText variant="headline" color="textDark" align="center">
          {title}
        </AppText>
        <AppText
          variant="label"
          color="bodyText"
          align="center"
          style={styles.description}
        >
          {description}
        </AppText>

        <View style={styles.button}>
          <GradientButton title={buttonText} onPress={onButtonPress} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
    // Brand colour underneath, so nothing white flashes before the
    // gradient fades in.
    backgroundColor: colors.primary,
  },
  sheet: {
    height: '85.25%', // 682 / 800
    backgroundColor: colors.white,
    borderTopLeftRadius: scale(40),
    borderTopRightRadius: scale(40),
    alignItems: 'center',
    paddingTop: verticalScale(196),
    paddingHorizontal: scale(16),
  },
  check: {
    width: scale(80),
    height: scale(80),
  },
  description: {
    marginTop: verticalScale(8),
    lineHeight: normalizeFont(18),
  },
  button: {
    marginTop: verticalScale(18),
  },
});

export default SuccessScreenLayout;
