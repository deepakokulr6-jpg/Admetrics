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

// Sample data from the Figma design (Android Large - 21).
const clinic = {
  name: 'Sai Shree Clinic',
  address:
    'No. 27, 2nd Main Road, Near 1st Cross, Indira Nagar, Mysore, Karnataka – 568902',
  fields: [
    ['Medical Registration Number', '195934'],
    ['Establishment Year', '2023'],
    ['Registration/Licence Number', 'KMC/BLR/2026/45892'],
    ['GST Number', '29ABCDE1234F1Z5'],
    ['PAN Number', 'ABCDE1234F'],
  ],
};

const contact = [
  { Icon: PersonIcon, value: 'Shivan' },
  { Icon: IdIcon, value: 'Doctor' },
  { Icon: MobileIcon, value: '9876543210' },
  { Icon: EmailIcon, value: 'shivan@gmail.com' },
];

const displays = [
  { name: 'Reception TV', online: true, id: 'Display 01' },
  { name: 'Waiting Hall TV', online: true, id: 'Display 02' },
  { name: 'Pharmacy TV', online: false, id: 'Display 03' },
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
      title="Registered Details"
      onBackPress={() => navigation.goBack()}
      rightElement={
        <Pressable
          onPress={() => navigation.navigate('EditDetails')}
          hitSlop={10}
          style={styles.editButton}
          accessibilityRole="button"
          accessibilityLabel="Edit details"
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
      <Text style={styles.sectionTitle}>Clinic Information</Text>
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
      <Text style={styles.sectionTitle}>Contact Information</Text>
      {contact.map(({ Icon, value }) => (
        <View key={value} style={styles.contactRow}>
          <Icon width={scale(24)} height={scale(24)} />
          <Text style={styles.contactText}>{value}</Text>
        </View>
      ))}

      <View style={styles.divider} />

      {/* Photos */}
      <Text style={styles.sectionTitle}>Photos</Text>
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
      <Text style={styles.sectionTitle}>Displays</Text>
      {displays.map(display => (
        <View key={display.id} style={styles.display}>
          <Text style={styles.displayName}>{display.name}</Text>
          <Text style={styles.displayMeta}>
            <Text style={display.online ? styles.online : styles.offline}>
              {display.online ? 'Online' : 'Offline'}
            </Text>
            {` · ${display.id}`}
          </Text>
        </View>
      ))}
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    color: '#221E25',
    marginBottom: verticalScale(16),
  },
  clinicName: {
    fontSize: normalizeFont(14),
    lineHeight: normalizeFont(24),
    fontWeight: '700',
    color: '#000000',
  },
  address: {
    marginTop: verticalScale(1),
    fontSize: normalizeFont(14),
    color: '#221E25',
    marginBottom: verticalScale(12),
  },
  field: {
    marginBottom: verticalScale(12),
  },
  fieldLabel: {
    fontSize: normalizeFont(12),
    lineHeight: normalizeFont(24),
    color: '#000000',
  },
  fieldValue: {
    fontSize: normalizeFont(14),
    lineHeight: normalizeFont(24),
    fontWeight: '700',
    color: '#000000',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#DDDDDD',
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
    fontWeight: '600',
    color: '#221E25',
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
    fontWeight: '600',
    color: '#221E25',
  },
  displayMeta: {
    marginTop: verticalScale(4),
    fontSize: normalizeFont(12),
    color: '#565656',
  },
  online: {
    fontWeight: '500',
    color: '#14AB00',
  },
  offline: {
    fontWeight: '500',
    color: '#FF2A2A',
  },
});

export default RegisteredDetailsScreen;
