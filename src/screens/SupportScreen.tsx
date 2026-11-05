import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

import DashboardHeader from '../components/DashboardHeader';
import BottomNavigation, { TabName } from '../components/BottomNavigation';

type Props = {
  navigation: {
    navigate: (screen: string) => void;
  };
};

const SupportScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<TabName>('Support');

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
    navigation.navigate(tab);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header */}
      <DashboardHeader userName="Ramkumar" />

      {/* Main Scroll Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Support Title Section */}
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
              <Icon name="alert-circle" size={20} color="#1F2937" />
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
              size={16}
              color="#2563EB"
              style={styles.arrowIcon}
            />
          </Pressable>
        </View>

        {/* 2. Installation Request Card */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <View style={styles.iconContainer}>
              <Icon name="monitor" size={20} color="#1F2937" />
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
              size={16}
              color="#2563EB"
              style={styles.arrowIcon}
            />
          </Pressable>
        </View>

        {/* 3. Recent Requests Section (Clean flat layout matching Figma) */}
        <View style={styles.recentRequestsSection}>
          <View style={styles.recentRequestsHeader}>
            <Text style={styles.sectionHeading}>Recent Requests</Text>
            <Pressable>
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
            size={24}
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
              size={16}
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 90,
    alignItems: 'center',
  },
  headerTitleSection: {
    width: 328,
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  card: {
    width: 328,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTopRow: {
    marginBottom: 10,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 18,
  },
  actionLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
    marginRight: 4,
  },
  arrowIcon: {
    marginTop: 1,
  },
  recentRequestsSection: {
    width: 328,
    marginBottom: 16,
  },
  recentRequestsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  requestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  requestInfo: {
    flex: 1,
    paddingRight: 8,
  },
  requestTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  requestTicketMeta: {
    fontSize: 11,
    color: '#6B7280',
  },
  statusInProgress: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
  },
  statusResolved: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
  },
  assistanceCard: {
    width: 328,
    backgroundColor: '#475569',
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  assistanceIcon: {
    marginBottom: 10,
  },
  assistanceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  assistanceDescription: {
    fontSize: 12,
    color: '#CBD5E1',
    marginBottom: 14,
    lineHeight: 16,
  },
  assistanceButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assistanceButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 6,
  },
});

export default SupportScreen;
