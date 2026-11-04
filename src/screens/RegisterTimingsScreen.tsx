import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../components/ScreenHeader';
import StepProgress from '../components/StepProgress';
import WorkingHoursRow from '../components/WorkingHoursRow';
import GradientButton from '../components/GradientButton';
import { useClinicRegistration } from '../contexts/ClinicRegistrationContext';
import { isBlank, isValidTime } from '../utils/validation';
import { useKeyboardAutoScroll } from '../utils/useKeyboardAutoScroll';
import type { AppScreenProps } from '../navigation/types';

const validateHours = (
  hours: ReturnType<typeof useClinicRegistration>['draft']['workingHours'],
): Record<number, string> => {
  const errors: Record<number, string> = {};

  hours.forEach((item, index) => {
    if (!item.enabled) {
      return;
    }

    const start = item.startTime.trim();
    const end = item.endTime.trim();

    if (isBlank(start) || isBlank(end)) {
      errors[index] = 'Start and end time are required.';
      return;
    }

    if (!isValidTime(start) || !isValidTime(end)) {
      errors[index] = 'Use a time like 09:30AM or 06:30PM.';
      return;
    }

    if (start.toLowerCase() === end.toLowerCase()) {
      errors[index] = 'Start and end time cannot be the same.';
    }
  });

  return errors;
};

const RegisterTimingsScreen: React.FC<AppScreenProps<'RegisterTimings'>> = ({
  navigation,
}) => {
  const { draft, updateWorkingHour } = useClinicRegistration();
  const { workingHours } = draft;

  const { scrollRef, onScroll, onLayout } = useKeyboardAutoScroll();

  const [errors, setErrors] = useState<Record<number, string>>({});

  const handleToggle = (index: number, enabled: boolean) => {
    updateWorkingHour(index, {
      enabled,
      startTime: enabled ? workingHours[index].startTime || '09:30AM' : '',
      endTime: enabled ? workingHours[index].endTime || '09:30PM' : '',
    });
    setErrors(previous => {
      if (!previous[index]) {
        return previous;
      }

      const next = { ...previous };
      delete next[index];
      return next;
    });
  };

  const handleTimeChange = (
    index: number,
    key: 'startTime' | 'endTime',
    value: string,
  ) => {
    updateWorkingHour(index, { [key]: value });
    setErrors(previous => {
      if (!previous[index]) {
        return previous;
      }

      const next = { ...previous };
      delete next[index];
      return next;
    });
  };

  const handleNext = () => {
    const nextErrors = validateHours(workingHours);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      Alert.alert(
        'Check working hours',
        'Please correct the highlighted working hours before continuing.',
      );
      return;
    }

    navigation.navigate('RegisterPhotos');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScreenHeader
        title="Register Your Clinic"
        onBackPress={() => navigation.goBack()}
      />
      {/* Legacy standalone route: the primary flow skips timings, so this
          screen stays on the Personal step of the 3-step indicator. */}
      <StepProgress currentStep={2} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          onScroll={onScroll}
          onLayout={onLayout}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heading}>Working Hours</Text>

          {workingHours.map((item, index) => (
            <View key={item.day} style={styles.rowWrapper}>
              <WorkingHoursRow
                day={item.day}
                enabled={item.enabled}
                startTime={item.startTime}
                endTime={item.endTime}
                onToggle={value => handleToggle(index, value)}
                onStartTimeChange={value =>
                  handleTimeChange(index, 'startTime', value)
                }
                onEndTimeChange={value =>
                  handleTimeChange(index, 'endTime', value)
                }
              />

              {errors[index] ? (
                <Text style={styles.errorText}>{errors[index]}</Text>
              ) : null}
            </View>
          ))}

          <View style={styles.button}>
            <GradientButton title="Next" onPress={handleNext} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  flex: {
    flex: 1,
  },

  content: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 32,
  },

  heading: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    color: '#221E25',
    marginBottom: 14,
  },

  rowWrapper: {
    width: '100%',
  },

  errorText: {
    marginTop: -6,
    marginBottom: 8,
    marginLeft: 70,
    fontSize: 11,
    lineHeight: 15,
    color: '#D93025',
  },

  button: {
    marginTop: 14,
  },
});

export default RegisterTimingsScreen;
