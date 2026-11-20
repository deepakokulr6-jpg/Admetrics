import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';
import strings from '../../constants/strings';

const t = strings.installation;

type Props = {
  title: string;
  selected: Date | null;
  minDate: Date;
  maxDate: Date;
  onSelect: (date: Date) => void;
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/** "Tue, 25 Nov 2026" */
export const formatDate = (date: Date) =>
  `${t.shortWeekdays[date.getDay()]}, ${date.getDate()} ${
    t.shortMonths[date.getMonth()]
  } ${date.getFullYear()}`;

const Arrow = ({ direction }: { direction: 'left' | 'right' }) => (
  <Svg width={scale(18)} height={scale(18)} viewBox="0 0 24 24">
    <Path
      d={direction === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
      stroke={colors.textStrong}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

/**
 * Month calendar; days outside [minDate, maxDate] are greyed and can't be
 * picked. Today is ringed, the picked day is filled blue, the grid is always
 * six rows so the sheet doesn't jump between months. Pure JS.
 */
const CalendarPicker: React.FC<Props> = ({
  title,
  selected,
  minDate,
  maxDate,
  onSelect,
}) => {
  const min = startOfDay(minDate);
  const max = startOfDay(maxDate);
  const today = startOfDay(new Date());
  const [month, setMonth] = useState(() => {
    const base = selected ?? min;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const fade = useRef(new Animated.Value(1)).current;
  useEffect(() => () => fade.stopAnimation(), [fade]);

  // Leading blanks + every day of the month, padded to 6 rows of 7.
  const cells = useMemo(() => {
    const first = month.getDay();
    const days = new Date(
      month.getFullYear(),
      month.getMonth() + 1,
      0,
    ).getDate();
    const list: (Date | null)[] = [
      ...Array.from({ length: first }, () => null),
      ...Array.from(
        { length: days },
        (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1),
      ),
    ];
    while (list.length < 42) {
      list.push(null);
    }
    return list;
  }, [month]);

  const canGoBack = new Date(month.getFullYear(), month.getMonth(), 0) >= min;
  const canGoForward =
    new Date(month.getFullYear(), month.getMonth() + 1, 1) <= max;

  const showMonth = (next: Date) => {
    fade.setValue(0.2);
    setMonth(new Date(next.getFullYear(), next.getMonth(), 1));
    Animated.timing(fade, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };
  const shift = (by: number) =>
    showMonth(new Date(month.getFullYear(), month.getMonth() + by, 1));

  // "Today" shortcut, or the first bookable day when today is out of range.
  const jumpTarget = today < min ? min : today > max ? max : today;
  const onJumpMonth =
    jumpTarget.getFullYear() === month.getFullYear() &&
    jumpTarget.getMonth() === month.getMonth();

  return (
    <View>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        {!onJumpMonth ? (
          <Pressable
            onPress={() => showMonth(jumpTarget)}
            hitSlop={8}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.todayChip,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.todayChipText}>{t.today}</Text>
          </Pressable>
        ) : null}
      </View>

      {/* Big blue readout, as in the time picker. */}
      <Text
        style={[styles.summary, !selected && styles.summaryEmpty]}
        accessibilityLiveRegion="polite"
      >
        {selected ? formatDate(selected) : t.noDateSelected}
      </Text>

      <View style={styles.header}>
        <Pressable
          onPress={() => shift(-1)}
          disabled={!canGoBack}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={t.previousMonth}
          accessibilityState={{ disabled: !canGoBack }}
          style={({ pressed }) => [
            styles.arrow,
            !canGoBack && styles.arrowOff,
            pressed && styles.pressed,
          ]}
        >
          <Arrow direction="left" />
        </Pressable>
        <Text style={styles.month} accessibilityLiveRegion="polite">
          {t.months[month.getMonth()]} {month.getFullYear()}
        </Text>
        <Pressable
          onPress={() => shift(1)}
          disabled={!canGoForward}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={t.nextMonth}
          accessibilityState={{ disabled: !canGoForward }}
          style={({ pressed }) => [
            styles.arrow,
            !canGoForward && styles.arrowOff,
            pressed && styles.pressed,
          ]}
        >
          <Arrow direction="right" />
        </Pressable>
      </View>

      <View style={styles.grid}>
        {t.weekdays.map((day, index) => (
          <Text key={`${day}${index}`} style={[styles.cell, styles.weekday]}>
            {day}
          </Text>
        ))}
      </View>

      <Animated.View style={[styles.grid, { opacity: fade }]}>
        {cells.map((date, index) => {
          if (!date) {
            return <View key={`blank${index}`} style={styles.cell} />;
          }
          const disabled = date < min || date > max;
          const isSelected = selected ? sameDay(date, selected) : false;
          const isToday = sameDay(date, today);
          return (
            <Pressable
              key={date.toISOString()}
              disabled={disabled}
              onPress={() => onSelect(date)}
              accessibilityRole="button"
              accessibilityLabel={
                isToday ? `${t.today}, ${formatDate(date)}` : formatDate(date)
              }
              accessibilityState={{ disabled, selected: isSelected }}
              style={styles.cell}
            >
              {({ pressed }) => (
                <View
                  style={[
                    styles.day,
                    isToday && styles.dayToday,
                    pressed && !isSelected && styles.dayPressed,
                    isSelected && styles.daySelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isToday && styles.dayTextToday,
                      disabled && styles.dayDisabled,
                      isSelected && styles.dayTextSelected,
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </Animated.View>
    </View>
  );
};

const DAY = scale(36);
const ARROW = scale(34);

const styles = themedStyles(() =>
  StyleSheet.create({
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: normalizeFont(18),
      fontFamily: fonts.bold,
      color: colors.textStrong,
    },
    todayChip: {
      paddingHorizontal: scale(12),
      paddingVertical: verticalScale(5),
      borderRadius: scale(14),
      backgroundColor: colors.accentTint,
    },
    todayChipText: {
      fontSize: normalizeFont(12),
      fontFamily: fonts.semibold,
      color: colors.buttonPrimary,
    },
    summary: {
      marginTop: verticalScale(6),
      fontSize: normalizeFont(24),
      lineHeight: normalizeFont(30),
      fontFamily: fonts.bold,
      color: colors.buttonPrimary,
      textAlign: 'center',
    },
    summaryEmpty: {
      fontSize: normalizeFont(16),
      fontFamily: fonts.medium,
      color: colors.mutedText,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: verticalScale(16),
      marginBottom: verticalScale(8),
    },
    arrow: {
      width: ARROW,
      height: ARROW,
      borderRadius: ARROW / 2,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceMuted,
    },
    arrowOff: {
      opacity: 0.3,
    },
    pressed: {
      opacity: 0.6,
    },
    month: {
      fontSize: normalizeFont(16),
      fontFamily: fonts.bold,
      color: colors.textStrong,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    cell: {
      width: `${100 / 7}%`,
      alignItems: 'center',
      justifyContent: 'center',
      height: DAY + verticalScale(6),
    },
    weekday: {
      fontSize: normalizeFont(12),
      fontFamily: fonts.medium,
      color: colors.mutedText,
      textAlign: 'center',
      textAlignVertical: 'center',
      lineHeight: DAY + verticalScale(6),
    },
    day: {
      width: DAY,
      height: DAY,
      borderRadius: DAY / 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayToday: {
      borderWidth: 1.5,
      borderColor: colors.buttonPrimary,
    },
    dayPressed: {
      backgroundColor: colors.surfaceMuted,
    },
    daySelected: {
      borderWidth: 0,
      backgroundColor: colors.accentTint,
    },
    dayText: {
      fontSize: normalizeFont(14),
      fontFamily: fonts.medium,
      color: colors.textStrong,
    },
    dayTextToday: {
      fontFamily: fonts.bold,
      color: colors.buttonPrimary,
    },
    dayDisabled: {
      color: colors.borderLight,
    },
    dayTextSelected: {
      fontFamily: fonts.bold,
      color: colors.buttonPrimary,
    },
  }),
);

export default CalendarPicker;
