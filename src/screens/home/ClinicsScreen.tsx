import React, { useCallback } from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DashboardHeader from '../../components/home/DashboardHeader';
import ClinicCard from '../../components/clinic/ClinicCard';
import RegisterClinicButton from '../../components/clinic/RegisterClinicButton';
import AppText from '../../components/shared/AppText';
import ClinicIllustration from '../../components/clinic/ClinicIllustration';

import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchClinics } from '../../store/slices/clinicsSlice';
import type { TabScreenProps } from '../../navigation/types';
import { scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import strings from '../../constants/strings';
import { SHOW_DEMO_CLINICS, sampleClinicList } from '../../constants/mockData';

const ClinicsScreen: React.FC<TabScreenProps<'Clinics'>> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const clinics = useAppSelector(state => state.clinics.items);
  // Only the very first load shows nothing; refreshes keep the current list.
  const isLoading = useAppSelector(
    state =>
      state.clinics.status === 'idle' || state.clinics.status === 'loading',
  );

  const { user } = useAuth();
  const ownerEmail = user?.email;

  // Re-read the list whenever the tab is shown (e.g. after registering).
  useFocusEffect(
    useCallback(() => {
      if (ownerEmail) {
        dispatch(fetchClinics(ownerEmail));
      }
    }, [dispatch, ownerEmail]),
  );

  // Your registrations (newest first) are just submitted, so they wait for
  // approval; the demo clinics follow until the API provides real data.
  const cards = [
    ...[...clinics]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(record => ({
        id: record.id,
        clinicName: record.clinic.clinicName || strings.a15Home.unnamedClinic,
        contactName:
          record.personal.contactPerson || strings.common.notProvided,
        designation: record.personal.designation || strings.common.notProvided,
        phone: record.personal.mobile,
        email: record.personal.email,
        photos: [record.photos.entrance, record.photos.reception] as const,
        approved: false,
        displays: undefined as { total: number; online: number } | undefined,
      })),
    ...(SHOW_DEMO_CLINICS ? sampleClinicList : []),
  ];
  const hasClinics = cards.length > 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.screen}>
        <DashboardHeader />

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
                {cards.map(card => (
                  <ClinicCard
                    key={card.id}
                    status={
                      card.approved
                        ? undefined
                        : strings.a15Home.waitingForApproval
                    }
                    displayCount={card.displays?.total}
                    onlineDisplays={card.displays?.online}
                    clinicName={card.clinicName}
                    contactName={card.contactName}
                    designation={card.designation}
                    phone={card.phone}
                    email={card.email}
                    photoOneUri={card.photos[0]}
                    photoTwoUri={card.photos[1]}
                    onPress={() =>
                      navigation.navigate('RegisteredDetails', {
                        approved: card.approved,
                      })
                    }
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
            // Empty state (design "Option 5"): artwork, title, message and
            // a wide register button, centred between header and tab bar.
            <View style={styles.emptyState}>
              <ClinicIllustration />
              <AppText variant="headline" style={styles.emptyTitle}>
                {strings.a15Home.noClinicsTitle}
              </AppText>
              <AppText variant="body" style={styles.emptyMessage}>
                {strings.a15Home.noClinicsMessage}
              </AppText>
              <View style={styles.emptyButton}>
                <RegisterClinicButton
                  onPress={() => navigation.navigate('RegisterClinic')}
                />
              </View>
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
  scrollView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(24),
  },
  emptyTitle: {
    marginTop: verticalScale(20),
    textAlign: 'center',
  },
  emptyMessage: {
    marginTop: verticalScale(8),
    color: colors.bodyText,
    textAlign: 'center',
    lineHeight: verticalScale(20),
    maxWidth: scale(260),
  },
  emptyButton: {
    marginTop: verticalScale(28),
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

export default ClinicsScreen;
