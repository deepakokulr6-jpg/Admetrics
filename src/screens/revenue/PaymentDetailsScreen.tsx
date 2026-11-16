import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../../components/shared/ScreenHeader';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import type { AppScreenProps } from '../../navigation/types';

// Sample statement from the Figma design (Android Large - 19 / 20).
const CLINICS = [
  {
    name: 'Xwell Clinic - Rajajinagar',
    displays: [
      ['Display 1 - Reception TV', '₹7,565.31'],
      ['Display 2- Waiting Hall TV', '₹3,846.43'],
    ],
  },
  {
    name: 'Xwell Clinic - Kamalanagar',
    displays: [
      ['Display 1 - Reception TV', '₹2,675.90'],
      ['Display 2- Waiting Hall TV', '₹6,212.01'],
    ],
  },
];
const TOTAL = '₹19,411.74';

const PaymentDetailsScreen: React.FC<AppScreenProps<'PaymentDetails'>> = ({
  navigation,
  route,
}) => {
  const month = route.params?.month ?? 'October 2026';
  const paid = route.params?.paid ?? true;

  const details: [string, string][] = [
    ['Paid By', 'Okulr Techminds'],
    ['Paid To', 'Xwell Clinic'],
    ['Payout Period', month],
    ['Payment Date', route.params?.paidOn ?? '12 Nov 2026'],
    ['Transaction ID', 'ADM1026001'],
    ['Payment Method', 'Bank Transfer'],
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader
        title="Payment Details"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title + status */}
        <View style={styles.titleRow}>
          <View style={styles.flex}>
            <Text style={styles.title}>Monthly Payout Statement</Text>
            <Text style={styles.period}>
              PAYMENT PERIOD: {month.toUpperCase()}
            </Text>
          </View>
          <View
            style={[styles.badge, paid ? styles.badgePaid : styles.badgeUnpaid]}
          >
            <Text
              style={[
                styles.badgeText,
                paid ? styles.paidText : styles.unpaidText,
              ]}
            >
              {paid ? 'Payment Processed' : 'Not Paid'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Breakdown */}
        <Text style={styles.caption}>TOTAL PAYOUT AMOUNT</Text>
        {CLINICS.map(clinic => (
          <View key={clinic.name}>
            <Text style={styles.clinic}>{clinic.name}</Text>
            {clinic.displays.map(([label, amount]) => (
              <View key={label} style={styles.row}>
                <Text style={styles.rowLabel}>{label}</Text>
                <Text style={styles.rowLabel}>{amount}</Text>
              </View>
            ))}
          </View>
        ))}
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalValue}>{TOTAL}</Text>
        </View>

        <View style={styles.divider} />

        {/* Payment details – shown as "-" until the payout is made */}
        <Text style={[styles.caption, styles.detailsCaption]}>
          Payment Details
        </Text>
        {details.map(([label, value]) => (
          <View key={label} style={styles.row}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text style={[styles.detailValue, !paid && styles.dash]}>
              {paid ? value : '-'}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(32),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: normalizeFont(14),
    fontWeight: '600',
    color: '#221E25',
  },
  period: {
    marginTop: scale(8),
    fontSize: normalizeFont(10),
    color: '#0265FB',
  },
  badge: {
    height: scale(20),
    paddingHorizontal: scale(8),
    borderRadius: scale(10),
    justifyContent: 'center',
    marginLeft: scale(8),
  },
  badgePaid: {
    backgroundColor: '#DDF0D9',
  },
  badgeUnpaid: {
    backgroundColor: '#F6DADA',
  },
  badgeText: {
    fontSize: normalizeFont(10),
    fontWeight: '500',
  },
  paidText: {
    color: '#14AB00',
  },
  unpaidText: {
    color: '#FF2A2A',
  },
  divider: {
    height: 1,
    backgroundColor: '#DDDDDD',
    marginVertical: scale(16),
  },
  caption: {
    fontSize: normalizeFont(10),
    color: '#221E25',
    marginBottom: scale(10),
  },
  detailsCaption: {
    marginTop: scale(16),
    marginBottom: scale(4),
  },
  clinic: {
    fontSize: normalizeFont(14),
    fontWeight: '600',
    color: '#221E25',
    marginBottom: scale(4),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: scale(31),
  },
  rowLabel: {
    fontSize: normalizeFont(12),
    color: '#221E25',
  },
  totalRow: {
    marginTop: scale(2),
  },
  totalLabel: {
    fontSize: normalizeFont(14),
    fontWeight: '600',
    color: '#221E25',
  },
  totalValue: {
    fontSize: normalizeFont(16),
    fontWeight: '700',
    color: '#000000',
  },
  detailValue: {
    fontSize: normalizeFont(12),
    fontWeight: '600',
    color: '#000000',
  },
  dash: {
    marginRight: scale(40),
  },
});

export default PaymentDetailsScreen;
