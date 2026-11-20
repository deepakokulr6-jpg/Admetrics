import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import ScreenHeader from '../../components/shared/ScreenHeader';
import type { AppScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';
import {
  getThemePreference,
  setThemePreference,
  type ThemePreference,
} from '../../theme/appearance';
import { themedStyles } from '../../theme/themedStyles';

type IconProps = { color: string };

// Outline icons (24px grid, 1.5 stroke) matching the design.
const ICONS: Record<string, React.FC<IconProps>> = {
  appearance: ({ color }) => (
    <>
      <Circle
        cx={12}
        cy={12}
        r={4}
        stroke={color}
        strokeWidth={1.5}
        fill="none"
      />
      <Path
        d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </>
  ),
  dark: ({ color }) => (
    <Path
      d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinejoin="round"
      fill="none"
    />
  ),
  system: ({ color }) => (
    <>
      <Rect
        x={7}
        y={3}
        width={10}
        height={18}
        rx={2}
        stroke={color}
        strokeWidth={1.5}
        fill="none"
      />
      <Path
        d="M11 18h2"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </>
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
  { key: 'password', label: strings.settings.privacySecurity },
  { key: 'privacy', label: strings.settings.privacyPolicy },
  { key: 'about', label: strings.settings.aboutAdmetrics },
] as const;

type ThemeChoice = ThemePreference;

const THEME_OPTIONS: { key: ThemeChoice; icon: string; label: string }[] = [
  { key: 'light', icon: 'appearance', label: strings.settings.themeLight },
  { key: 'dark', icon: 'dark', label: strings.settings.themeDark },
  { key: 'system', icon: 'system', label: strings.settings.themeSystem },
];

/** Rows that open another screen. */
const ROUTES: Partial<
  Record<
    (typeof ITEMS)[number]['key'],
    (nav: AppScreenProps<'Settings'>['navigation']) => () => void
  >
> = {
  password: nav => () => nav.navigate('PrivacySecurity'),
};

const RowIcon = ({ name, size }: { name: string; size: number }) => {
  const Icon = ICONS[name];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Icon color={colors.textStrong} />
    </Svg>
  );
};

/** Settings, opened from the side menu. Rows are white cards on the beige page. */
const SettingsScreen: React.FC<AppScreenProps<'Settings'>> = ({
  navigation,
}) => {
  const [theme, setTheme] = useState<ThemeChoice>(getThemePreference);

  // Saved, then the app reloads with the new palette if it changed.
  const chooseTheme = (next: ThemeChoice) => {
    setTheme(next);
    setThemePreference(next);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScreenHeader
        title={strings.settings.title}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {ITEMS.map(item =>
            item.key === 'appearance' ? (
              // Appearance: Light / Dark / Device switch on the right.
              <View key={item.key} style={styles.row}>
                <RowIcon name={item.key} size={scale(24)} />
                <Text style={[styles.label, styles.flex]}>{item.label}</Text>
                <View
                  style={styles.themeOptions}
                  accessibilityRole="radiogroup"
                >
                  {THEME_OPTIONS.map(option => {
                    const selected = theme === option.key;
                    return (
                      <Pressable
                        key={option.key}
                        onPress={() => chooseTheme(option.key)}
                        accessibilityRole="radio"
                        accessibilityLabel={option.label}
                        accessibilityState={{ selected }}
                        style={[
                          styles.themeOption,
                          selected && styles.themeOptionSelected,
                        ]}
                      >
                        <RowIcon name={option.icon} size={scale(20)} />
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : (
              <Pressable
                key={item.key}
                accessibilityRole="button"
                onPress={ROUTES[item.key]?.(navigation)}
                style={({ pressed }) => [
                  styles.row,
                  pressed && styles.rowPressed,
                ]}
              >
                <RowIcon name={item.key} size={scale(24)} />
                <Text style={styles.label}>{item.label}</Text>
              </Pressable>
            ),
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    flex: {
      flex: 1,
    },
    // Rows are 56px white bars separated by thin 2px beige lines.
    list: {
      gap: verticalScale(2),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      height: verticalScale(56),
      paddingHorizontal: scale(24),
      backgroundColor: colors.white,
    },
    rowPressed: {
      backgroundColor: colors.background,
    },
    themeOptions: {
      flexDirection: 'row',
      gap: scale(16),
    },
    // Figma: 32px squares, 8px radius; selected one is white with a dark border.
    themeOption: {
      width: scale(32),
      height: scale(32),
      borderRadius: scale(8),
      borderWidth: 1,
      borderColor: colors.background,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    themeOptionSelected: {
      backgroundColor: colors.white,
      borderColor: colors.textStrong,
    },
    label: {
      marginLeft: scale(16),
      fontSize: normalizeFont(14),
      fontFamily: fonts.medium,
      color: colors.textStrong,
    },
  }),
);

export default SettingsScreen;
