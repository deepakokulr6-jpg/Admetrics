import React, { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import TimePickerSheet from './TimePickerSheet';
import { formStyles } from '../shared/FormScreenLayout';
import type { TimeSlot, WorkingHour } from '../../types/clinic';
import { slotsOf } from '../../utils/workingHours';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';
import strings from '../../constants/strings';

const t = strings.workingHours;
/** Up to two slots a day (e.g. morning and evening). */
const MAX_SLOTS = 2;

type Props = {
  hours: WorkingHour[];
  onChange: (index: number, patch: Partial<WorkingHour>) => void;
  /** Day with a problem (red time boxes), from validation. */
  errorIndex?: number | null;
};

type Editing = { day: number; slot: number; edge: keyof TimeSlot } | null;

/** Round "+" / "−" button at the end of a row. */
const SlotButton = ({
  kind,
  label,
  onPress,
}: {
  kind: 'add' | 'remove';
  label: string;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    hitSlop={8}
    accessibilityRole="button"
    accessibilityLabel={label}
    style={styles.slotButton}
  >
    <Svg width={scale(24)} height={scale(24)} viewBox="0 0 24 24">
      <Circle
        cx={12}
        cy={12}
        r={10.5}
        stroke={colors.buttonPrimary}
        strokeWidth={1.4}
        fill="none"
      />
      <Path
        d={kind === 'add' ? 'M12 7.5v9M7.5 12h9' : 'M7.5 12h9'}
        stroke={colors.buttonPrimary}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  </Pressable>
);

/**
 * Figma "Working Hours": a row per day with an open/closed switch and
 * opening / closing time boxes (tap → time picker). "+" adds a second slot
 * for the day; "−" removes it. Closed days show greyed "00:00" boxes.
 */
const WorkingHoursSection: React.FC<Props> = ({
  hours,
  onChange,
  errorIndex,
}) => {
  const [editing, setEditing] = useState<Editing>(null);

  const setSlot = (
    dayIndex: number,
    slot: number,
    patch: Partial<TimeSlot>,
  ) => {
    const hour = hours[dayIndex];
    if (slot === 0) {
      onChange(dayIndex, patch);
      return;
    }
    const extra = [...(hour.extraSlots ?? [])];
    extra[slot - 1] = { ...extra[slot - 1], ...patch };
    onChange(dayIndex, { extraSlots: extra });
  };

  const editingHour = editing ? hours[editing.day] : null;
  const editingValue =
    editing && editingHour
      ? slotsOf(editingHour)[editing.slot]?.[editing.edge] ?? ''
      : '';

  return (
    <View>
      <Text style={formStyles.heading}>{t.title}</Text>

      {hours.map((hour, dayIndex) => {
        const slots = slotsOf(hour);
        const hasError = errorIndex === dayIndex;
        return (
          <View key={hour.day} style={styles.day}>
            {slots.map((slot, slotIndex) => {
              const isLast = slotIndex === slots.length - 1;
              return (
                <View key={slotIndex} style={styles.row}>
                  <View style={styles.dayColumn}>
                    {slotIndex === 0 ? (
                      <>
                        <Text style={styles.dayText}>{hour.day}</Text>
                        <Switch
                          value={hour.enabled}
                          onValueChange={enabled =>
                            onChange(dayIndex, { enabled })
                          }
                          trackColor={{
                            false: colors.switchTrack,
                            true: colors.buttonPrimary,
                          }}
                          thumbColor={colors.onAccent}
                          ios_backgroundColor={colors.switchTrack}
                          style={styles.switch}
                          accessibilityLabel={t.openOn(hour.day)}
                        />
                      </>
                    ) : null}
                  </View>

                  {(['startTime', 'endTime'] as const).map(edge => {
                    const value = hour.enabled ? slot[edge] : '';
                    return (
                      <Pressable
                        key={edge}
                        disabled={!hour.enabled}
                        onPress={() =>
                          setEditing({ day: dayIndex, slot: slotIndex, edge })
                        }
                        accessibilityRole="button"
                        accessibilityLabel={
                          edge === 'startTime'
                            ? t.opensAt(hour.day)
                            : t.closesAt(hour.day)
                        }
                        accessibilityValue={{ text: value || t.timeEmpty }}
                        style={[
                          styles.timeBox,
                          !hour.enabled && styles.timeBoxDisabled,
                          hasError && styles.timeBoxError,
                        ]}
                      >
                        <Text
                          style={[
                            styles.timeText,
                            !hour.enabled && styles.timeTextDisabled,
                          ]}
                        >
                          {value || t.timeEmpty}
                        </Text>
                      </Pressable>
                    );
                  })}

                  <View style={styles.slotSlot}>
                    {hour.enabled && isLast ? (
                      slots.length < MAX_SLOTS ? (
                        <SlotButton
                          kind="add"
                          label={t.addSlot(hour.day)}
                          onPress={() =>
                            onChange(dayIndex, {
                              extraSlots: [
                                ...(hour.extraSlots ?? []),
                                // Default evening slot after the first one.
                                { startTime: '05:30PM', endTime: '09:30PM' },
                              ],
                            })
                          }
                        />
                      ) : (
                        <SlotButton
                          kind="remove"
                          label={t.removeSlot(hour.day)}
                          onPress={() =>
                            onChange(dayIndex, {
                              extraSlots: (hour.extraSlots ?? []).slice(0, -1),
                            })
                          }
                        />
                      )
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        );
      })}

      <TimePickerSheet
        visible={editing !== null}
        title={
          editing && editingHour
            ? editing.edge === 'startTime'
              ? t.opensAt(editingHour.day)
              : t.closesAt(editingHour.day)
            : ''
        }
        value={editingValue}
        onSelect={time =>
          editing &&
          setSlot(editing.day, editing.slot, { [editing.edge]: time })
        }
        onClose={() => setEditing(null)}
      />
    </View>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    day: {
      gap: verticalScale(12),
      marginBottom: verticalScale(12),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(10),
    },
    // Figma: day name with the switch under it.
    dayColumn: {
      width: scale(78),
      gap: verticalScale(4),
    },
    dayText: {
      fontSize: normalizeFont(12),
      fontFamily: fonts.regular,
      color: colors.text,
    },
    switch: {
      alignSelf: 'flex-start',
      transform: [{ scale: 0.8 }],
      marginLeft: -scale(4),
    },
    timeBox: {
      flex: 1,
      height: verticalScale(44),
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: scale(8),
    },
    timeBoxDisabled: {
      borderColor: colors.borderLight,
    },
    timeBoxError: {
      borderColor: colors.red,
    },
    timeText: {
      fontSize: normalizeFont(14),
      fontFamily: fonts.semibold,
      color: colors.textStrong,
    },
    timeTextDisabled: {
      color: colors.placeholder,
      fontFamily: fonts.regular,
    },
    slotSlot: {
      width: scale(28),
      alignItems: 'center',
    },
    slotButton: {
      padding: scale(2),
    },
  }),
);

export default WorkingHoursSection;
