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

import ScreenHeader from '../../components/shared/ScreenHeader';
import StepProgress from '../../components/shared/StepProgress';
import WorkingHoursRow from '../../components/shared/WorkingHoursRow';
import GradientButton from '../../components/shared/GradientButton';
import { useClinicRegistration } from '../../contexts/ClinicRegistrationContext';
import { isBlank, isValidTime } from '../../utils/validation';
import { useKeyboardAutoScroll } from '../../utils/useKeyboardAutoScroll';
import type { AppScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';

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
      errors[index] = strings.registerTimings.startAndEndTimeAre;
      return;
    }

    if (!isValidTime(start) || !isValidTime(end)) {
      errors[index] = strings.registerTimings.useATimeLike09;
      return;
    }

    if (start.toLowerCase() === end.toLowerCase()) {
      errors[index] = strings.registerTimings.startAndEndTimeCannot;
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
        strings.registerTimings.checkWorkingHours,
        strings.registerTimings.pleaseCorrectTheHighlightedWorking,
      );
      return;
    }

    navigation.navigate('RegisterPhotos');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScreenHeader
        title={strings.common.registerYourClinic}
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
          <Text style={styles.heading}>
            {strings.registerTimings.workingHours}
          </Text>

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
            <GradientButton title={strings.common.next} onPress={handleNext} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },

  flex: {
    flex: 1,
  },

  content: {
    width: '100%',
    maxWidth: scale(420),
    alignSelf: 'center',
    paddingHorizontal: scale(16),
    paddingTop: 0,
    paddingBottom: verticalScale(32),
  },

  heading: {
    fontSize: normalizeFont(16),
    lineHeight: normalizeFont(19),
    fontFamily: fonts.semibold,
    color: colors.text,
    marginBottom: verticalScale(16),
  },

  rowWrapper: {
    width: '100%',
  },

  errorText: {
    marginTop: verticalScale(-6),
    marginBottom: verticalScale(8),
    marginLeft: scale(70),
    fontSize: normalizeFont(11),
    lineHeight: normalizeFont(15),
    color: colors.red,
  },

  button: {
    marginTop: verticalScale(14),
  },
});

export default RegisterTimingsScreen;
