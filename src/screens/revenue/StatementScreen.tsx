import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DashboardHeader from '../../components/home/DashboardHeader';
import BottomNavigation, {
  TabName,
} from '../../components/shared/BottomNavigation';
import CalendarIcon from '../../../assets/images/figma/calendar.svg';
import ArrowCircle from '../../../assets/images/figma/arrow_circle.svg';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import type { AppScreenProps } from '../../navigation/types';

// Sample data from the Figma design (Android Large - 17).
const STATEMENTS: { amount: string; paidOn?: string; month: string }[] = [
  { amount: '₹7,561.60', month: 'October 2026' },
  { amount: '₹32,411.74', month: 'September 2026' },
  { amount: '₹17,123.00', paidOn: '12 September 2026', month: 'August 2026' },
  { amount: '₹10,161.60', paidOn: '12 August 2026', month: 'July 2026' },
  { amount: '₹19,021.17', paidOn: '12 July 2026', month: 'June 2026' },
  { amount: '₹17,571.60', paidOn: '12 June 2026', month: 'May 2026' },
  { amount: '₹32,411.74', paidOn: '12 May 2026', month: 'April 2026' },
  { amount: '₹17,123.00', paidOn: '12 April 2026', month: 'March 2026' },
  { amount: '₹10,161.60', paidOn: '12 March 2026', month: 'February 2026' },
];

const StatementScreen: React.FC<AppScreenProps<'Statement'>> = ({
  navigation,
}) => {
  const [activeTab, setActiveTab] = useState<TabName>('Statement');

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);

    if (tab === 'Clinics') {
      navigation.navigate('Home');
    } else if (tab === 'Revenue') {
      navigation.navigate('Revenue');
    } else if (tab === 'Support') {
      navigation.navigate('Support');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <DashboardHeader name="Ramkumar" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Monthly Payout Statement</Text>

        {STATEMENTS.map(item => (
          <Pressable
            key={item.month}
            style={styles.card}
            accessibilityRole="button"
            onPress={() =>
              navigation.navigate('PaymentDetails', {
                month: item.month,
                paid: Boolean(item.paidOn),
                paidOn: item.paidOn,
              })
            }
          >
            <View style={styles.cardText}>
              <Text style={styles.amount}>{item.amount}</Text>
              {item.paidOn ? (
                <Text style={styles.paid}>Paid on {item.paidOn}</Text>
              ) : (
                <Text style={styles.notPaid}>Not Paid</Text>
              )}
              <View style={styles.monthRow}>
                <CalendarIcon width={scale(16)} height={scale(16)} />
                <Text style={styles.month}>{item.month}</Text>
              </View>
            </View>
            <ArrowCircle width={scale(32)} height={scale(32)} />
          </Pressable>
        ))}
      </ScrollView>

      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

// Figma: #F5F3EF background, 14px semibold title 24 below the header,
// 98px white cards (1px #DDD border, 6px radius) 16px apart.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3EF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(24),
  },
  title: {
    fontSize: normalizeFont(14),
    fontWeight: '600',
    color: '#221E25',
    marginBottom: verticalScale(16),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: scale(98),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: scale(6),
    paddingLeft: scale(16),
    paddingRight: scale(24),
    paddingVertical: scale(16),
    marginBottom: verticalScale(16),
  },
  cardText: {
    flex: 1,
  },
  amount: {
    fontSize: normalizeFont(16),
    fontWeight: '700',
    color: '#221E25',
  },
  paid: {
    marginTop: scale(8),
    fontSize: normalizeFont(12),
    fontWeight: '500',
    color: '#14AB00',
  },
  notPaid: {
    marginTop: scale(8),
    fontSize: normalizeFont(12),
    color: '#FF2A2A',
  },
  monthRow: {
    marginTop: scale(8),
    flexDirection: 'row',
    alignItems: 'center',
  },
  month: {
    marginLeft: scale(8),
    fontSize: normalizeFont(12),
    color: '#565656',
  },
});

export default StatementScreen;
