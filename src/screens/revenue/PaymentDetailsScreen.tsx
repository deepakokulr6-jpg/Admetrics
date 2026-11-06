import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { scale, verticalScale, moderateScale } from '../../utils/responsive';

import ScreenHeader from '../../components/shared/ScreenHeader';
import type { AppScreenProps } from '../../navigation/types';

const PaymentDetailsScreen: React.FC<AppScreenProps<'PaymentDetails'>> = ({
  navigation,
}) => {
  const payoutItems = [
    {
      clinicName: 'Xwell Clinic - Rajajinagar',
      display: 'Display 1 - Reception TV',
      amount: '₹7,565.31',
    },
    {
      clinicName: 'Xwell Clinic - Kamalanagar',
      display: 'Display 1 - Reception TV',
      amount: '₹2,675.90',
    },
  ];

  const totalAmount = '₹19,411.74';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScreenHeader
        title="Payment Details"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Monthly PayOut Statement</Text>
          <Text style={styles.periodText}>PAYMENT PERIOD: OCTOBER 2026</Text>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>PAYMENT PROCESSED</Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.totalsHeader}>TOTAL PAYOUT AMOUNT</Text>

          {payoutItems.map((item, index) => (
            <View key={index} style={styles.payoutItem}>
              <View style={styles.clinicInfo}>
                <Text style={styles.clinicName}>{item.clinicName}</Text>
                <Text style={styles.displayText}>{item.display}</Text>
              </View>
              <Text style={styles.amount}>{item.amount}</Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalAmount}>{totalAmount}</Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Payment Details</Text>

          <View style={styles.paymentDetailRow}>
            <Text style={styles.paymentLabel}>Paid By</Text>
            <Text style={styles.paymentValue}>Okul Techminds</Text>
          </View>

          <View style={[styles.paymentDetailRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.paymentLabel}>Paid To</Text>
            <Text style={styles.paymentValue}>Xwell Clinic</Text>
          </View>

          <View style={[styles.paymentDetailRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.paymentLabel}>Payout Period</Text>
            <Text style={styles.paymentValue}>October 2026</Text>
          </View>

          <View style={[styles.paymentDetailRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.paymentLabel}>Payment Date</Text>
            <Text style={styles.paymentValue}>12 Nov 2026</Text>
          </View>

          <View style={[styles.paymentDetailRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.paymentLabel}>Transaction ID</Text>
            <Text style={styles.paymentValue}>ADM1026001</Text>
          </View>

          <View style={[styles.paymentDetailRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.paymentLabel}>Payment Method</Text>
            <Text style={styles.paymentValue}>Bank Transfer</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  scrollView: {
    flexGrow: 1,
  },

  content: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(40),
    alignItems: 'center',
  },

  sectionContainer: {
    width: '100%',
    maxWidth: scale(328),
    marginBottom: verticalScale(18),
  },

  sectionHeader: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: verticalScale(4),
  },

  periodText: {
    fontSize: moderateScale(12),
    color: '#2563EB',
    fontWeight: '600',
    marginBottom: verticalScale(12),
  },

  statusBadge: {
    width: scale(120),
    height: verticalScale(26),
    backgroundColor: '#DCFCE7',
    borderRadius: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(18),
  },

  statusText: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    color: '#16A34A',
  },

  totalsHeader: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: verticalScale(12),
  },

  payoutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: verticalScale(12),
  },

  clinicInfo: {
    flex: 1,
  },

  clinicName: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: verticalScale(2),
  },

  displayText: {
    fontSize: moderateScale(11),
    color: '#6B7280',
  },

  amount: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#1F2937',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: verticalScale(8),
    paddingTop: verticalScale(8),
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },

  totalLabel: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#1F2937',
  },

  totalAmount: {
    fontSize: moderateScale(18),
    fontWeight: '800',
    color: '#1F2937',
  },

  paymentDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    width: '100%',
  },

  paymentLabel: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#1F2937',
  },

  paymentValue: {
    fontSize: moderateScale(14),
    color: '#6B7280',
    fontWeight: '400',
  },
});

export default PaymentDetailsScreen;
