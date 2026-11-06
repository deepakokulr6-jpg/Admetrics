import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ScreenHeader from '../../components/shared/ScreenHeader';
import { scale, verticalScale, moderateScale } from '../../utils/responsive';
import type { AppScreenProps } from '../../navigation/types';

const RegisteredDetailsScreen: React.FC<
  AppScreenProps<'RegisteredDetails'>
> = ({ navigation }) => {
  const clinicName = 'Sai Shree Clinic';
  const contactPerson = 'Shivan';
  const designation = 'Doctor';
  const mobile = '9876543210';
  const email = 'shivan@gmail.com';
  const medicalRegistrationNumber = '195934';
  const establishmentYear = '2023';
  const licenceNumber = 'KMC/BLR/2026/45892';
  const gstNumber = '29ABCDE1234F1Z5';
  const panNumber = 'ABCDE1234F';
  const address = 'No. 27, 2nd Main Road, Near';
  const street = '1st Cross, Indhra Nagar';
  const city = 'Mysore';
  const state = 'Karnataka';
  const pincode = '568902';

  const photoOneUri =
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&auto=format&fit=crop&q=60';
  const photoTwoUri =
    'https://images.unsplash.com/photo-1529097649380-247b7e494f4e?w=500&auto=format&fit=crop&q=60';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Registered Details"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Clinic Information</Text>

          <View style={styles.clinicInfoBox}>
            <Text style={styles.clinicName}>{clinicName}</Text>
            <Text style={styles.clinicAddress}>
              {address}, {street}, {city}, {state} – {pincode}
            </Text>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Medical Registration Number</Text>
              <Text style={styles.fieldValue}>{medicalRegistrationNumber}</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Establishment Year</Text>
              <Text style={styles.fieldValue}>{establishmentYear}</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Registration/Licence Number</Text>
              <Text style={styles.fieldValue}>{licenceNumber}</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>GST Number</Text>
              <Text style={styles.fieldValue}>{gstNumber}</Text>
            </View>

            <View style={[styles.fieldRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.fieldLabel}>PAN Number</Text>
              <Text style={styles.fieldValue}>{panNumber}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Contact Information</Text>

          <View style={styles.contactCard}>
            <View style={styles.contactRow}>
              <Ionicons name="user" size={scale(20)} color="#7C3AED" />
              <Text style={styles.contactText}>{contactPerson}</Text>
            </View>

            <View style={styles.contactRow}>
              <Ionicons name="briefcase" size={scale(20)} color="#7C3AED" />
              <Text style={styles.contactText}>{designation}</Text>
            </View>

            <View style={styles.contactRow}>
              <Ionicons name="smartphone" size={scale(20)} color="#7C3AED" />
              <Text style={styles.contactText}>{mobile}</Text>
            </View>

            <View style={[styles.contactRow, { borderBottomWidth: 0 }]}>
              <Ionicons name="mail" size={scale(20)} color="#7C3AED" />
              <Text style={styles.contactText}>{email}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Photos</Text>

          <View style={styles.photoRow}>
            <TouchableOpacity
              style={styles.photoItem}
              accessibilityRole="button"
              accessibilityLabel="Entrance Photo"
            >
              <Image source={{ uri: photoOneUri }} style={styles.photoImage} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.photoItem}
              accessibilityRole="button"
              accessibilityLabel="Reception Photo"
            >
              <Image source={{ uri: photoTwoUri }} style={styles.photoImage} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Displays</Text>

          <View style={styles.displayCard}>
            <View style={styles.displayItem}>
              <View style={styles.displayLeft}>
                <Text style={styles.displayTitle}>Reception TV</Text>
                <Text style={styles.displayStatus}>
                  <Text style={styles.displayStatusText}>Online</Text>
                  <Text style={styles.dotSeparator}> • </Text>
                  <Text style={styles.displaySubText}>Display 01</Text>
                </Text>
              </View>
            </View>

            <View style={[styles.displayItem, { borderBottomWidth: 0 }]}>
              <View style={styles.displayLeft}>
                <Text style={styles.displayTitle}>Waiting Hall TV</Text>
                <Text style={styles.displayStatus}>
                  <Text style={styles.displayStatusText}>Online</Text>
                  <Text style={styles.dotSeparator}> • </Text>
                  <Text style={styles.displaySubText}>Display 02</Text>
                </Text>
              </View>
            </View>

            <View style={[styles.displayItem, { borderBottomWidth: 0 }]}>
              <View style={styles.displayLeft}>
                <Text style={styles.displayTitle}>Pharmacy TV</Text>
                <Text style={styles.displayStatus}>
                  <Text style={styles.displayStatusText}>Offline</Text>
                  <Text style={styles.dotSeparator}> • </Text>
                  <Text style={styles.displaySubText}>Display 03</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  scrollView: {
    flexGrow: 1,
  },

  content: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(40),
    alignItems: 'center',
  },

  sectionContainer: {
    width: '100%',
    maxWidth: scale(328),
    marginBottom: verticalScale(18),
  },

  sectionHeader: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: verticalScale(8),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  clinicInfoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: scale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  clinicName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: verticalScale(6),
  },

  clinicAddress: {
    fontSize: moderateScale(13),
    color: '#4B5563',
    lineHeight: verticalScale(18),
    marginBottom: verticalScale(14),
    paddingBottom: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  fieldRow: {
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  fieldLabel: {
    fontSize: moderateScale(11),
    color: '#6B7280',
    marginBottom: verticalScale(2),
  },

  fieldValue: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#1F2937',
  },

  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  contactText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#1F2937',
  },

  photoRow: {
    flexDirection: 'row',
    gap: scale(12),
    marginBottom: verticalScale(18),
  },

  photoItem: {
    width: scale(156),
    height: scale(105),
    borderRadius: scale(10),
    backgroundColor: '#E5E7EB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  photoImage: {
    width: scale(156),
    height: scale(105),
    borderRadius: scale(10),
  },

  displayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  displayItem: {
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  displayLeft: {
    flex: 1,
  },

  displayTitle: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: verticalScale(3),
  },

  displayStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  displayStatusText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: '#16A34A',
  },

  dotSeparator: {
    color: '#9CA3AF',
  },

  displaySubText: {
    color: '#6B7280',
    fontSize: moderateScale(12),
    fontWeight: '400',
  },
});

export default RegisteredDetailsScreen;
