import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

interface StepProgressProps {
  currentStep: number;
}

const STEPS = ['Clinic', 'Personal', 'Timings', 'Photos'];

const StepProgress: React.FC<StepProgressProps> = ({ currentStep }) => {
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width - 48, 328);

  return (
    <View style={[styles.container, { width: contentWidth }]}>
      <View style={styles.progressRow}>
        {STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const completed = stepNumber < currentStep;
          const active = stepNumber === currentStep;
          const reached = stepNumber <= currentStep;

          return (
            <React.Fragment key={step}>
              <View style={styles.step}>
                <View style={styles.indicator}>
                  {completed ? (
                    <View style={styles.completedCircle}>
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    </View>
                  ) : active ? (
                    <LinearGradient
                      colors={['#0265FB', '#B43AFC']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.activeCircle}
                    >
                      <View style={styles.activeInnerCircle} />
                    </LinearGradient>
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
                  <View
                    style={[styles.line, completed && styles.completedLine]}
                  />
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
    paddingTop: 12,
    paddingBottom: 16,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  step: {
    width: 44,
    alignItems: 'center',
    zIndex: 1,
  },
  indicator: {
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0265FB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeInnerCircle: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  inactiveCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D8D8D8',
  },
  lineContainer: {
    flex: 1,
    height: 16,
    justifyContent: 'center',
    marginHorizontal: -2,
  },
  line: {
    height: 2,
    backgroundColor: '#DDDDDD',
  },
  completedLine: {
    backgroundColor: '#6250FF',
  },
  stepLabel: {
    fontSize: 10,
    color: '#777777',
    marginTop: 4,
    textAlign: 'center',
  },
  reachedLabel: {
    color: '#221E25',
  },
});

export default StepProgress;
