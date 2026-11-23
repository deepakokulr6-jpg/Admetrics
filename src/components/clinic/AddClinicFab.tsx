import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';
import strings from '../../constants/strings';

type Props = {
  onPress: () => void;
};

/**
 * Floating "+ Add Clinic" pill, bottom-right over the clinic list (shown once
 * at least one clinic exists; the empty state keeps its big Register button).
 */
const AddClinicFab: React.FC<Props> = ({ onPress }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={strings.a15Home.addClinic}
    hitSlop={6}
    style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
  >
    <Svg width={scale(16)} height={scale(16)} viewBox="0 0 24 24">
      <Path
        d="M12 4v16M4 12h16"
        stroke={colors.onAccent}
        strokeWidth={3}
        strokeLinecap="round"
      />
    </Svg>
    <Text style={styles.label}>{strings.a15Home.addClinic}</Text>
  </Pressable>
);

const styles = themedStyles(() =>
  StyleSheet.create({
    fab: {
      position: 'absolute',
      right: scale(16),
      bottom: verticalScale(20),
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(8),
      paddingHorizontal: scale(20),
      height: verticalScale(48),
      borderRadius: verticalScale(24),
      backgroundColor: colors.buttonPrimary,
      // Soft lift off the list.
      shadowColor: colors.buttonPrimary,
      shadowOpacity: 0.35,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
    },
    pressed: {
      opacity: 0.8,
      transform: [{ scale: 0.97 }],
    },
    label: {
      fontSize: normalizeFont(15),
      fontFamily: fonts.bold,
      color: colors.onAccent,
    },
  }),
);

export default AddClinicFab;
