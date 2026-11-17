import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';
import { themedStyles } from '../../theme/themedStyles';

interface StepProgressProps {
  currentStep: number;
}

const STEPS = [
  strings.steps.clinic,
  strings.steps.contact,
  strings.steps.photos,
  strings.steps.mou,
];

// Badge colours follow the brand gradient from left to right (Figma).
const DONE_COLORS = [
  colors.stepBlue,
  colors.stepViolet,
  colors.stepPurple,
  colors.secondary,
];
const TICK =
  'M16.4877 9.00069C16.7057 9.21865 16.7057 9.57205 16.4877 9.79001L11.2784 14.9993C11.1738 15.104 11.0318 15.1628 10.8838 15.1628C10.7357 15.1628 10.5938 15.104 10.4891 14.9993L7.51235 12.0225C7.29439 11.8046 7.29439 11.4512 7.51235 11.2333C7.73032 11.0153 8.08371 11.0153 8.30168 11.2333L10.8838 13.8153L15.6984 9.00069C15.9164 8.78272 16.2697 8.78272 16.4877 9.00069Z';

const BADGE = scale(24);
// Figma (4 steps): badge centres at 58 / 140 / 220 / 300 on a 360 frame and
// the bar runs from 65 to 300.
const CENTERS = [58, 140, 220, 300].map(scale);
const TRACK_LEFT = scale(65);
const TRACK_WIDTH = scale(235);
// How far the gradient fills for each step (grey covers the rest).
const FILL_TO = [75, 160, 240, 300].map(scale);

const StepBadge: React.FC<{ index: number; done: boolean }> = ({
  index,
  done,
}) => (
  <Svg width={BADGE} height={BADGE} viewBox="0 0 24 24">
    {done ? (
      <>
        <Circle cx={12} cy={12} r={8} fill={DONE_COLORS[index]} />
        <Path
          d={TICK}
          fill={colors.stepTick}
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </>
    ) : (
      <>
        <Circle cx={12} cy={12} r={8} fill={colors.borderLight} />
        <Circle cx={12} cy={12} r={3} fill={colors.onAccent} />
      </>
    )}
  </Svg>
);

const StepProgress: React.FC<StepProgressProps> = ({ currentStep }) => {
  const fillEnd = FILL_TO[Math.min(currentStep, STEPS.length) - 1];

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.trackFill}
        />
        <View
          style={[styles.trackRest, { left: fillEnd - TRACK_LEFT, right: 0 }]}
        />
      </View>

      {STEPS.map((step, index) => (
        <View
          key={step}
          style={[styles.step, { left: CENTERS[index] - scale(30) }]}
        >
          <StepBadge index={index} done={index + 1 <= currentStep} />
          <Text style={styles.label} numberOfLines={1}>
            {step}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    container: {
      width: scale(360),
      alignSelf: 'center',
      // header → badges 20, badges + label, then 24 down to the section title
      height: BADGE + scale(19),
      marginTop: verticalScale(20),
      marginBottom: verticalScale(24),
    },
    track: {
      position: 'absolute',
      top: BADGE / 2 - 1,
      left: TRACK_LEFT,
      width: TRACK_WIDTH,
      height: 2,
    },
    trackFill: {
      ...StyleSheet.absoluteFill,
    },
    trackRest: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      backgroundColor: colors.borderLight,
    },
    step: {
      position: 'absolute',
      top: 0,
      width: scale(60),
      alignItems: 'center',
    },
    label: {
      marginTop: scale(4),
      fontSize: normalizeFont(12),
      fontFamily: fonts.medium,
      color: colors.text,
    },
  }),
);

export default StepProgress;
