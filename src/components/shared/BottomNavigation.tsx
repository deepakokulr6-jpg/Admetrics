import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RevenueIcon from '../../../assets/images/figma/nav_revenue.svg';
import ClinicsIcon from '../../../assets/images/figma/nav_clinics_active.svg';
import StatementIcon from '../../../assets/images/figma/nav_statement.svg';
import SupportIcon from '../../../assets/images/figma/nav_support.svg';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';

export type TabName = 'Revenue' | 'Clinics' | 'Statement' | 'Support';

type Props = {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
};

const tabs: { name: TabName; Icon: typeof RevenueIcon; size: number }[] = [
  { name: 'Revenue', Icon: RevenueIcon, size: 20 },
  { name: 'Clinics', Icon: ClinicsIcon, size: 24 },
  { name: 'Statement', Icon: StatementIcon, size: 24 },
  { name: 'Support', Icon: SupportIcon, size: 24 },
];

const ACTIVE = '#221E25';
const INACTIVE = '#787878';

// Figma: white 56px bar, 24px icons with 10px labels 2px below; the active
// tab is #221E25 and the rest #787878.
const BottomNavigation: React.FC<Props> = ({ activeTab, onTabPress }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, verticalScale(8)) },
      ]}
    >
      {tabs.map(({ name, Icon, size }) => {
        const color = activeTab === name ? ACTIVE : INACTIVE;

        return (
          <TouchableOpacity
            key={name}
            onPress={() => onTabPress(name)}
            accessibilityRole="button"
            accessibilityLabel={name}
            accessibilityState={{ selected: activeTab === name }}
            style={styles.tab}
          >
            <View style={styles.icon}>
              <Icon width={scale(size)} height={scale(size)} color={color} />
            </View>
            <Text style={[styles.label, { color }]}>{name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
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
});

export default BottomNavigation;
