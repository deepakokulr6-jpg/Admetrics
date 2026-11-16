import React from 'react';
import { View, Text, Switch, TextInput, StyleSheet } from 'react-native';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';

interface WorkingHoursRowProps {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
  onToggle: (value: boolean) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}

const WorkingHoursRow: React.FC<WorkingHoursRowProps> = ({
  day,
  enabled,
  startTime,
  endTime,
  onToggle,
  onStartTimeChange,
  onEndTimeChange,
}) => {
  return (
    <View style={styles.row}>
      {/* Day name and toggle */}
      <View style={styles.dayColumn}>
        <Text style={styles.dayText}>{day}</Text>

        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: colors.switchTrack, true: colors.text }}
          thumbColor={enabled ? colors.white : colors.white}
          ios_backgroundColor={colors.switchTrack}
          style={styles.switch}
        />
      </View>

      {/* Start time */}
      <TextInput
        value={startTime}
        onChangeText={onStartTimeChange}
        editable={enabled}
        placeholder={strings.workingHoursRow.startPlaceholder}
        placeholderTextColor={colors.border}
        style={[styles.timeInput, !enabled && styles.disabledInput]}
        textAlign="center"
        accessibilityLabel={strings.workingHoursRow.startTime(day)}
      />

      {/* End time */}
      <TextInput
        value={endTime}
        onChangeText={onEndTimeChange}
        editable={enabled}
        placeholder={strings.workingHoursRow.endPlaceholder}
        placeholderTextColor={colors.border}
        style={[styles.timeInput, !enabled && styles.disabledInput]}
        textAlign="center"
        accessibilityLabel={strings.workingHoursRow.endTime(day)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: scale(16),
    marginBottom: verticalScale(16),
  },
  dayColumn: {
    width: scale(56),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  dayText: {
    fontSize: normalizeFont(12),
    color: colors.text,
    marginBottom: verticalScale(4),
  },
  switch: {
    marginLeft: -5,
    transform: [{ scaleX: 0.78 }, { scaleY: 0.78 }],
  },
  timeInput: {
    width: scale(120),
    height: verticalScale(40),
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: scale(6),
    paddingHorizontal: scale(3),
    paddingVertical: 0,
    color: colors.text,
    fontSize: normalizeFont(14),
    fontFamily: fonts.semibold,
    backgroundColor: colors.white,
  },
  disabledInput: {
    borderColor: colors.disabled,
    color: colors.border,
    backgroundColor: colors.white,
  },
});

export default WorkingHoursRow;
