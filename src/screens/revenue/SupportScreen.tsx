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
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
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
          <Text style={styles.mainTitle}>How can we help you?</Text>
          <Text style={styles.subtitle}>
            Get assistance with your AdMetrics devices, installation and
            technical issues.
          </Text>
        </View>

        {/* 1. Raise a Complaint Card */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <View style={styles.iconContainer}>
              <Icon name="alert-circle" size={scale(24)} color="#221E25" />
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
              color="#0265FB"
              style={styles.arrowIcon}
            />
          </Pressable>
        </View>

        {/* 2. Installation Request Card */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <View style={styles.iconContainer}>
              <Icon name="monitor" size={scale(24)} color="#221E25" />
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
              color="#0265FB"
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
                Ticket #ADM1024 · 02 Nov 2026
              </Text>
            </View>
            <Text style={styles.statusInProgress}>In Progress</Text>
          </View>

          {/* Request Item 2 */}
          <View style={styles.requestItem}>
            <View style={styles.requestInfo}>
              <Text style={styles.requestTitle}>New Device Installation</Text>
              <Text style={styles.requestTicketMeta}>
                Ticket #ADM1021 · 28 Oct 2026
              </Text>
            </View>
            <Text style={styles.statusResolved}>Resolved</Text>
          </View>

          {/* Request Item 3 */}
          <View style={styles.requestItem}>
            <View style={styles.requestInfo}>
              <Text style={styles.requestTitle}>TV Display Not Working</Text>
              <Text style={styles.requestTicketMeta}>
                Ticket #ADM1024 · 02 Nov 2026
              </Text>
            </View>
            <Text style={styles.statusResolved}>Resolved</Text>
          </View>
        </View>

        {/* 4. Immediate Assistance Dark Banner Card */}
        <View style={styles.assistanceCard}>
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
    backgroundColor: '#F5F3EF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(24),
  },
  headerTitleSection: {
    marginBottom: verticalScale(16),
  },
  mainTitle: {
    fontSize: normalizeFont(14),
    fontWeight: '600',
    color: '#221E25',
    marginBottom: scale(8),
  },
  subtitle: {
    fontSize: normalizeFont(12),
    lineHeight: normalizeFont(15),
    color: '#221E25',
  },
  // Figma: white card, 1px #DDD border, 6px radius, 16px padding.
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(6),
    borderWidth: 1,
    borderColor: '#DDDDDD',
    padding: scale(16),
    marginBottom: verticalScale(16),
  },
  cardTopRow: {
    marginBottom: scale(16),
  },
  iconContainer: {
    width: scale(24),
    height: scale(24),
  },
  cardTitle: {
    fontSize: normalizeFont(14),
    fontWeight: '600',
    color: '#221E25',
    marginBottom: scale(8),
  },
  cardDescription: {
    fontSize: normalizeFont(12),
    lineHeight: normalizeFont(15),
    color: '#221E25',
    marginBottom: scale(16),
  },
  actionLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionLinkText: {
    fontSize: normalizeFont(14),
    fontWeight: '700',
    color: '#0265FB',
    marginRight: scale(8),
  },
  arrowIcon: {
    marginTop: 1,
  },
  recentRequestsSection: {
    marginTop: verticalScale(8),
    marginBottom: verticalScale(16),
  },
  recentRequestsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(16),
  },
  sectionHeading: {
    fontSize: normalizeFont(14),
    fontWeight: '600',
    color: '#221E25',
  },
  viewAllText: {
    fontSize: normalizeFont(12),
    fontWeight: '600',
    color: '#0265FB',
    textDecorationLine: 'underline',
  },
  requestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: scale(18),
  },
  requestInfo: {
    flex: 1,
    paddingRight: scale(8),
  },
  requestTitle: {
    fontSize: normalizeFont(12),
    fontWeight: '600',
    color: '#221E25',
    marginBottom: scale(8),
  },
  requestTicketMeta: {
    fontSize: normalizeFont(12),
    color: '#221E25',
  },
  statusInProgress: {
    fontSize: normalizeFont(12),
    color: '#F25C5C',
  },
  statusResolved: {
    fontSize: normalizeFont(12),
    color: '#14AB00',
  },
  // Figma: dark slate banner, 12px radius.
  assistanceCard: {
    backgroundColor: '#4C5263',
    borderRadius: scale(12),
    padding: scale(16),
    marginBottom: verticalScale(12),
  },
  assistanceTitle: {
    fontSize: normalizeFont(14),
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: scale(8),
  },
  assistanceDescription: {
    fontSize: normalizeFont(12),
    color: '#C9CCD3',
    marginBottom: scale(16),
  },
  assistanceButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assistanceButtonText: {
    fontSize: normalizeFont(14),
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: scale(8),
  },
});

export default SupportScreen;
