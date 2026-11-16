import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import HomeHeader from '../../components/home/HomeHeader';
import RevenueSummaryCard from '../../components/revenue/RevenueSummaryCard';
import RevenueChart from '../../components/revenue/RevenueChart';
import RevenuePeriodDropdown from '../../components/revenue/RevenuePeriodDropdown';
import TVDisplaysSection from '../../components/revenue/TVDisplaysSection';
import { normalizeFont, verticalScale, scale } from '../../utils/responsive';
import type { TabScreenProps } from '../../navigation/types';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';

const RevenueScreen: React.FC<TabScreenProps<'Revenue'>> = () => {
  const [period, setPeriod] = useState('7 days');
  const { width } = useWindowDimensions();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.screen}>
        <HomeHeader name="Ramkumar" />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            width > 420 && styles.tabletContent,
          ]}
          showsVerticalScrollIndicator={false}
        >
          <RevenueSummaryCard />

          <View style={styles.chartSection}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>
                {strings.revenue.revenueOverview}
              </Text>
              <RevenuePeriodDropdown
                selectedPeriod={period}
                onSelectPeriod={setPeriod}
              />
            </View>

            <RevenueChart period={period} />
          </View>

          <TVDisplaysSection />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(24),
  },
  tabletContent: {
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  // Figma: title + dropdown sit on the page, the chart is its own white card.
  chartSection: {
    marginTop: verticalScale(24),
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(12),
  },
  chartTitle: {
    color: colors.text,
    fontSize: normalizeFont(14),
    fontFamily: fonts.semibold,
  },
});

export default RevenueScreen;
