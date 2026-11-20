import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FIGMA_BASE_WIDTH = 360;
const scale = (size: number) => (SCREEN_WIDTH / FIGMA_BASE_WIDTH) * size;

type DayName =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface TimeRange {
  id: string;
  start: string;
  end: string;
}

export interface DayScheduleItem {
  day: DayName;
  enabled: boolean;
  slots: TimeRange[];
}

export const INITIAL_WORKING_HOURS: DayScheduleItem[] = [
  {
    day: 'Monday',
    enabled: true,
    slots: [
      { id: 'mon-1', start: '09:30AM', end: '12:30PM' },
      { id: 'mon-2', start: '05:30AM', end: '9:30PM' },
    ],
  },
  {
    day: 'Tuesday',
    enabled: true,
    slots: [{ id: 'tue-1', start: '09:30AM', end: '09:30PM' }],
  },
  {
    day: 'Wednesday',
    enabled: true,
    slots: [{ id: 'wed-1', start: '09:30AM', end: '09:30PM' }],
  },
  {
    day: 'Thursday',
    enabled: true,
    slots: [{ id: 'thu-1', start: '09:30AM', end: '09:30PM' }],
  },
  {
    day: 'Friday',
    enabled: true,
    slots: [{ id: 'fri-1', start: '09:30AM', end: '09:30PM' }],
  },
  {
    day: 'Saturday',
    enabled: true,
    slots: [{ id: 'sat-1', start: '09:30AM', end: '09:30PM' }],
  },
  {
    day: 'Sunday',
    enabled: false,
    slots: [{ id: 'sun-1', start: '00:00', end: '00:00' }],
  },
];

export interface WorkingHoursSectionProps {
  value?: DayScheduleItem[];
  onChange?: (updated: DayScheduleItem[]) => void;
  onSelectTimeSlot?: (
    day: DayName,
    slotId: string,
    field: 'start' | 'end',
  ) => void;
}

