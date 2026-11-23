import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import BottomSheet from '../shared/BottomSheet';
import GradientButton from '../shared/GradientButton';
import InputField from '../shared/InputField';
import CalendarPicker, { formatDate } from '../shared/CalendarPicker';
import { TimePicker } from '../clinic/TimePickerSheet';
import { toMinutes } from '../../utils/time';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';
import strings from '../../constants/strings';

const t = strings.installation;
/** Bookable from tomorrow up to two months ahead. */
const DAYS_AHEAD = 60;
/** Technician visits: 9:00 AM – 7:00 PM. */
const EARLIEST = 9 * 60;
const LATEST = 19 * 60;

type View3 = 'form' | 'date' | 'time';

type Props = {
  visible: boolean;
  onClose: () => void;
  /** Date + "02:30PM" style time. */
  onSubmit: (date: Date, time: string) => void;
};

const CalendarIcon = () => (
  <Svg width={scale(22)} height={scale(22)} viewBox="0 0 24 24">
    <Rect
      x={3}
      y={4.5}
      width={18}
      height={16}
      rx={2.5}
      fill={colors.buttonPrimary}
    />
    <Path d="M3 9.5h18" stroke={colors.onAccent} strokeWidth={1.4} />
    <Path
      d="M8 3v3M16 3v3"
      stroke={colors.buttonPrimary}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

const ClockIcon = () => (
  <Svg width={scale(22)} height={scale(22)} viewBox="0 0 24 24">
    <Rect
      x={3}
      y={3}
      width={18}
      height={18}
      rx={3}
      fill={colors.buttonPrimary}
    />
    <Path
      d="M11 7.5V13h4"
      stroke={colors.onAccent}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

/**
 * Figma "Schedule Your Installation": preferred date + time, then Submit.
 * Tapping a field swaps the sheet's content to a calendar / time picker
 * (one sheet, no stacked pop-ups).
 */
const InstallationSheet: React.FC<Props> = ({ visible, onClose, onSubmit }) => {
  const [view, setView] = useState<View3>('form');
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');

  const minutes = time ? toMinutes(time) : null;
  const timeOutOfHours =
    minutes !== null && (minutes < EARLIEST || minutes > LATEST);

  const today = new Date();
  const minDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
  );
  const maxDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + DAYS_AHEAD,
  );

  const close = () => {
    setView('form');
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={close}>
      {view === 'date' ? (
        <CalendarPicker
          title={t.selectDate}
          selected={date}
          minDate={minDate}
          maxDate={maxDate}
          onSelect={picked => {
            setDate(picked);
            setView('form');
          }}
        />
      ) : view === 'time' ? (
        <TimePicker
          title={t.selectTime}
          value={time || '10:00AM'}
          onDone={picked => {
            setTime(picked);
            setView('form');
          }}
        />
      ) : (
        <View>
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.intro}>{t.intro}</Text>

          <View style={styles.fields}>
            <InputField
              label={t.dateLabel}
              required
              placeholder={t.datePlaceholder}
              value={date ? formatDate(date) : ''}
              onChangeText={() => undefined}
              onPress={() => setView('date')}
              rightElement={<CalendarIcon />}
            />
            <InputField
              label={t.timeLabel}
              required
              placeholder={t.timePlaceholder}
              value={time}
              onChangeText={() => undefined}
              onPress={() => setView('time')}
              rightElement={<ClockIcon />}
              error={timeOutOfHours ? t.timeWindow : undefined}
            />
          </View>

          <GradientButton
            title={t.submit}
            disabled={!date || !time || timeOutOfHours}
            onPress={() => {
              if (date && time) {
                onSubmit(date, time);
                setDate(null);
                setTime('');
              }
            }}
            style={styles.button}
          />
        </View>
      )}
    </BottomSheet>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    title: {
      fontSize: normalizeFont(18),
      lineHeight: normalizeFont(24),
      fontFamily: fonts.bold,
      color: colors.textStrong,
    },
    intro: {
      marginTop: verticalScale(8),
      fontSize: normalizeFont(12),
      lineHeight: normalizeFont(18),
      fontFamily: fonts.regular,
      color: colors.bodyText,
    },
    fields: {
      marginTop: verticalScale(20),
      gap: verticalScale(4),
    },
    // Figma: Submit well below the fields.
    button: {
      marginTop: verticalScale(150),
    },
  }),
);

export default InstallationSheet;
