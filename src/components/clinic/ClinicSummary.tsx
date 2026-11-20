import React from 'react';
import {
  Image,
  type ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import PersonIcon from '../../../assets/images/figma/contact_person.svg';
import IdIcon from '../../../assets/images/figma/contact_id.svg';
import MobileIcon from '../../../assets/images/figma/contact_mobile.svg';
import EmailIcon from '../../../assets/images/figma/contact_email.svg';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';
import { themedStyles } from '../../theme/themedStyles';
import type { WorkingHour } from '../../types/clinic';
import { slotsOf } from '../../utils/workingHours';

export type ClinicSummaryData = {
  name: string;
  address: string;
  medicalRegistrationNumber: string;
  establishmentYear: string;
  licenceNumber: string;
  gstNumber: string;
  panNumber: string;
  contactPerson: string;
  designation: string;
  mobile: string;
  email: string;
  photos: (ImageSourcePropType | null)[];
  /** Shown after the clinic fields when given (Registered Details). */
  workingHours?: WorkingHour[];
};

type SummaryOptions = {
  /** "1. Entrance" / "2. Reception" above the photos (Preview). */
  photoLabels?: boolean;
};

const PHOTO_LABELS: string[] = [
  strings.registerPhoto.n1Entrance,
  strings.registerPhoto.n2Reception,
];

/** "09:30AM - 12:30PM" lines for an open day, "-" when closed. */
const hoursText = (hour: WorkingHour) =>
  hour.enabled
    ? slotsOf(hour)
        .map(slot => `${slot.startTime} - ${slot.endTime}`)
        .join('\n')
    : strings.registeredDetails.closed;

/**
 * Clinic information · Contact information · Photos, as shown on the
 * Preview (before registering) and Registered Details screens.
 */
const ClinicSummary: React.FC<{ data: ClinicSummaryData } & SummaryOptions> = ({
  data,
  photoLabels,
}) => {
  const fields = [
    [
      strings.clinicForm.medicalRegistrationNumber,
      data.medicalRegistrationNumber,
    ],
    [strings.clinicForm.establishmentYear, data.establishmentYear],
    [strings.clinicForm.registrationLicenceNumber, data.licenceNumber],
    [strings.clinicForm.gstNumber, data.gstNumber],
    [strings.clinicForm.panNumber, data.panNumber],
  ].filter(([, value]) => Boolean(value));

  const contact = [
    { key: 'person', Icon: PersonIcon, value: data.contactPerson },
    { key: 'designation', Icon: IdIcon, value: data.designation },
    { key: 'mobile', Icon: MobileIcon, value: data.mobile },
    { key: 'email', Icon: EmailIcon, value: data.email },
  ].filter(item => Boolean(item.value));

  // Keep each photo's slot number for its label.
  const photos = data.photos
    .map((source, index) => ({ source, label: PHOTO_LABELS[index] }))
    .filter(
      (photo): photo is { source: ImageSourcePropType; label: string } =>
        photo.source !== null,
    );

  return (
    <View>
      <Text style={styles.sectionTitle}>
        {strings.common.clinicInformation}
      </Text>
      <Text style={styles.clinicName}>{data.name}</Text>
      {data.address ? <Text style={styles.address}>{data.address}</Text> : null}
      {fields.map(([label, value]) => (
        <View key={label} style={styles.field}>
          <Text style={styles.fieldLabel}>{label}</Text>
          <Text style={styles.fieldValue}>{value}</Text>
        </View>
      ))}

      {data.workingHours ? (
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>
            {strings.registeredDetails.workingHours}
          </Text>
          {data.workingHours.map(hour => (
            <View key={hour.day} style={styles.hoursRow}>
              <Text style={[styles.fieldValue, styles.hoursDay]}>
                {hour.day}
              </Text>
              <Text style={[styles.fieldValue, styles.hoursTime]}>
                {hoursText(hour)}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>
        {strings.common.contactInformation}
      </Text>
      {contact.map(({ key, Icon, value }) => (
        <View key={key} style={styles.contactRow}>
          <Icon width={scale(24)} height={scale(24)} />
          <Text style={styles.contactText}>{value}</Text>
        </View>
      ))}

      {photos.length > 0 ? (
        <>
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>
            {strings.registeredDetails.photos}
          </Text>
          <View style={styles.photoRow}>
            {photos.map(({ source, label }) => (
              <View key={label} style={styles.photoColumn}>
                {photoLabels ? (
                  <Text style={styles.photoLabel}>{label}</Text>
                ) : null}
                <Image
                  source={source}
                  style={styles.photo}
                  resizeMode="cover"
                />
              </View>
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
};

export const summaryStyles = themedStyles(() =>
  StyleSheet.create({
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.borderLight,
      marginTop: verticalScale(4),
      marginBottom: verticalScale(16),
    },
    sectionTitle: {
      fontSize: normalizeFont(12),
      lineHeight: normalizeFont(15),
      color: colors.text,
      marginBottom: verticalScale(16),
    },
  }),
);

const styles = themedStyles(() =>
  StyleSheet.create({
    ...summaryStyles,
    clinicName: {
      fontSize: normalizeFont(14),
      lineHeight: normalizeFont(24),
      fontFamily: fonts.bold,
      color: colors.black,
    },
    address: {
      marginTop: verticalScale(1),
      fontSize: normalizeFont(14),
      color: colors.text,
      marginBottom: verticalScale(12),
    },
    field: {
      marginBottom: verticalScale(12),
    },
    fieldLabel: {
      fontSize: normalizeFont(12),
      lineHeight: normalizeFont(24),
      color: colors.black,
    },
    fieldValue: {
      fontSize: normalizeFont(14),
      lineHeight: normalizeFont(24),
      fontFamily: fonts.bold,
      color: colors.black,
    },
    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      height: verticalScale(24),
      marginBottom: verticalScale(16),
    },
    contactText: {
      marginLeft: scale(12),
      fontSize: normalizeFont(14),
      fontFamily: fonts.semibold,
      color: colors.text,
    },
    photoRow: {
      flexDirection: 'row',
      gap: scale(8),
      marginBottom: verticalScale(16),
    },
    photoColumn: {
      flex: 1,
    },
    photoLabel: {
      marginBottom: verticalScale(8),
      marginLeft: scale(6),
      fontSize: normalizeFont(14),
      fontFamily: fonts.medium,
      color: colors.text,
    },
    // Figma: day in one column, its time(s) lined up in the next.
    hoursRow: {
      flexDirection: 'row',
      marginTop: verticalScale(10),
    },
    hoursDay: {
      width: scale(150),
    },
    hoursTime: {
      flex: 1,
    },
    photo: {
      width: '100%',
      height: scale(178),
      borderRadius: scale(8),
    },
  }),
);

export default ClinicSummary;
