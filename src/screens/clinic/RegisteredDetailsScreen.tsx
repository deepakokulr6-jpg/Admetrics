import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../../components/shared/ScreenHeader';
import EditIcon from '../../../assets/images/figma/edit.svg';
import ClinicSummary, {
  type ClinicSummaryData,
} from '../../components/clinic/ClinicSummary';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import type { AppScreenProps } from '../../navigation/types';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';
import {
  sampleClinic,
  sampleContact,
  sampleDisplays,
} from '../../constants/mockData';
import { themedStyles } from '../../theme/themedStyles';
import { createDefaultWorkingHours } from '../../types/clinic';

// Demo data until the API is connected (constants/mockData).
const clinic: ClinicSummaryData = {
  // Demo week (Mon–Sat open, Sunday closed) until the API returns real hours.
  workingHours: createDefaultWorkingHours(),
  name: sampleClinic.clinicName,
  address: sampleClinic.fullAddress,
  medicalRegistrationNumber: sampleClinic.medicalRegistrationNumber,
  establishmentYear: sampleClinic.establishmentYear,
  licenceNumber: sampleClinic.licenceNumber,
  gstNumber: sampleClinic.gstNumber,
  panNumber: sampleClinic.panNumber,
  ...sampleContact,
  photos: [
    require('../../../assets/images/figma/sample_entrance.png'),
    require('../../../assets/images/figma/sample_reception.png'),
  ],
};

const RegisteredDetailsScreen: React.FC<
  AppScreenProps<'RegisteredDetails'>
> = ({ navigation, route }) => {
  const approved = route.params?.approved ?? true;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScreenHeader
        title={strings.registeredDetails.registeredDetails}
        onBackPress={() => navigation.goBack()}
        rightElement={
          <Pressable
            onPress={() => navigation.navigate('EditDetails')}
            hitSlop={10}
            style={styles.editButton}
            accessibilityRole="button"
            accessibilityLabel={strings.registeredDetails.editDetails}
          >
            <EditIcon
              width={scale(19.5)}
              height={scale(19.5)}
              color={colors.textStrong}
            />
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ClinicSummary data={clinic} />

        {/* Displays – only once the clinic is approved */}
        {approved ? (
          <>
            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>
              {strings.registeredDetails.displays}
            </Text>
            {sampleDisplays.map(display => (
              <View key={display.id} style={styles.display}>
                <Text style={styles.displayName}>{display.name}</Text>
                <Text style={styles.displayMeta}>
                  <Text style={display.online ? styles.online : styles.offline}>
                    {display.online
                      ? strings.common.online
                      : strings.common.offline}
                  </Text>
                  {strings.registeredDetails.serialNumber(display.serial)}
                </Text>
              </View>
            ))}
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.white,
    },
    editButton: {
      width: scale(24),
      height: scale(24),
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(24),
      paddingBottom: verticalScale(40),
    },
    sectionTitle: {
      fontSize: normalizeFont(12),
      lineHeight: normalizeFont(15),
      color: colors.text,
      marginBottom: verticalScale(16),
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.borderLight,
      marginTop: verticalScale(4),
      marginBottom: verticalScale(16),
    },
    display: {
      marginBottom: verticalScale(16),
    },
    displayName: {
      fontSize: normalizeFont(14),
      fontFamily: fonts.semibold,
      color: colors.text,
    },
    displayMeta: {
      marginTop: verticalScale(4),
      fontSize: normalizeFont(12),
      color: colors.secondaryText,
    },
    online: {
      fontFamily: fonts.medium,
      color: colors.green,
    },
    offline: {
      fontFamily: fonts.medium,
      color: colors.red,
    },
  }),
);

export default RegisteredDetailsScreen;
