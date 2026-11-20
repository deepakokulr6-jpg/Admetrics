import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import BottomSheet from '../shared/BottomSheet';
import GradientButton from '../shared/GradientButton';
import WheelColumn, { WheelBand } from '../shared/WheelColumn';
import { formatTime, parseTime, type TimeParts } from '../../utils/time';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';
import strings from '../../constants/strings';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);
const PERIODS = ['AM', 'PM'] as const;
const DEFAULT: TimeParts = { hour: 9, minute: 30, period: 'AM' };

type PickerProps = {
  title: string;
  value: string;
  /** Called with "09:30AM" when Done is tapped. */
  onDone: (time: string) => void;
};

const initialTime = (value: string): TimeParts => {
  const parsed = parseTime(value);
  return parsed
    ? { ...parsed, minute: (Math.round(parsed.minute / 5) * 5) % 60 }
    : DEFAULT;
};

/**
 * Hour / minute (5-min steps) / AM-PM scroll wheels + Done; pure JS, no native
 * picker. Usable inside any sheet (see TimePickerSheet for a standalone one).
 */
export const TimePicker: React.FC<PickerProps> = ({ title, value, onDone }) => {
  const [time, setTime] = useState<TimeParts>(() => initialTime(value));

  const hourLabels = HOURS.map(h => String(h).padStart(2, '0'));
  const minuteLabels = MINUTES.map(m => String(m).padStart(2, '0'));

  return (
    <>
      <Text style={styles.title}>{title}</Text>
      {/* Big live readout of the wheels. */}
      <Text style={styles.preview} accessibilityLiveRegion="polite">
        {formatTime(time).replace(/(AM|PM)$/, ' $1')}
      </Text>

      <View style={styles.wheels}>
        <WheelBand />
        <WheelColumn
          items={hourLabels}
          index={HOURS.indexOf(time.hour)}
          onChange={i => setTime(previous => ({ ...previous, hour: HOURS[i] }))}
          accessibilityLabel={strings.workingHours.hour}
        />
        <Text style={styles.colon}>{strings.workingHours.timeSeparator}</Text>
        <WheelColumn
          items={minuteLabels}
          index={Math.max(0, MINUTES.indexOf(time.minute))}
          onChange={i =>
            setTime(previous => ({ ...previous, minute: MINUTES[i] }))
          }
          accessibilityLabel={strings.workingHours.minute}
        />
        <WheelColumn
          items={PERIODS}
          index={PERIODS.indexOf(time.period)}
          onChange={i =>
            setTime(previous => ({ ...previous, period: PERIODS[i] }))
          }
          accessibilityLabel={strings.workingHours.period}
        />
      </View>

      <GradientButton
        title={strings.workingHours.done}
        onPress={() => onDone(formatTime(time))}
        style={styles.button}
      />
    </>
  );
};

type Props = {
  visible: boolean;
  title: string;
  value: string;
  onSelect: (time: string) => void;
  onClose: () => void;
};

/** The time picker in its own bottom sheet. */
const TimePickerSheet: React.FC<Props> = ({
  visible,
  title,
  value,
  onSelect,
  onClose,
}) => {
  // Remount on open so it starts from the field's current time.
  const [openCount, setOpenCount] = useState(0);
  useEffect(() => {
    if (visible) {
      setOpenCount(count => count + 1);
    }
  }, [visible]);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <TimePicker
        key={openCount}
        title={title}
        value={value}
        onDone={time => {
          onSelect(time);
          onClose();
        }}
      />
    </BottomSheet>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    title: {
      fontSize: normalizeFont(18),
      fontFamily: fonts.bold,
      color: colors.textStrong,
    },
    preview: {
      marginTop: verticalScale(6),
      fontSize: normalizeFont(28),
      lineHeight: normalizeFont(34),
      fontFamily: fonts.bold,
      color: colors.buttonPrimary,
      textAlign: 'center',
    },
    wheels: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: verticalScale(12),
      paddingHorizontal: scale(8),
    },
    colon: {
      fontSize: normalizeFont(20),
      fontFamily: fonts.bold,
      color: colors.buttonPrimary,
    },
    button: {
      marginTop: verticalScale(20),
    },
  }),
);

export default TimePickerSheet;
