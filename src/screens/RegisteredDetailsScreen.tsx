import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

type Props = {
  navigation: {
    goBack: () => void;
    navigate: (screen: string) => void;
  };
};

const FeatherIconContainer = ({
  name,
  color,
}: {
  name: string;
  color: string;
}) => (
  <View style={styles.iconBox}>
    <Icon name={name} size={18} color={color} />
  </View>
);

const RegisteredDetailsScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={22} color="#1F2937" />
        </Pressable>
        <Text style={styles.headerTitle}>Registered Details</Text>
        <Pressable style={styles.editButton} onPress={() => {}}>
          <Icon name="edit-3" size={18} color="#1F2937" />
        </Pressable>
      </View>

      {/* Main Content Scroll */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Clinic Information Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Clinic Information</Text>

          <View style={styles.clinicInfoBox}>
            <Text style={styles.clinicName}>Sai Shree Clinic</Text>
            <Text style={styles.clinicAddress}>
              No. 27, 2nd Main Road, Near 1st Cross, Indira Nagar, Mysore,
              Karnataka – 568902
            </Text>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Medical Registration Number</Text>
              <Text style={styles.fieldValue}>195934</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Establishment Year</Text>
              <Text style={styles.fieldValue}>2023</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Registration/Licence Number</Text>
              <Text style={styles.fieldValue}>KMC/BLR/2026/45892</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>GST Number</Text>
              <Text style={styles.fieldValue}>29ABCDE1234F1Z5</Text>
            </View>

            <View style={[styles.fieldRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.fieldLabel}>PAN Number</Text>
              <Text style={styles.fieldValue}>ABCDE1234F</Text>
            </View>
          </View>
        </View>

        {/* Contact Information Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Contact Information</Text>

          <View style={styles.contactCard}>
            <View style={styles.contactRow}>
              <FeatherIconContainer name="user" color="#7C3AED" />
              <Text style={styles.contactText}>Shivan</Text>
            </View>

            <View style={styles.contactRow}>
              <FeatherIconContainer name="briefcase" color="#7C3AED" />
              <Text style={styles.contactText}>Doctor</Text>
            </View>

            <View style={styles.contactRow}>
              <FeatherIconContainer name="smartphone" color="#7C3AED" />
              <Text style={styles.contactText}>9876543210</Text>
            </View>

            <View style={[styles.contactRow, { borderBottomWidth: 0 }]}>
              <FeatherIconContainer name="mail" color="#7C3AED" />
              <Text style={styles.contactText}>shivan@gmail.com</Text>
            </View>
          </View>
        </View>

        {/* Photos Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Photos</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.photosScroll}
          >
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&auto=format&fit=crop&q=60',
              }}
              style={styles.photoThumbnail}
            />
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500&auto=format&fit=crop&q=60',
              }}
              style={styles.photoThumbnail}
            />
          </ScrollView>
        </View>

        {/* Displays Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Displays</Text>

          <View style={styles.displayCard}>
            <View style={styles.displayItem}>
              <Text style={styles.displayTitle}>Reception TV</Text>
              <Text style={styles.displayStatusOnline}>
                Online <Text style={styles.dotSeparator}>•</Text>{' '}
                <Text style={styles.displaySubText}>Display 01</Text>
              </Text>
            </View>

            <View style={styles.displayItem}>
              <Text style={styles.displayTitle}>Waiting Hall TV</Text>
              <Text style={styles.displayStatusOnline}>
                Online <Text style={styles.dotSeparator}>•</Text>{' '}
                <Text style={styles.displaySubText}>Display 02</Text>
              </Text>
            </View>

            <View style={[styles.displayItem, { borderBottomWidth: 0 }]}>
              <Text style={styles.displayTitle}>Pharmacy TV</Text>
              <Text style={styles.displayStatusOffline}>
                Offline <Text style={styles.dotSeparator}>•</Text>{' '}
                <Text style={styles.displaySubText}>Display 03</Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  editButton: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  sectionContainer: {
    width: 328,
    marginBottom: 18,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clinicInfoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  clinicAddress: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  fieldRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  fieldLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  photosScroll: {
    flexDirection: 'row',
  },
  photoThumbnail: {
    width: 156,
    height: 105,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  displayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  displayItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  displayTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 3,
  },
  displayStatusOnline: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
  },
  displayStatusOffline: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },
  dotSeparator: {
    color: '#9CA3AF',
  },
  displaySubText: {
    color: '#6B7280',
    fontWeight: '400',
  },
});

export default RegisteredDetailsScreen;
