import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type TabName = 'Clinics' | 'Logs' | 'Revenue' | 'Receipt';

type Props = {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
};

const tabs: { name: TabName; label: string; icon: string }[] = [
  { name: 'Clinics', label: 'Clinics', icon: 'business-outline' },
  { name: 'Logs', label: 'Logs', icon: 'list-outline' },
  { name: 'Revenue', label: 'Revenue', icon: 'bar-chart-outline' },
  { name: 'Receipt', label: 'Receipt', icon: 'receipt-outline' },
];

const BottomNavigation: React.FC<Props> = ({ activeTab, onTabPress }) => (
  <View style={styles.container}>
    {tabs.map(t => {
      const isActive = activeTab === t.name;
      return (
        <TouchableOpacity
          key={t.name}
          onPress={() => onTabPress(t.name)}
          accessibilityRole="button"
          accessibilityLabel={t.label}
          style={styles.tab}
        >
          <Ionicons
            name={t.icon as any}
            size={22}
            color={isActive ? '#0265FB' : '#777777'}
          />
          <Text style={[styles.label, isActive && styles.activeLabel]}>
            {t.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    paddingBottom: 8,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  label: {
    fontSize: 10,
    color: '#777777',
  },
  activeLabel: {
    color: '#0265FB',
    fontWeight: '600',
  },
});

export default BottomNavigation;
