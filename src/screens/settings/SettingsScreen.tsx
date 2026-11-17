import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import ScreenHeader from '../../components/shared/ScreenHeader';
import type { AppScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';

type IconProps = { color: string };

// Outline icons (24px grid, 1.5 stroke) matching the design.
const ICONS: Record<string, React.FC<IconProps>> = {
  appearance: ({ color }) => (
    <Path
      d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinejoin="round"
      fill="none"
    />
  ),
  password: ({ color }) => (
    <>
      <Rect
        x={5}
        y={10.5}
        width={14}
        height={10}
        rx={2.5}
        stroke={color}
        strokeWidth={1.5}
        fill="none"
      />
      <Path
        d="M8 10.5V8a4 4 0 018 0v2.5"
        stroke={color}
        strokeWidth={1.5}
        fill="none"
      />
    </>
  ),
  device: ({ color }) => (
    <>
      <Path
        d="M9.5 19H4a1.5 1.5 0 01-1.5-1.5v-11A1.5 1.5 0 014 5h16a1.5 1.5 0 011.5 1.5v11A1.5 1.5 0 0120 19h-5.5"
        stroke={color}
        strokeWidth={1.5}
        fill="none"
      />
      <Circle
        cx={12}
        cy={19}
        r={2}
        stroke={color}
        strokeWidth={1.5}
        fill="none"
      />
    </>
  ),
  bank: ({ color }) => (
    <Path
      d="M3 9h18M12 3l9 4.5H3L12 3zM5 9v9m4.67-9v9m4.66-9v9M19 9v9M3 18.5h18M2.5 21h19"
      stroke={color}
      strokeWidth={1.5}
      strokeLinejoin="round"
      fill="none"
    />
  ),
  privacy: ({ color }) => (
    <Path
      d="M12 3l7.5 2.5V11c0 4.6-3.2 8.6-7.5 10-4.3-1.4-7.5-5.4-7.5-10V5.5L12 3z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinejoin="round"
      fill="none"
    />
  ),
  about: ({ color }) => (
    <>
      <Circle
        cx={12}
        cy={12}
        r={9.25}
        stroke={color}
        strokeWidth={1.5}
        fill="none"
      />
      <Path
        d="M12 10.5V17"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Circle cx={12} cy={7.5} r={1} fill={color} />
    </>
  ),
};

const ITEMS = [
  { key: 'appearance', label: strings.settings.appearance },
  { key: 'password', label: strings.settings.changePassword },
  { key: 'device', label: strings.settings.addDevice },
  { key: 'bank', label: strings.settings.bankAccountDetails },
  { key: 'privacy', label: strings.settings.privacyPolicy },
  { key: 'about', label: strings.settings.aboutAdmetrics },
] as const;

/** Settings, opened from the side menu. Rows are white cards on the beige page. */
const SettingsScreen: React.FC<AppScreenProps<'Settings'>> = ({
  navigation,
}) => (
  <SafeAreaView style={styles.safeArea} edges={['bottom']}>
    <ScreenHeader
      title={strings.settings.title}
      onBackPress={() => navigation.goBack()}
    />

    <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
      <View style={styles.list}>
        {ITEMS.map(item => {
          const Icon = ICONS[item.key];
          return (
            <Pressable
              key={item.key}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
              ]}
            >
              <Svg width={scale(24)} height={scale(24)} viewBox="0 0 24 24">
                <Icon color={colors.textStrong} />
              </Svg>
              <Text style={styles.label}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  // Rows are 60px white bars separated by 4px beige gaps.
  list: {
    paddingTop: verticalScale(4),
    gap: verticalScale(4),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: verticalScale(60),
    paddingHorizontal: scale(24),
    backgroundColor: colors.white,
  },
  rowPressed: {
    backgroundColor: colors.background,
  },
  label: {
    marginLeft: scale(16),
    fontSize: normalizeFont(14),
    fontFamily: fonts.medium,
    color: colors.textStrong,
  },
});

export default SettingsScreen;
