import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

import DashboardHeader from '../../components/home/DashboardHeader';
import BottomNavigation, {
  TabName,
} from '../../components/shared/BottomNavigation';
import {
  normalizeFont,
  scale,
  verticalScale,
} from '../../utils/responsive';
import type { AppScreenProps } from '../../navigation/types';

const SupportScreen: React.FC<AppScreenProps<'Support'>> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<TabName>('Support');

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);

    if (tab === 'Clinics') {
      navigation.navigate('Home');
    } else if (tab === 'Statement') {
      navigation.navigate('Statement');
    } else if (tab === 'Revenue') {
      navigation.navigate('Revenue');
    } else if (tab === 'Support') {
      // Already on Support screen.
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {/* 1. Header with Avatar, Greeting and App Logo */}
      <DashboardHeader name="Ramkumar" />

      {/* Main Scroll Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Title Section */}
        <View style={styles.headerTitleSection}>
          <Text style={styles.mainTitle}>Need Help?</Text>
          <Text style={styles.subtitle}>
            Get assistance with your Admetrics devices, installation and
            technical issues.
          </Text>
        </View>

        {/* 1. Raise a Complaint Card */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <View style={styles.iconContainer}>
              <Icon name="alert-circle" size={scale(20)} color="#1F2937" />
            </View>
          </View>
          <Text style={styles.cardTitle}>Raise a Complaint</Text>
          <Text style={styles.cardDescription}>
            Report device issues, TV offline status or technical problems.
          </Text>
          <Pressable style={styles.actionLinkRow} accessibilityRole="button">
            <Text style={styles.actionLinkText}>Create Complaint</Text>
            <Icon
              name="arrow-right"
              size={scale(16)}
              color="#2563EB"
              style={styles.arrowIcon}
            />
          </Pressable>
        </View>

        {/* 2. Installation Request Card */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <View style={styles.iconContainer}>
              <Icon name="monitor" size={scale(20)} color="#1F2937" />
            </View>
          </View>
          <Text style={styles.cardTitle}>Installation Request</Text>
          <Text style={styles.cardDescription}>
            Request new device installation or relocation.
          </Text>
          <Pressable style={styles.actionLinkRow} accessibilityRole="button">
            <Text style={styles.actionLinkText}>Request Installation</Text>
            <Icon
              name="arrow-right"
              size={scale(16)}
              color="#2563EB"
              style={styles.arrowIcon}
            />
          </Pressable>
        </View>

        {/* 3. Recent Requests Section (Clean flat layout matching Figma) */}
        <View style={styles.recentRequestsSection}>
          <View style={styles.recentRequestsHeader}>
            <Text style={styles.sectionHeading}>Recent Requests</Text>
            <Pressable accessibilityRole="button">
              <Text style={styles.viewAllText}>View All</Text>
            </Pressable>
          </View>

          {/* Request Item 1 */}
          <View style={styles.requestItem}>
            <View style={styles.requestInfo}>
              <Text style={styles.requestTitle}>TV Display Not Working</Text>
              <Text style={styles.requestTicketMeta}>
                Ticket #ADM1024 • 02 Nov 2026
              </Text>
            </View>
            <Text style={styles.statusInProgress}>In Progress</Text>
          </View>

          {/* Request Item 2 */}
          <View style={styles.requestItem}>
            <View style={styles.requestInfo}>
              <Text style={styles.requestTitle}>New Device Installation</Text>
              <Text style={styles.requestTicketMeta}>
                Ticket #ADM1021 • 28 Oct 2026
              </Text>
            </View>
            <Text style={styles.statusResolved}>Resolved</Text>
          </View>

          {/* Request Item 3 */}
          <View style={styles.requestItem}>
            <View style={styles.requestInfo}>
              <Text style={styles.requestTitle}>TV Display Not Working</Text>
              <Text style={styles.requestTicketMeta}>
                Ticket #ADM1024 • 02 Nov 2026
              </Text>
            </View>
            <Text style={styles.statusResolved}>Resolved</Text>
          </View>
        </View>

        {/* 4. Immediate Assistance Dark Banner Card */}
        <View style={styles.assistanceCard}>
          <Icon
            name="headphones"
            size={scale(24)}
            color="#FFFFFF"
            style={styles.assistanceIcon}
          />
          <Text style={styles.assistanceTitle}>Need immediate assistance?</Text>
          <Text style={styles.assistanceDescription}>
            Contact our support team for additional help.
          </Text>
          <Pressable
            style={styles.assistanceButtonRow}
            accessibilityRole="button"
          >
            <Text style={styles.assistanceButtonText}>Contact Support</Text>
            <Icon
              name="arrow-right"
              size={scale(16)}
              color="#FFFFFF"
              style={styles.arrowIcon}
            />
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(20),
    alignItems: 'center',
  },
  headerTitleSection: {
    width: '100%',
    maxWidth: scale(345),
    marginBottom: verticalScale(16),
  },
  mainTitle: {
    fontSize: normalizeFont(18),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: verticalScale(4),
  },
  subtitle: {
    fontSize: normalizeFont(13),
    color: '#4B5563',
    lineHeight: normalizeFont(18),
  },
  card: {
    width: '100%',
    maxWidth: scale(345),
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: scale(16),
    marginBottom: verticalScale(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTopRow: {
    marginBottom: verticalScale(10),
  },
  iconContainer: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(8),
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: normalizeFont(15),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: verticalScale(4),
  },
  cardDescription: {
    fontSize: normalizeFont(13),
    color: '#6B7280',
    marginBottom: verticalScale(12),
    lineHeight: normalizeFont(18),
  },
  actionLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionLinkText: {
    fontSize: normalizeFont(13),
    fontWeight: '600',
    color: '#2563EB',
    marginRight: scale(4),
  },
  arrowIcon: {
    marginTop: verticalScale(1),
  },
  recentRequestsSection: {
    width: '100%',
    maxWidth: scale(345),
    marginBottom: verticalScale(16),
  },
  recentRequestsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  sectionHeading: {
    fontSize: normalizeFont(15),
    fontWeight: '700',
    color: '#1F2937',
  },
  viewAllText: {
    fontSize: normalizeFont(13),
    fontWeight: '600',
    color: '#2563EB',
  },
  requestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  requestInfo: {
    flex: 1,
    paddingRight: scale(8),
  },
  requestTitle: {
    fontSize: normalizeFont(13),
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: verticalScale(2),
  },
  requestTicketMeta: {
    fontSize: normalizeFont(11),
    color: '#6B7280',
  },
  statusInProgress: {
    fontSize: normalizeFont(12),
    fontWeight: '600',
    color: '#D97706',
  },
  statusResolved: {
    fontSize: normalizeFont(12),
    fontWeight: '600',
    color: '#16A34A',
  },
  assistanceCard: {
    width: '100%',
    maxWidth: scale(345),
    backgroundColor: '#475569',
    borderRadius: scale(14),
    padding: scale(18),
    marginBottom: verticalScale(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  assistanceIcon: {
    marginBottom: verticalScale(10),
  },
  assistanceTitle: {
    fontSize: normalizeFont(15),
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: verticalScale(4),
  },
  assistanceDescription: {
    fontSize: normalizeFont(12),
    color: '#CBD5E1',
    marginBottom: verticalScale(14),
    lineHeight: normalizeFont(16),
  },
  assistanceButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assistanceButtonText: {
    fontSize: normalizeFont(13),
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: scale(6),
  },
});

export default SupportScreen;
