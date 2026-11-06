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
import BottomNavigation, { TabName } from '../../navigation/BottomNavigation';
import RevenueSummaryCard from '../../components/revenue/RevenueSummaryCard';
import RevenueChart from '../../components/revenue/RevenueChart';
import RevenuePeriodDropdown from '../../components/revenue/RevenuePeriodDropdown';
import TVDisplaysSection from '../../components/revenue/TVDisplaysSection';
import {
  normalizeFont,
  verticalScale,
  wp,
} from '../../utils/responsive';
import type { AppScreenProps } from '../../navigation/types';

const RevenueScreen: React.FC<AppScreenProps<'Revenue'>> = ({
  navigation,
}) => {
  const [period, setPeriod] = useState('7 days');
  const [activeTab, setActiveTab] = useState<TabName>('Revenue');
  const { width } = useWindowDimensions();

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);

    if (tab === 'Clinics') {
      navigation.navigate('Home');
    } else if (tab === 'Revenue') {
      // Already on the Revenue screen.
    } else if (tab === 'Statement') {
      navigation.navigate('Statement');
    } else if (tab === 'Support') {
      navigation.navigate('Support');
    }
  };

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
              <Text style={styles.chartTitle}>Revenue Generated</Text>
              <RevenuePeriodDropdown
                selectedPeriod={period}
                onSelectPeriod={setPeriod}
              />
            </View>

            <RevenueChart period={period} />
          </View>

          <TVDisplaysSection />
        </ScrollView>

        <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screen: {
    flex: 1,
    backgroundColor: '#F5F4F2',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: wp(4.2),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(24),
  },
  tabletContent: {
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  chartSection: {
    marginTop: verticalScale(16),
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: wp(4.2),
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(12),
  },
  chartTitle: {
    color: '#221E25',
    fontSize: normalizeFont(12),
    fontWeight: '700',
  },
});

export default RevenueScreen;
