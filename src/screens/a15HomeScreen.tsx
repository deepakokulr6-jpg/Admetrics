
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

import HomeHeader from '../components/HomeHeader';
import ClinicCard from '../components/ClinicCard';
import RegisterClinicButton from '../components/RegisterClinicButton';
import BottomNavigation from '../components/BottomNavigation';

type TabName = 'Clinics' | 'Logs' | 'Revenue' | 'Receipt';

type Props = {
  navigation: {
    navigate: (screen: string) => void;
  };
};

const A15HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<TabName>('Clinics');
  const { width } = useWindowDimensions();

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);

    switch (tab) {
      case 'Clinics':
        // Already on the Clinics screen.
        break;
      case 'Logs':
        navigation.navigate('Logs');
        break;
      case 'Revenue':
        navigation.navigate('Revenue');
        break;
      case 'Receipt':
        navigation.navigate('Receipt');
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

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
          <View style={styles.clinicList}>
            <ClinicCard
              status="Waiting for Approval"
              clinicName="Xwell Clinic"
              contactName="Shivan"
              designation="Doctor"
              phone="9876543210"
              email="shivan@gmail.com"
              photoOneColor="#B8C8D4"
              photoTwoColor="#C8C3B8"
            />

            <ClinicCard
              displayCount={3}
              clinicName="Sai Shree Clinic"
              contactName="Shivan"
              designation="Doctor"
              phone="9876543210"
              email="shivan@gmail.com"
              photoOneColor="#D2B7AA"
              photoTwoColor="#C4D0C8"
            />
          </View>

          <View style={styles.registerContainer}>
            <RegisterClinicButton
              onPress={() => navigation.navigate('RegisterClinic')}
            />
          </View>

          {activeTab !== 'Clinics' && (
            <Text style={styles.tabMessage}>
              {activeTab} screen
            </Text>
          )}
        </ScrollView>

        <BottomNavigation
          activeTab={activeTab}
          onTabPress={handleTabPress}
        />
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
    flexGrow: 1,
    paddingTop: 14,
    paddingBottom: 20,
  },
  clinicList: {
    gap: 14,
  },
  registerContainer: {
    flex: 1,
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabMessage: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 13,
    paddingVertical: 15,
  },
});

export default A15HomeScreen;
