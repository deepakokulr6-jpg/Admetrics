import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../../components/shared/ScreenHeader';
import EditIcon from '../../../assets/images/figma/edit.svg';
import PersonIcon from '../../../assets/images/figma/contact_person.svg';
import IdIcon from '../../../assets/images/figma/contact_id.svg';
import MobileIcon from '../../../assets/images/figma/contact_mobile.svg';
import EmailIcon from '../../../assets/images/figma/contact_email.svg';
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

// Demo data until the API is connected (constants/mockData).
const clinic = {
  name: sampleClinic.clinicName,
  address: sampleClinic.fullAddress,
  fields: [
    [
      strings.clinicForm.medicalRegistrationNumber,
      sampleClinic.medicalRegistrationNumber,
    ],
    [strings.clinicForm.establishmentYear, sampleClinic.establishmentYear],
    [strings.clinicForm.registrationLicenceNumber, sampleClinic.licenceNumber],
    [strings.clinicForm.gstNumber, sampleClinic.gstNumber],
    [strings.clinicForm.panNumber, sampleClinic.panNumber],
  ],
};

const contact = [
  { Icon: PersonIcon, value: sampleContact.contactPerson },
  { Icon: IdIcon, value: sampleContact.designation },
  { Icon: MobileIcon, value: sampleContact.mobile },
  { Icon: EmailIcon, value: sampleContact.email },
];

const photos = [
  require('../../../assets/images/figma/sample_entrance.png'),
  require('../../../assets/images/figma/sample_reception.png'),
];

const RegisteredDetailsScreen: React.FC<
  AppScreenProps<'RegisteredDetails'>
> = ({ navigation }) => (
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
          <EditIcon width={scale(19.5)} height={scale(19.5)} />
        </Pressable>
      }
    />

    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Clinic information */}
      <Text style={styles.sectionTitle}>
        {strings.common.clinicInformation}
      </Text>
      <Text style={styles.clinicName}>{clinic.name}</Text>
      <Text style={styles.address}>{clinic.address}</Text>
      {clinic.fields.map(([label, value]) => (
        <View key={label} style={styles.field}>
          <Text style={styles.fieldLabel}>{label}</Text>
          <Text style={styles.fieldValue}>{value}</Text>
        </View>
      ))}

      <View style={styles.divider} />

      {/* Contact information */}
      <Text style={styles.sectionTitle}>
        {strings.common.contactInformation}
      </Text>
      {contact.map(({ Icon, value }) => (
        <View key={value} style={styles.contactRow}>
          <Icon width={scale(24)} height={scale(24)} />
          <Text style={styles.contactText}>{value}</Text>
        </View>
      ))}

      <View style={styles.divider} />

      {/* Photos */}
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

      <View style={styles.divider} />

      {/* Displays */}
      <Text style={styles.sectionTitle}>
        {strings.registeredDetails.displays}
      </Text>
      {sampleDisplays.map(display => (
        <View key={display.id} style={styles.display}>
          <Text style={styles.displayName}>{display.name}</Text>
          <Text style={styles.displayMeta}>
            <Text style={display.online ? styles.online : styles.offline}>
              {display.online ? strings.common.online : strings.common.offline}
            </Text>
            {strings.registeredDetails.displayId(display.id)}
          </Text>
        </View>
      ))}
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
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
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderLight,
    marginTop: verticalScale(4),
    marginBottom: verticalScale(16),
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
    width: scale(160),
    height: scale(178),
    borderRadius: scale(8),
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
});

export default RegisteredDetailsScreen;
