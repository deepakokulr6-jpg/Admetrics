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
};

/**
 * Clinic information · Contact information · Photos, as shown on the
 * Preview (before registering) and Registered Details screens.
 */
const ClinicSummary: React.FC<{ data: ClinicSummaryData }> = ({ data }) => {
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

  const photos = data.photos.filter(
    (source): source is ImageSourcePropType => source !== null,
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
            {photos.map((source, index) => (
              <Image
                key={index}
                source={source}
                style={styles.photo}
                resizeMode="cover"
              />
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
};

export const summaryStyles = StyleSheet.create({
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
});

const styles = StyleSheet.create({
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
  photo: {
    flex: 1,
    height: scale(178),
    borderRadius: scale(8),
  },
});

export default ClinicSummary;
