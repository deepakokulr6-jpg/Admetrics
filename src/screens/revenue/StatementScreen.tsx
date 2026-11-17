import React from 'react';
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
import CalendarIcon from '../../../assets/images/figma/calendar.svg';
import ArrowCircle from '../../../assets/images/figma/arrow_circle.svg';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import type { TabScreenProps } from '../../navigation/types';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';
import { sampleStatements } from '../../constants/mockData';

const StatementScreen: React.FC<TabScreenProps<'Statement'>> = ({
  navigation,
}) => {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <DashboardHeader />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          {strings.common.monthlyPayoutStatement}
        </Text>

        {sampleStatements.map(item => (
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
                <Text style={styles.paid}>
                  {strings.statement.paidOn(item.paidOn)}
                </Text>
              ) : (
                <Text style={styles.notPaid}>{strings.common.notPaid}</Text>
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
    </SafeAreaView>
  );
};

// Figma: #F5F3EF background, 14px semibold title 24 below the header,
// 98px white cards (1px #DDD border, 6px radius) 16px apart.
const styles = StyleSheet.create({
  // White behind the status bar so it matches the white header.
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(24),
  },
  title: {
    fontSize: normalizeFont(14),
    fontFamily: fonts.semibold,
    color: colors.text,
    marginBottom: verticalScale(16),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: scale(98),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
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
    fontFamily: fonts.bold,
    color: colors.text,
  },
  paid: {
    marginTop: scale(8),
    fontSize: normalizeFont(12),
    fontFamily: fonts.medium,
    color: colors.green,
  },
  notPaid: {
    marginTop: scale(8),
    fontSize: normalizeFont(12),
    color: colors.red,
  },
  monthRow: {
    marginTop: scale(8),
    flexDirection: 'row',
    alignItems: 'center',
  },
  month: {
    marginLeft: scale(8),
    fontSize: normalizeFont(12),
    color: colors.secondaryText,
  },
});

export default StatementScreen;
