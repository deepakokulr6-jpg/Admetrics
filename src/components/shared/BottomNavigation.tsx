import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TabIcon from './TabIcon';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import strings from '../../constants/strings';
import { themedStyles } from '../../theme/themedStyles';

export type TabName = 'Revenue' | 'Clinics' | 'Statement' | 'Support';

type Props = {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
};

const tabs: TabName[] = ['Revenue', 'Clinics', 'Statement', 'Support'];

// Figma: white 56px bar, 24px icons with 10px labels 2px below; the active
// tab is #221E25 with a filled icon, the rest #787878 outlines.
const BottomNavigation: React.FC<Props> = ({ activeTab, onTabPress }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, verticalScale(8)) },
      ]}
    >
      {tabs.map(name => {
        const active = activeTab === name;
        const color = active ? colors.text : colors.mutedText;

        return (
          <TouchableOpacity
            key={name}
            onPress={() => onTabPress(name)}
            accessibilityRole="button"
            accessibilityLabel={strings.tabs[name]}
            accessibilityState={{ selected: active }}
            style={styles.tab}
          >
            <View style={styles.icon}>
              <TabIcon
                name={name}
                active={active}
                color={color}
                size={scale(24)}
              />
            </View>
            <Text style={[styles.label, { color }]}>{strings.tabs[name]}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.white,
      paddingTop: verticalScale(9),
    },
    tab: {
      flex: 1,
      alignItems: 'center',
    },
    icon: {
      width: scale(24),
      height: scale(24),
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      marginTop: verticalScale(2),
      fontSize: normalizeFont(10),
    },
  }),
);

export default BottomNavigation;
