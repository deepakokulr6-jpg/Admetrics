import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../../components/shared/ScreenHeader';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import type { AppScreenProps } from '../../navigation/types';
import colors from '../../theme/colors';
import { statusBarStyle } from '../../theme/appearance';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';
import { samplePayout } from '../../constants/mockData';
import { themedStyles } from '../../theme/themedStyles';

const PaymentDetailsScreen: React.FC<AppScreenProps<'PaymentDetails'>> = ({
  navigation,
  route,
}) => {
  const month = route.params?.month ?? samplePayout.month;
  const paid = route.params?.paid ?? true;

  const details: [string, string][] = [
    [strings.paymentDetails.paidBy, samplePayout.paidBy],
    [strings.paymentDetails.paidTo, samplePayout.paidTo],
    [strings.paymentDetails.payoutPeriod, month],
    [
      strings.paymentDetails.paymentDate,
      route.params?.paidOn ?? samplePayout.paymentDate,
    ],
    [strings.paymentDetails.transactionId, samplePayout.transactionId],
    [strings.paymentDetails.paymentMethod, samplePayout.paymentMethod],
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <StatusBar barStyle={statusBarStyle()} />
      <ScreenHeader
        title={strings.paymentDetails.paymentDetails}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title + status */}
        <View style={styles.titleRow}>
          <View style={styles.flex}>
            <Text style={styles.title}>
              {strings.common.monthlyPayoutStatement}
            </Text>
            <Text style={styles.period}>
              {strings.paymentDetails.paymentPeriod(month)}
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
              {paid
                ? strings.paymentDetails.paymentProcessed
                : strings.common.notPaid}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Breakdown */}
        <Text style={styles.caption}>
          {strings.paymentDetails.totalPayoutAmount}
        </Text>
        {samplePayout.clinics.map(clinic => (
          <View key={clinic.name}>
            <Text style={styles.clinic}>{clinic.name}</Text>
            {clinic.displays.map(({ name: label, amount }) => (
              <View key={label} style={styles.row}>
                <Text style={styles.rowLabel}>{label}</Text>
                <Text style={styles.rowLabel}>{amount}</Text>
              </View>
            ))}
          </View>
        ))}
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>{strings.paymentDetails.total}</Text>
          <Text style={styles.totalValue}>{samplePayout.total}</Text>
        </View>

        <View style={styles.divider} />

        {/* Payment details – shown as "-" until the payout is made */}
        <Text style={[styles.caption, styles.detailsCaption]}>
          {strings.paymentDetails.paymentDetails}
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

const styles = themedStyles(() =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.white,
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
      fontFamily: fonts.semibold,
      color: colors.text,
    },
    period: {
      marginTop: scale(8),
      fontSize: normalizeFont(10),
      color: colors.primary,
    },
    badge: {
      height: scale(20),
      paddingHorizontal: scale(8),
      borderRadius: scale(10),
      justifyContent: 'center',
      marginLeft: scale(8),
    },
    badgePaid: {
      backgroundColor: colors.successBackground,
    },
    badgeUnpaid: {
      backgroundColor: colors.errorBackground,
    },
    badgeText: {
      fontSize: normalizeFont(10),
      fontFamily: fonts.medium,
    },
    paidText: {
      color: colors.green,
    },
    unpaidText: {
      color: colors.red,
    },
    divider: {
      height: 1,
      backgroundColor: colors.borderLight,
      marginVertical: scale(16),
    },
    caption: {
      fontSize: normalizeFont(10),
      color: colors.text,
      marginBottom: scale(10),
    },
    detailsCaption: {
      marginTop: scale(16),
      marginBottom: scale(4),
    },
    clinic: {
      fontSize: normalizeFont(14),
      fontFamily: fonts.semibold,
      color: colors.text,
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
      color: colors.text,
    },
    totalRow: {
      marginTop: scale(2),
    },
    totalLabel: {
      fontSize: normalizeFont(14),
      fontFamily: fonts.semibold,
      color: colors.text,
    },
    totalValue: {
      fontSize: normalizeFont(16),
      fontFamily: fonts.bold,
      color: colors.black,
    },
    detailValue: {
      fontSize: normalizeFont(12),
      fontFamily: fonts.semibold,
      color: colors.black,
    },
    dash: {
      marginRight: scale(40),
    },
  }),
);

export default PaymentDetailsScreen;
