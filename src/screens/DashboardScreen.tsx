import React from 'react';
import { View, StyleSheet, StatusBar, Alert } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import DashboardHeader from '../components/DashboardHeader';
import RegisterClinicCard from '../components/RegisterClinicCard';

const DashboardScreen: React.FC = () => {
  const handleRegisterClinic = () => {
    // Replace this with navigation to your clinic registration screen.
    Alert.alert('Register Clinic', 'Open the clinic registration screen.');
  };

  const handleProfilePress = () => {
    // Replace this with navigation to your profile screen.
    Alert.alert('Profile', 'Open the profile screen.');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        <DashboardHeader
          userName="Ramkumar"
          onProfilePress={handleProfilePress}
        />

        <View style={styles.content}>
          <RegisterClinicCard
            title="Register Your Clinic"
            onPress={handleRegisterClinic}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});

export default DashboardScreen;
