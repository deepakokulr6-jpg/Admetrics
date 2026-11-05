import React from 'react';
import { View, Text, Switch, TextInput, StyleSheet } from 'react-native';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';

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
        <Text style={[styles.dayText, !enabled && styles.disabledText]}>
          {day}
        </Text>

        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: '#E5E5E5', true: '#221E25' }}
          thumbColor={enabled ? '#FFFFFF' : '#FFFFFF'}
          ios_backgroundColor="#E5E5E5"
          style={styles.switch}
        />
      </View>

      {/* Start time */}
      <TextInput
        value={startTime}
        onChangeText={onStartTimeChange}
        editable={enabled}
        placeholder="09:30AM"
        placeholderTextColor="#AAAAAA"
        style={[styles.timeInput, !enabled && styles.disabledInput]}
        textAlign="center"
        accessibilityLabel={`${day} start time`}
      />

      {/* End time */}
      <TextInput
        value={endTime}
        onChangeText={onEndTimeChange}
        editable={enabled}
        placeholder="09:30PM"
        placeholderTextColor="#AAAAAA"
        style={[styles.timeInput, !enabled && styles.disabledInput]}
        textAlign="center"
        accessibilityLabel={`${day} end time`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: scale(12),
    marginBottom: verticalScale(10),
  },
  dayColumn: {
    width: scale(58),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  dayText: {
    fontSize: normalizeFont(12),
    color: '#221E25',
    marginBottom: verticalScale(2),
  },
  disabledText: {
    color: '#AAAAAA',
  },
  switch: {
    marginLeft: -5,
    transform: [{ scaleX: 0.78 }, { scaleY: 0.78 }],
  },
  timeInput: {
    flex: 1,
    minWidth: 0,
    height: verticalScale(40),
    borderWidth: 1,
    borderColor: '#AAAAAA',
    borderRadius: scale(6),
    paddingHorizontal: scale(3),
    paddingVertical: 0,
    color: '#221E25',
    fontSize: normalizeFont(14),
    fontWeight: '600',
    backgroundColor: '#FFFFFF',
  },
  disabledInput: {
    borderColor: '#EEEEEE',
    color: '#AAAAAA',
    backgroundColor: '#FFFFFF',
  },
});

export default WorkingHoursRow;
