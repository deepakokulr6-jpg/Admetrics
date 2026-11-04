// import React, { useState } from 'react';
// import {
//   View,
//   ScrollView,
//   StyleSheet,
//   useWindowDimensions,
//   StatusBar,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// import HomeHeader from '../components/HomeHeader';
// import BottomNavigation from '../components/BottomNavigation';
// import RevenueSummaryCard from '../components/RevenueSummaryCard';
// import RevenueChart from '../components/RevenueChart';
// import RevenuePeriodDropdown from '../components/RevenuePeriodDropdown';
// import TVDisplaysSection from '../components/TVDisplaysSection';

// type TabName = 'Clinics' | 'Logs' | 'Revenue' | 'Receipt';

// type Props = {
//   navigation: {
//     navigate: (screen: string) => void;
//   };
// };

// const RevenueScreen: React.FC<Props> = ({ navigation }) => {
//   const [period, setPeriod] = useState('7 days');
//   const [activeTab, setActiveTab] = useState<TabName>('Revenue');
//   const { width } = useWindowDimensions();

//   const handleTabPress = (tab: TabName) => {
//     setActiveTab(tab);

//     if (tab === 'Clinics') {
//       navigation.navigate('Home');
//     } else if (tab === 'Revenue') {
//       // Already on the Revenue screen.
//     } else if (tab === 'Logs') {
//       navigation.navigate('Logs');
//     } else if (tab === 'Receipt') {
//       navigation.navigate('Receipt');
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
//       <StatusBar barStyle="dark-content" />

//       <View style={styles.screen}>
//         <HomeHeader name="Ramkumar" />

//         <ScrollView
//           style={styles.scrollView}
//           contentContainerStyle={[
//             styles.content,
//             { paddingHorizontal: width * 0.04 },
//           ]}
//           showsVerticalScrollIndicator={false}
//         >
//           <RevenueSummaryCard
//             totalRevenue="₹48,650"
//             growth="12.8%"
//             monthlyRevenue="₹13,580"
//             pendingPayout="₹3,710"
//           />

//           <View style={styles.chartHeader}>
//             <View>
//               <HomeSectionTitle />
//             </View>

//             <RevenuePeriodDropdown value={period} onChange={setPeriod} />
//           </View>

//           <RevenueChart period={period} />

//           <TVDisplaysSection
//             onViewAll={() => navigation.navigate('TVDisplays')}
//           />
//         </ScrollView>

//         <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
//       </View>
//     </SafeAreaView>
//   );
// };

// const HomeSectionTitle = () => {
//   const { Text } = require('react-native');

//   return <Text style={styles.chartTitle}>Revenue overview</Text>;
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   screen: {
//     flex: 1,
//     backgroundColor: '#F5F4F2',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   content: {
//     paddingTop: 14,
//     paddingBottom: 16,
//     flexGrow: 1,
//   },
//   chartHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginTop: 18,
//   },
//   chartTitle: {
//     color: '#221E25',
//     fontSize: 12,
//     fontWeight: '700',
//   },
// });

// export default RevenueScreen;
//============================================================updated code for this screen(1)=========================================================//
// import React, { useState } from 'react';
// import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// import DashboardHeader from '../components/DashboardHeader';
// import BottomNavigation from '../components/BottomNavigation';
// import RevenueSummaryCard from '../components/RevenueSummaryCard';
// import RevenueChart from '../components/RevenueChart';
// import RevenuePeriodDropdown from '../components/RevenuePeriodDropdown';
// import TVDisplaysSection from '../components/TVDisplaysSection';

// type TabName = 'Clinics' | 'Logs' | 'Revenue' | 'Receipt';

// type Props = {
//   navigation: {
//     navigate: (screen: string) => void;
//   };
// };

// const RevenueScreen: React.FC<Props> = ({ navigation }) => {
//   const [period, setPeriod] = useState('7 days');
//   const [activeTab, setActiveTab] = useState<TabName>('Revenue');

//   const handleTabPress = (tab: TabName) => {
//     setActiveTab(tab);

//     if (tab === 'Clinics') {
//       navigation.navigate('Home');
//     } else if (tab === 'Revenue') {
//       // Already on Revenue screen
//     } else if (tab === 'Logs') {
//       navigation.navigate('Logs');
//     } else if (tab === 'Receipt') {
//       navigation.navigate('Receipt');
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
//       <StatusBar barStyle="dark-content" />

//       <View style={styles.screen}>
//         {/* Render DashboardHeader */}
//         <DashboardHeader userName="Ramkumar" />

//         {/* Main Scroll Content */}
//         <ScrollView
//           style={styles.scrollView}
//           contentContainerStyle={styles.contentContainer}
//           showsVerticalScrollIndicator={false}
//         >
//           <RevenueSummaryCard
//             totalRevenue="₹48,650"
//             growth="12.8%"
//             monthlyRevenue="₹13,580"
//             pendingPayout="₹3,710"
//           />

//           <View style={styles.chartHeader}>
//             <Text style={styles.chartTitle}>Revenue overview</Text>
//             <RevenuePeriodDropdown value={period} onChange={setPeriod} />
//           </View>

//           <RevenueChart period={period} />

//           <TVDisplaysSection
//             onViewAll={() => navigation.navigate('TVDisplays')}
//           />
//         </ScrollView>

//         <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   screen: {
//     flex: 1,
//     backgroundColor: '#F8F7F4',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   contentContainer: {
//     paddingHorizontal: 16,
//     paddingTop: 12,
//     paddingBottom: 32,
//     flexGrow: 1,
//   },
//   chartHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginTop: 20,
//     marginBottom: 12,
//   },
//   chartTitle: {
//     color: '#1A1A1A',
//     fontSize: 16,
//     fontWeight: '700',
//     letterSpacing: -0.2,
//   },
// });

// export default RevenueScreen;
//============================================================updated code for this screen(2)=========================================================//
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DashboardHeader from '../components/DashboardHeader';
import BottomNavigation from '../components/BottomNavigation';
import RevenueSummaryCard from '../components/RevenueSummaryCard';
import RevenueChart from '../components/RevenueChart';
import RevenuePeriodDropdown from '../components/RevenuePeriodDropdown';
import TVDisplaysSection from '../components/TVDisplaysSection';

type TabName = 'Clinics' | 'Logs' | 'Revenue' | 'Receipt';

type Props = {
  navigation: {
    navigate: (screen: string) => void;
  };
};

const RevenueScreen: React.FC<Props> = ({ navigation }) => {
  const [period, setPeriod] = useState('7 days');
  const [activeTab, setActiveTab] = useState<TabName>('Revenue');

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
        {/* 1. Gradient Revenue Summary Card */}
        <RevenueSummaryCard
          totalRevenue="₹48,650"
          growth="12.8%"
          monthlyRevenue="₹13,580"
          pendingPayout="₹3,710"
        />

        {/* 2. Revenue Overview Header & Dropdown Filter */}
        <View style={styles.overviewHeaderRow}>
          <Text style={styles.overviewTitle}>Revenue overview</Text>
          <RevenuePeriodDropdown value={period} onChange={setPeriod} />
        </View>

        {/* 3. Revenue Chart Section */}
        <RevenueChart period={period} />

        {/* 4. TV Displays Section (Includes Quick Actions, Display Cards, & Top Banner) */}
        <TVDisplaysSection onViewAll={() => console.log('View All clicked')} />
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
    paddingTop: 8,
    paddingBottom: 24,
    alignItems: 'center',
  },
  overviewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    width: 328,
  },
  overviewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
});

export default RevenueScreen;
