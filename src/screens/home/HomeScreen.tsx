import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import DashboardHeader from '../../components/home/DashboardHeader';
import RegisterClinicCard from '../../components/clinic/RegisterClinicCard';
import { useAuth } from '../../contexts/AuthContext';
import type { AppScreenProps } from '../../navigation/types';

const HomeScreen: React.FC<AppScreenProps<'Home'>> = ({ navigation }) => {
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of Admetrics?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch {
            Alert.alert(
              'Log Out Failed',
              'Unable to clear your session. Please try again.',
            );
          }
        },
      },
    ]);
  };

  const handleProfilePress = () => {
    Alert.alert(
      'Your Profile',
      user?.email
        ? `Signed in as ${user.email}`
        : 'You are signed in to Admetrics.',
      [
        { text: 'Close', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: handleLogout },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        <DashboardHeader
          userName={user?.name ?? 'User'}
          onProfilePress={handleProfilePress}
        />

        <View style={styles.content}>
          <RegisterClinicCard
            title="Register Your Clinic"
            onPress={() => navigation.navigate('RegisterClinic')}
          />

          <Pressable
            onPress={() => navigation.navigate('A15Home')}
            style={({ pressed }) => [
              styles.homeButton,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Go to Clinic Home"
          >
            <Ionicons name="home-outline" size={18} color="#0265FB" />
            <Text style={styles.homeButtonText}>Go to Clinic Home</Text>
          </Pressable>
        </View>

        <View style={styles.logoutRow}>
          <Pressable
            onPress={handleLogout}
            style={styles.logoutButton}
            accessibilityRole="button"
            accessibilityLabel="Log out"
          >
            <Ionicons name="log-out-outline" size={18} color="#7B35FF" />
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
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
    gap: 24,
  },

  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 24,
  },

  pressed: {
    opacity: 0.7,
  },

  homeButtonText: {
    marginLeft: 6,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: '#0265FB',
  },

  logoutRow: {
    alignItems: 'center',
    paddingBottom: 16,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  logoutText: {
    marginLeft: 6,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: '#7B35FF',
  },
});

export default HomeScreen;
