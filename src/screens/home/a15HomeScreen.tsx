import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import HomeHeader from '../../components/home/HomeHeader';
import ClinicCard from '../../components/clinic/ClinicCard';
import RegisterClinicButton from '../../components/clinic/RegisterClinicButton';
import BottomNavigation, {
  TabName,
} from '../../components/shared/BottomNavigation';

import { useAuth } from '../../contexts/AuthContext';
import { getClinicRegistrations } from '../../services/clinicService';
import { ClinicRegistrationRecord } from '../../types/clinic';

type Props = {
  navigation: {
    navigate: (screen: string) => void;
  };
};

const A15HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<TabName>('Clinics');
  const [clinics, setClinics] = useState<ClinicRegistrationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { width } = useWindowDimensions();
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
        // Already on the Clinics screen.
        break;
      case 'Statement':
        navigation.navigate('Logs');
        break;
      case 'Revenue':
        navigation.navigate('Revenue');
        break;
      case 'Support':
        navigation.navigate('Receipt');
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.screen}>
        <HomeHeader name={user?.name ?? 'Ramkumar'} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            { paddingHorizontal: width * 0.04 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {!isLoading && (
            <View style={styles.clinicList}>
              {clinics.length > 0 ? (
                clinics.map(record => (
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
                ))
              ) : (
                <>
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
                </>
              )}
            </View>
          )}

          <View style={styles.registerContainer}>
            <RegisterClinicButton
              onPress={() => navigation.navigate('RegisterClinic')}
            />
          </View>

          {activeTab !== 'Clinics' && (
            <Text style={styles.tabMessage}>{activeTab} screen</Text>
          )}
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
