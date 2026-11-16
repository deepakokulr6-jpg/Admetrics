import React, { useCallback, useState } from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import HomeHeader from '../../components/home/HomeHeader';
import ClinicCard from '../../components/clinic/ClinicCard';
import RegisterClinicButton from '../../components/clinic/RegisterClinicButton';
import BottomNavigation, { TabName } from '../../navigation/BottomNavigation';

import { useAuth } from '../../contexts/AuthContext';
import { getClinicRegistrations } from '../../services/clinicService';
import { ClinicRegistrationRecord } from '../../types/clinic';
import type { AppScreenProps } from '../../navigation/types';
import { scale, verticalScale } from '../../utils/responsive';

const A15HomeScreen: React.FC<AppScreenProps<'A15Home'>> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<TabName>('Clinics');
  const [clinics, setClinics] = useState<ClinicRegistrationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();
  const ownerEmail = user?.email;

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      const loadClinics = async () => {
        if (!ownerEmail) {
          if (!cancelled) {
            setClinics([]);
            setIsLoading(false);
          }
          return;
        }

        setIsLoading(true);

        try {
          const records = await getClinicRegistrations(ownerEmail);

          if (!cancelled) {
            setClinics(records);
          }
        } catch (error) {
          console.warn('[A15Home] Clinic load failed', error);

          if (!cancelled) {
            setClinics([]);
          }
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      };

      loadClinics();

      return () => {
        cancelled = true;
      };
    }, [ownerEmail]),
  );

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);

    switch (tab) {
      case 'Clinics':
        navigation.navigate('Home');
        break;
      case 'Statement':
        navigation.navigate('Statement');
        break;
      case 'Revenue':
        navigation.navigate('Revenue');
        break;
      case 'Support':
        navigation.navigate('Support');
        break;
    }
  };

  const hasClinics = clinics.length > 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.screen, !hasClinics && styles.screenEmpty]}>
        <HomeHeader name={user?.name ?? 'Ramkumar'} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            { paddingHorizontal: scale(16) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {hasClinics ? (
            <>
              <View style={styles.clinicList}>
                {clinics.map(record => (
                  <ClinicCard
                    key={record.id}
                    status="Waiting for Approval"
                    clinicName={record.clinic.clinicName || 'Clinic'}
                    contactName={record.personal.contactPerson || '—'}
                    designation={record.personal.designation || '—'}
                    phone={record.personal.mobile}
                    email={record.personal.email}
                    photoOneUri={record.photos.entrance}
                    photoTwoUri={record.photos.reception}
                  />
                ))}
              </View>

              <View style={styles.registerContainer}>
                <RegisterClinicButton
                  onPress={() => navigation.navigate('RegisterClinic')}
                />
              </View>
            </>
          ) : !isLoading ? (
            // Figma (Android Large - 6): no clinics yet → white page with only
            // the centred "Register Your Clinic" button and no bottom nav.
            <View style={styles.emptyState}>
              <RegisterClinicButton
                onPress={() => navigation.navigate('RegisterClinic')}
              />
            </View>
          ) : null}
        </ScrollView>

        {hasClinics ? (
          <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
        ) : null}
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
    backgroundColor: '#F5F3EF',
  },
  screenEmpty: {
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexGrow: 1,
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(20),
  },
  clinicList: {
    gap: verticalScale(16),
  },
  // Figma: the register button sits 80px under the last card.
  registerContainer: {
    marginTop: verticalScale(80),
    alignItems: 'center',
  },
});

export default A15HomeScreen;
