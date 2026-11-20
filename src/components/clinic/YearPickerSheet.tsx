import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import BottomSheet from '../shared/BottomSheet';
import GradientButton from '../shared/GradientButton';
import WheelColumn, { WheelBand } from '../shared/WheelColumn';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';
import strings from '../../constants/strings';

const FIRST_YEAR = 1900;

type Props = {
  visible: boolean;
  selected: string;
  onSelect: (year: string) => void;
  onClose: () => void;
};

type WheelProps = {
  years: string[];
  initial: string;
  onDone: (year: string) => void;
};

/** One year per row on a scroll wheel (same look as the time picker). */
const YearWheel: React.FC<WheelProps> = ({ years, initial, onDone }) => {
  const [index, setIndex] = useState(() => Math.max(0, years.indexOf(initial)));

  return (
    <>
      <Text style={styles.title}>{strings.workingHours.selectYear}</Text>
      <Text style={styles.preview} accessibilityLiveRegion="polite">
        {years[index]}
      </Text>

      <View style={styles.wheel}>
        <WheelBand />
        <WheelColumn
          items={years}
          index={index}
          onChange={setIndex}
          accessibilityLabel={strings.workingHours.selectYear}
        />
      </View>

      <GradientButton
        title={strings.workingHours.done}
        onPress={() => onDone(years[index])}
        style={styles.button}
      />
    </>
  );
};

/**
 * Establishment year: a single-column wheel, newest first (this year back to
 * 1900), opening on the chosen year (or this year). Done confirms.
 */
const YearPickerSheet: React.FC<Props> = ({
  visible,
  selected,
  onSelect,
  onClose,
}) => {
  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: current - FIRST_YEAR + 1 }, (_, i) =>
      String(current - i),
    );
  }, []);

  // Remount on open so the wheel starts from the field's current value.
  const [openCount, setOpenCount] = useState(0);
  useEffect(() => {
    if (visible) {
      setOpenCount(count => count + 1);
    }
  }, [visible]);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <YearWheel
        key={openCount}
        years={years}
        initial={selected || years[0]}
        onDone={year => {
          onSelect(year);
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
    wheel: {
      flexDirection: 'row',
      marginTop: verticalScale(12),
      paddingHorizontal: scale(8),
    },
    button: {
      marginTop: verticalScale(20),
    },
  }),
);

export default YearPickerSheet;