export const WorkingHoursSection: React.FC<WorkingHoursSectionProps> = ({
  value,
  onChange,
  onSelectTimeSlot,
}) => {
  const [internalHours, setInternalHours] = useState<DayScheduleItem[]>(
    INITIAL_WORKING_HOURS,
  );
  const workingHours = value ?? internalHours;

  const updateSchedule = (updater: (prev: DayScheduleItem[]) => DayScheduleItem[]) => {
    try {
      const next = updater(workingHours);
      if (onChange) {
        onChange(next);
      } else {
        setInternalHours(next);
      }
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : 'Unable to update schedule.';
      Alert.alert('Schedule Error', msg);
    }
  };

  const handleToggleDay = (day: DayName) => {
    updateSchedule(prev =>
      prev.map(item => {
        if (item.day !== day) return item;
        const nextEnabled = !item.enabled;
        return {
          ...item,
          enabled: nextEnabled,
          slots:
            nextEnabled && item.slots[0]?.start === '00:00'
              ? [{ id: `${day.toLowerCase()}-1`, start: '09:30AM', end: '09:30PM' }]
              : item.slots,
        };
      }),
    );
  };

  const handleAddSlot = (day: DayName) => {
    updateSchedule(prev =>
      prev.map(item => {
        if (item.day !== day || !item.enabled) return item;
        return {
          ...item,
          slots: [
            ...item.slots,
            {
              id: `${day.toLowerCase()}-${item.slots.length + 1}-${Date.now()}`,
              start: '09:30AM',
              end: '09:30PM',
            },
          ],
        };
      }),
    );
  };

  return (
    <View style={sectionStyles.container}>
      <Text style={sectionStyles.sectionHeading}>{'Working Hours'}</Text>

      {workingHours.map(item => (
        <View key={item.day} style={sectionStyles.dayRowContainer}>
          <View style={sectionStyles.dayColumn}>
            <Text style={sectionStyles.dayText}>{item.day}</Text>
            <View style={sectionStyles.toggleBox}>
              <Switch
                value={item.enabled}
                onValueChange={() => handleToggleDay(item.day)}
                trackColor={{
                  false: colors.surfaceMuted,
                  true: colors.primary,
                }}
                thumbColor={colors.white}
              />
            </View>
          </View>

          <View style={sectionStyles.slotsWrapper}>
            {item.slots.map((slot, index) => {
              const isLastSlot = index === item.slots.length - 1;
              return (
                <View key={slot.id} style={sectionStyles.slotPairRow}>
                  <TouchableOpacity
                    disabled={!item.enabled}
                    onPress={() =>
                      onSelectTimeSlot?.(item.day, slot.id, 'start')
                    }
                    style={[
                      sectionStyles.timePill,
                      !item.enabled && sectionStyles.timePillDisabled,
                    ]}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        sectionStyles.timePillText,
                        !item.enabled && sectionStyles.timePillTextDisabled,
                      ]}
                    >
                      {slot.start}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={!item.enabled}
                    onPress={() =>
                      onSelectTimeSlot?.(item.day, slot.id, 'end')
                    }
                    style={[
                      sectionStyles.timePill,
                      !item.enabled && sectionStyles.timePillDisabled,
                    ]}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        sectionStyles.timePillText,
                        !item.enabled && sectionStyles.timePillTextDisabled,
                      ]}
                    >
                      {slot.end}
                    </Text>
                  </TouchableOpacity>

                  {item.enabled && isLastSlot ? (
                    <TouchableOpacity
                      onPress={() => handleAddSlot(item.day)}
                      style={sectionStyles.addSlotButton}
                      activeOpacity={0.75}
                    >
                      <Text style={sectionStyles.addSlotIcon}>{'+'}</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={sectionStyles.addSlotSpacer} />
                  )}
                </View>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
};

export interface ClinicInformationScreenProps {
  onNext?: (workingHours: DayScheduleItem[]) => Promise<void> | void;
  onSelectTimeSlot?: (
    day: DayName,
    slotId: string,
    field: 'start' | 'end',
  ) => void;
}

export const ClinicInformationScreen: React.FC<
  ClinicInformationScreenProps
> = ({ onNext, onSelectTimeSlot }) => {
  const [workingHours, setWorkingHours] = useState<DayScheduleItem[]>(
    INITIAL_WORKING_HOURS,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleDay = (day: DayName) => {
    try {
      setWorkingHours(prev =>
        prev.map(item => {
          if (item.day !== day) {
            return item;
          }
          const nextEnabled = !item.enabled;
          return {
            ...item,
            enabled: nextEnabled,
            slots:
              nextEnabled && item.slots[0]?.start === '00:00'
                ? [
                    {
                      id: `${day.toLowerCase()}-1`,
                      start: '09:30AM',
                      end: '09:30PM',
                    },
                  ]
                : item.slots,
          };
        }),
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unable to toggle day status.';
      Alert.alert('Schedule Error', message);
    }
  };

  const handleAddSlot = (day: DayName) => {
    try {
      setWorkingHours(prev =>
        prev.map(item => {
          if (item.day !== day || !item.enabled) {
            return item;
          }
          const nextIdx = item.slots.length + 1;
          return {
            ...item,
            slots: [
              ...item.slots,
              {
                id: `${day.toLowerCase()}-${nextIdx}-${Date.now()}`,
                start: '09:30AM',
                end: '09:30PM',
              },
            ],
          };
        }),
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unable to add time slot.';
      Alert.alert('Schedule Error', message);
    }
  };

  const handleSlotPress = (
    day: DayName,
    enabled: boolean,
    slotId: string,
    field: 'start' | 'end',
  ) => {
    if (!enabled) {
      return;
    }
    try {
      onSelectTimeSlot?.(day, slotId, field);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unable to open time picker.';
      Alert.alert('Time Slot Error', message);
    }
  };

  const handleNextPress = async () => {
    setIsSubmitting(true);
    try {
      if (onNext) {
        await onNext(workingHours);
      } else {
        Alert.alert('Success', 'Working hours saved.');
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to save working hours. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionHeading}>{'Working Hours'}</Text>

        {workingHours.map(item => (
          <View key={item.day} style={styles.dayRowContainer}>
            <View style={styles.dayColumn}>
              <Text style={styles.dayText}>{item.day}</Text>
              <View style={styles.toggleBox}>
                <Switch
                  value={item.enabled}
                  onValueChange={() => handleToggleDay(item.day)}
                  trackColor={{
                    false: colors.surfaceMuted,
                    true: colors.primary,
                  }}
                  thumbColor={colors.white}
                />
              </View>
            </View>

            <View style={styles.slotsWrapper}>
              {item.slots.map((slot, index) => {
                const isLastSlot = index === item.slots.length - 1;
                return (
                  <View key={slot.id} style={styles.slotPairRow}>
                    <TouchableOpacity
                      disabled={!item.enabled}
                      onPress={() =>
                        handleSlotPress(
                          item.day,
                          item.enabled,
                          slot.id,
                          'start',
                        )
                      }
                      style={[
                        styles.timePill,
                        !item.enabled && styles.timePillDisabled,
                      ]}
                      activeOpacity={0.75}
                    >
                      <Text
                        style={[
                          styles.timePillText,
                          !item.enabled && styles.timePillTextDisabled,
                        ]}
                      >
                        {slot.start}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      disabled={!item.enabled}
                      onPress={() =>
                        handleSlotPress(item.day, item.enabled, slot.id, 'end')
                      }
                      style={[
                        styles.timePill,
                        !item.enabled && styles.timePillDisabled,
                      ]}
                      activeOpacity={0.75}
                    >
                      <Text
                        style={[
                          styles.timePillText,
                          !item.enabled && styles.timePillTextDisabled,
                        ]}
                      >
                        {slot.end}
                      </Text>
                    </TouchableOpacity>

                    {item.enabled && isLastSlot ? (
                      <TouchableOpacity
                        onPress={() => handleAddSlot(item.day)}
                        style={styles.addSlotButton}
                        activeOpacity={0.75}
                      >
                        <Text style={styles.addSlotIcon}>{'+'}</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.addSlotSpacer} />
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.nextButton, isSubmitting && styles.nextButtonDisabled]}
          onPress={handleNextPress}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonText}>
            {isSubmitting ? 'Saving...' : 'Next'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingTop: scale(16),
    paddingBottom: scale(28),
  },
  sectionHeading: {
    fontSize: scale(16),
    fontFamily: fonts.semibold,
    color: colors.text,
    marginBottom: scale(12),
  },
  dayRowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: scale(14),
  },
  dayColumn: {
    width: scale(115),
    alignItems: 'flex-start',
  },
  dayText: {
    fontSize: scale(13),
    fontFamily: fonts.medium,
    color: colors.text,
    marginBottom: scale(6),
  },
  toggleBox: {
    minWidth: scale(46),
    minHeight: scale(39),
    borderRadius: scale(16.87),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  slotsWrapper: {
    flex: 1,
    maxWidth: scale(229),
  },
  slotPairRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: scale(8),
  },
  timePill: {
    flex: 1,
    height: scale(36),
    borderRadius: scale(6),
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timePillDisabled: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.surfaceMuted,
  },
  timePillText: {
    fontSize: scale(12),
    fontFamily: fonts.medium,
    color: colors.text,
  },
  timePillTextDisabled: {
    color: colors.mutedText,
  },
  addSlotButton: {
    width: scale(22),
    height: scale(22),
    borderRadius: scale(11),
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSlotIcon: {
    fontSize: scale(14),
    lineHeight: scale(16),
    color: colors.primary,
    fontFamily: fonts.medium,
  },
  addSlotSpacer: {
    width: scale(22),
  },
  nextButton: {
    marginTop: scale(20),
    height: scale(44),
    borderRadius: scale(22),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.65,
  },
  nextButtonText: {
    fontSize: scale(14),
    fontFamily: fonts.bold,
    color: colors.white,
  },
});

const sectionStyles = StyleSheet.create({
  container: {
    marginTop: scale(16),
  },
  sectionHeading: {
    fontSize: scale(16),
    fontFamily: fonts.semibold,
    color: colors.text,
    marginBottom: scale(12),
  },
  dayRowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: scale(14),
  },
  dayColumn: {
    width: scale(115),
    alignItems: 'flex-start',
  },
  dayText: {
    fontSize: scale(13),
    fontFamily: fonts.medium,
    color: colors.text,
    marginBottom: scale(6),
  },
  toggleBox: {
    minWidth: scale(46),
    minHeight: scale(39),
    borderRadius: scale(16.87),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  slotsWrapper: {
    flex: 1,
    maxWidth: scale(229),
  },
  slotPairRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: scale(8),
  },
  timePill: {
    flex: 1,
    height: scale(36),
    borderRadius: scale(6),
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timePillDisabled: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.surfaceMuted,
  },
  timePillText: {
    fontSize: scale(12),
    fontFamily: fonts.medium,
    color: colors.text,
  },
  timePillTextDisabled: {
    color: colors.mutedText,
  },
  addSlotButton: {
    width: scale(22),
    height: scale(22),
    borderRadius: scale(11),
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSlotIcon: {
    fontSize: scale(14),
    lineHeight: scale(16),
    color: colors.primary,
    fontFamily: fonts.medium,
  },
  addSlotSpacer: {
    width: scale(22),
  },
});

export default ClinicInformationScreen;
