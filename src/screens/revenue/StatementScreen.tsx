import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

import DashboardHeader from '../../components/home/DashboardHeader';
import BottomNavigation, {
  TabName,
} from '../../components/shared/BottomNavigation';
import {
  normalizeFont,
  scale,
  verticalScale,
} from '../../utils/responsive';
import type { AppScreenProps } from '../../navigation/types';

const StatementScreen: React.FC<AppScreenProps<'Statement'>> = ({
  navigation,
}) => {
  const [activeTab, setActiveTab] = useState<TabName>('Statement');

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);

    if (tab === 'Clinics') {
      navigation.navigate('Home');
    } else if (tab === 'Statement') {
      // Already on the Statement screen.
    } else if (tab === 'Revenue') {
      navigation.navigate('Revenue');
    } else if (tab === 'Support') {
      navigation.navigate('Support');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {/* 1. Header with Avatar, Greeting and App Logo */}
      <DashboardHeader name="Ramkumar" />

      {/* Main Scroll Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleRow}>
          <Text style={styles.screenTitle}>Monthly Statements</Text>
        </View>

        {/* 1. Statement Card - October 2026 (Not Paid) */}
        <View style={styles.statementCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.amountText}>₹7,561.60</Text>
            <View style={styles.actionButton}>
              <Icon name="chevron-right" size={scale(18)} color="#4B5563" />
            </View>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.notPaidStatus}>Not Paid</Text>
            <Text style={styles.dotText}> • </Text>
            <Icon name="calendar" size={scale(12)} color="#6B7280" />
            <Text style={styles.monthText}> October 2026</Text>
          </View>
        </View>

        {/* 2. Statement Card - September 2026 (Not Paid) */}
        <View style={styles.statementCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.amountText}>₹32,411.74</Text>
            <View style={styles.actionButton}>
              <Icon name="chevron-right" size={scale(18)} color="#4B5563" />
            </View>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.notPaidStatus}>Not Paid</Text>
            <Text style={styles.dotText}> • </Text>
            <Icon name="calendar" size={scale(12)} color="#6B7280" />
            <Text style={styles.monthText}> September 2026</Text>
          </View>
        </View>

        {/* 3. Statement Card - August 2026 (Paid) */}
        <View style={styles.statementCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.amountText}>₹17,123.00</Text>
            <View style={styles.actionButton}>
              <Icon name="chevron-right" size={scale(18)} color="#4B5563" />
            </View>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.paidStatus}>Paid</Text>
            <Text style={styles.dotText}> • </Text>
            <Icon name="calendar" size={scale(12)} color="#6B7280" />
            <Text style={styles.monthText}> August 2026</Text>
          </View>
        </View>

        {/* 4. Statement Card - July 2026 (Paid) */}
        <View style={styles.statementCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.amountText}>₹10,161.60</Text>
            <View style={styles.actionButton}>
              <Icon name="chevron-right" size={scale(18)} color="#4B5563" />
            </View>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.paidStatus}>Paid</Text>
            <Text style={styles.dotText}> • </Text>
            <Icon name="calendar" size={scale(12)} color="#6B7280" />
            <Text style={styles.monthText}> July 2026</Text>
          </View>
        </View>

        {/* 5. Statement Card - June 2026 (Paid) */}
        <View style={styles.statementCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.amountText}>₹19,021.17</Text>
            <View style={styles.actionButton}>
              <Icon name="chevron-right" size={scale(18)} color="#4B5563" />
            </View>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.paidStatus}>Paid</Text>
            <Text style={styles.dotText}> • </Text>
            <Icon name="calendar" size={scale(12)} color="#6B7280" />
            <Text style={styles.monthText}> June 2026</Text>
          </View>
        </View>

        {/* 6. Statement Card - May 2026 (Paid - Additional Card) */}
        <View style={styles.statementCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.amountText}>₹14,850.50</Text>
            <View style={styles.actionButton}>
              <Icon name="chevron-right" size={scale(18)} color="#4B5563" />
            </View>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.paidStatus}>Paid</Text>
            <Text style={styles.dotText}> • </Text>
            <Icon name="calendar" size={scale(12)} color="#6B7280" />
            <Text style={styles.monthText}> May 2026</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(20),
    alignItems: 'center',
  },
  titleRow: {
    width: '100%',
    maxWidth: scale(345),
    marginBottom: verticalScale(14),
  },
  screenTitle: {
    fontSize: normalizeFont(16),
    fontWeight: '700',
    color: '#1F2937',
  },
  statementCard: {
    width: '100%',
    maxWidth: scale(345),
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: scale(16),
    marginBottom: verticalScale(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  amountText: {
    fontSize: normalizeFont(18),
    fontWeight: '700',
    color: '#1F2937',
  },
  actionButton: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notPaidStatus: {
    fontSize: normalizeFont(12),
    fontWeight: '600',
    color: '#DC2626',
  },
  paidStatus: {
    fontSize: normalizeFont(12),
    fontWeight: '600',
    color: '#16A34A',
  },
  dotText: {
    color: '#9CA3AF',
    fontSize: normalizeFont(10),
    marginHorizontal: scale(4),
  },
  monthText: {
    fontSize: normalizeFont(12),
    color: '#6B7280',
  },
});

export default StatementScreen;
