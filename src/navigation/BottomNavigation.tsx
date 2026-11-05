import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

export type TabName = 'Revenue' | 'Clinics' | 'Statement' | 'Support';

type Props = {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
};

const tabs: { name: TabName; label: string; icon: string }[] = [
  { name: 'Revenue', label: 'Revenue', icon: '' },
  { name: 'Clinics', label: 'Clinics', icon: '' },
  { name: 'Statement', label: 'Statement', icon: 'book-outline' },
  { name: 'Support', label: 'Support', icon: 'headset-outline' },
];

const BottomNavigation: React.FC<Props> = ({ activeTab, onTabPress }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}
    >
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
            {t.name === 'Revenue' ? (
              <View
                style={[
                  styles.revenueIcon,
                  isActive && styles.revenueIconActive,
                ]}
              >
                <Text
                  style={[
                    styles.revenueText,
                    isActive && styles.revenueTextActive,
                  ]}
                >
                  ₹
                </Text>
              </View>
            ) : t.name === 'Clinics' ? (
              <View
                style={[
                  styles.clinicsIcon,
                  isActive && styles.clinicsIconActive,
                ]}
              >
                <Ionicons
                  name="add-outline"
                  size={18}
                  color={isActive ? '#FFFFFF' : '#777777'}
                />
              </View>
            ) : (
              <Ionicons
                name={t.icon as any}
                size={22}
                color={isActive ? '#0265FB' : '#777777'}
              />
            )}
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {t.label}
            </Text>
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
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
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

  revenueIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#777777',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },

  revenueIconActive: {
    borderColor: '#0265FB',
    backgroundColor: '#0265FB',
  },

  revenueText: {
    fontSize: 12,
    color: '#777777',
    fontWeight: '600',
  },

  revenueTextActive: {
    color: '#FFFFFF',
  },

  clinicsIcon: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#777777',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    transform: [{ rotate: '45deg' }],
  },

  clinicsIconActive: {
    borderColor: '#0265FB',
    backgroundColor: '#0265FB',
  },
});

export default BottomNavigation;
