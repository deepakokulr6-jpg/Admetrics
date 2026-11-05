import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';

interface StepProgressProps {
  currentStep: number;
}

const STEPS = ['Clinic', 'Personal', 'Photos'];

// Completed steps follow the brand gradient across the row, so the first
// check is blue and the last one is purple (matching the registration design).
const GRADIENT_START = [2, 101, 251]; // #0265FB
const GRADIENT_END = [180, 58, 252]; // #B43AFC

const mixChannel = (start: number, end: number, ratio: number): number =>
  Math.round(start + (end - start) * ratio);

const stepColor = (index: number): string => {
  const ratio = STEPS.length > 1 ? index / (STEPS.length - 1) : 0;
  const [r, g, b] = GRADIENT_START.map((channel, channelIndex) =>
    mixChannel(channel, GRADIENT_END[channelIndex], ratio),
  );

  return `rgb(${r}, ${g}, ${b})`;
};

const StepProgress: React.FC<StepProgressProps> = ({ currentStep }) => {
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width - scale(48), scale(328));

  return (
    <View style={[styles.container, { width: contentWidth }]}>
      <View style={styles.progressRow}>
        {STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const completed = stepNumber < currentStep;
          const reached = stepNumber <= currentStep;
          const nextStepCompleted = stepNumber + 1 < currentStep;

          return (
            <React.Fragment key={step}>
              <View style={styles.step}>
                <View style={styles.indicator}>
                  {completed ? (
                    <View
                      style={[
                        styles.completedCircle,
                        { backgroundColor: stepColor(index) },
                      ]}
                    >
                      <Ionicons
                        name="checkmark"
                        size={scale(12)}
                        color="#FFFFFF"
                      />
                    </View>
                  ) : (
                    <View style={styles.inactiveCircle} />
                  )}
                </View>

                <Text
                  style={[styles.stepLabel, reached && styles.reachedLabel]}
                  numberOfLines={1}
                >
                  {step}
                </Text>
              </View>

              {index < STEPS.length - 1 && (
                <View style={styles.lineContainer}>
                  {nextStepCompleted ? (
                    <LinearGradient
                      colors={[stepColor(index), stepColor(index + 1)]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.line}
                    />
                  ) : (
                    <View style={[styles.line, styles.inactiveLine]} />
                  )}
                </View>
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(16),
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  step: {
    width: scale(44),
    alignItems: 'center',
    zIndex: 1,
  },
  indicator: {
    height: verticalScale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedCircle: {
    width: scale(12),
    height: scale(12),
    borderRadius: scale(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveCircle: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D8D8D8',
  },
  lineContainer: {
    flex: 1,
    height: verticalScale(16),
    justifyContent: 'center',
    marginHorizontal: scale(-2),
  },
  line: {
    height: verticalScale(2),
  },
  inactiveLine: {
    backgroundColor: '#DDDDDD',
  },
  stepLabel: {
    fontSize: normalizeFont(10),
    color: '#777777',
    marginTop: verticalScale(4),
    textAlign: 'center',
  },
  reachedLabel: {
    color: '#221E25',
  },
});

export default StepProgress;
