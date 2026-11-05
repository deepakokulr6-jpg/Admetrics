import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
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

type Props = {
  navigation: {
    navigate: (screen: string) => void;
  };
};

const RevenueScreen: React.FC<Props> = ({ navigation }) => {
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
      navigation.navigate('Logs');
    } else if (tab === 'Support') {
      navigation.navigate('Receipt');
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
            styles.content,
            { paddingHorizontal: width * 0.04 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <RevenueSummaryCard
            totalRevenue="₹48,650"
            growth="12.8%"
            monthlyRevenue="₹13,580"
            pendingPayout="₹3,710"
          />

          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Revenue overview</Text>
            </View>

            <RevenuePeriodDropdown value={period} onChange={setPeriod} />
          </View>

          <RevenueChart period={period} />

          <TVDisplaysSection
            onViewAll={() => navigation.navigate('TVDisplays')}
          />
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
  content: {
    paddingTop: 14,
    paddingBottom: 16,
    flexGrow: 1,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  chartTitle: {
    color: '#221E25',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default RevenueScreen;
