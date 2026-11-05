import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

import DashboardHeader from '../../components/home/DashboardHeader';
import BottomNavigation, { TabName } from '../../navigation/BottomNavigation';

type Props = {
  navigation: {
    navigate: (screen: string) => void;
  };
};

const StatementScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<TabName>('Statement');

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
    navigation.navigate(tab);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header */}
      <DashboardHeader userName="Ramkumar" />

      {/* Main Scroll Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Section Header */}
        <View style={styles.titleRow}>
          <Text style={styles.screenTitle}>Monthly Payout Statement</Text>
        </View>

        {/* 1. Statement Card - October 2026 (Not Paid) */}
        <View style={styles.statementCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.amountText}>₹7,561.60</Text>
            <View style={styles.actionButton}>
              <Icon name="chevron-right" size={18} color="#4B5563" />
            </View>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.notPaidStatus}>Not Paid</Text>
            <Text style={styles.dotText}> • </Text>
            <Icon name="calendar" size={12} color="#6B7280" />
            <Text style={styles.monthText}> October 2026</Text>
          </View>
        </View>

        {/* 2. Statement Card - September 2026 (Not Paid) */}
        <View style={styles.statementCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.amountText}>₹32,411.74</Text>
            <View style={styles.actionButton}>
              <Icon name="chevron-right" size={18} color="#4B5563" />
            </View>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.notPaidStatus}>Not Paid</Text>
            <Text style={styles.dotText}> • </Text>
            <Icon name="calendar" size={12} color="#6B7280" />
            <Text style={styles.monthText}> September 2026</Text>
          </View>
        </View>

        {/* 3. Statement Card - August 2026 (Paid) */}
        <View style={styles.statementCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.amountText}>₹17,123.00</Text>
            <View style={styles.actionButton}>
              <Icon name="chevron-right" size={18} color="#4B5563" />
            </View>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.paidStatus}>Paid on 12 September 2026</Text>
            <Text style={styles.dotText}> • </Text>
            <Text style={styles.monthText}>August 2026</Text>
          </View>
        </View>

        {/* 4. Statement Card - July 2026 (Paid) */}
        <View style={styles.statementCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.amountText}>₹10,161.60</Text>
            <View style={styles.actionButton}>
              <Icon name="chevron-right" size={18} color="#4B5563" />
            </View>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.paidStatus}>Paid on 12 August 2026</Text>
            <Text style={styles.dotText}> • </Text>
            <Text style={styles.monthText}>July 2026</Text>
          </View>
        </View>

        {/* 5. Statement Card - June 2026 (Paid) */}
        <View style={styles.statementCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.amountText}>₹19,021.17</Text>
            <View style={styles.actionButton}>
              <Icon name="chevron-right" size={18} color="#4B5563" />
            </View>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.paidStatus}>Paid on 10 July 2026</Text>
            <Text style={styles.dotText}> • </Text>
            <Text style={styles.monthText}>June 2026</Text>
          </View>
        </View>

        {/* 6. Statement Card - May 2026 (Paid - Additional Card) */}
        <View style={styles.statementCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.amountText}>₹14,850.50</Text>
            <View style={styles.actionButton}>
              <Icon name="chevron-right" size={18} color="#4B5563" />
            </View>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.paidStatus}>Paid on 10 June 2026</Text>
            <Text style={styles.dotText}> • </Text>
            <Text style={styles.monthText}>May 2026</Text>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
    alignItems: 'center',
  },
  titleRow: {
    width: 328,
    marginBottom: 14,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  statementCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 12,
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
    marginBottom: 8,
  },
  amountText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notPaidStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },
  paidStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
  },
  dotText: {
    color: '#9CA3AF',
    fontSize: 10,
    marginHorizontal: 4,
  },
  monthText: {
    fontSize: 12,
    color: '#6B7280',
  },
});
export default StatementScreen;
