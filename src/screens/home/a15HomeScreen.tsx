import React, { useCallback, useLayoutEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import HomeHeader from '../../components/home/HomeHeader';
import ClinicCard from '../../components/clinic/ClinicCard';
import RegisterClinicButton from '../../components/clinic/RegisterClinicButton';

import { useAuth } from '../../contexts/AuthContext';
import { getClinicRegistrations } from '../../services/clinicService';
import { ClinicRegistrationRecord } from '../../types/clinic';
import type { TabScreenProps } from '../../navigation/types';
import { scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import strings from '../../constants/strings';

const A15HomeScreen: React.FC<TabScreenProps<'Clinics'>> = ({ navigation }) => {
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

  const hasClinics = clinics.length > 0;

  // Figma: no clinics yet → hide the bottom bar until the first registration.
  // It stays hidden during the first load and only appears once clinics
  // exist; on later reloads the previous list is kept, so it never flickers.
  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: hasClinics ? undefined : { display: 'none' },
    });
  }, [navigation, hasClinics]);

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
                    status={strings.a15Home.waitingForApproval}
                    clinicName={record.clinic.clinicName || 'Clinic'}
                    contactName={record.personal.contactPerson || '—'}
                    designation={record.personal.designation || '—'}
                    phone={record.personal.mobile}
                    email={record.personal.email}
                    photoOneUri={record.photos.entrance}
                    photoTwoUri={record.photos.reception}
                    onPress={() => navigation.navigate('RegisteredDetails')}
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
  screenEmpty: {
    backgroundColor: colors.white,
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
