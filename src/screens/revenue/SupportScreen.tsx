import React, { useEffect, useRef, useState } from 'react';
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
import ComplaintSheet from '../../components/support/ComplaintSheet';
import InstallationSheet from '../../components/support/InstallationSheet';
import { formatDate } from '../../components/shared/CalendarPicker';
import StatusSheet, {
  type SheetStatus,
} from '../../components/shared/StatusSheet';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import type { TabScreenProps } from '../../navigation/types';
import colors from '../../theme/colors';
import { statusBarStyle } from '../../theme/appearance';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';
import { sampleSupportRequests } from '../../constants/mockData';
import { themedStyles } from '../../theme/themedStyles';

const SUBMIT_MS = 1100;
const SUCCESS_MS = 1600;
/** Let the form sheet slide away before the status sheet opens. */
const SHEET_SWAP_MS = 350;

const SupportScreen: React.FC<TabScreenProps<'Support'>> = () => {
  const [complaintOpen, setComplaintOpen] = useState(false);
  const [installationOpen, setInstallationOpen] = useState(false);
  const [statusVisible, setStatusVisible] = useState(false);
  // What the status sheet says while loading / after success.
  const [statusText, setStatusText] = useState({
    loadingTitle: '',
    loadingMessage: '',
    doneTitle: '',
    doneMessage: '',
  });
  const [status, setStatus] = useState<SheetStatus>('loading');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  /** Shared "loading → success" sheet after a form is sent. */
  const showStatus = (text: typeof statusText) => {
    setStatusText(text);
    const later = (fn: () => void, ms: number) =>
      timers.current.push(setTimeout(fn, ms));
    later(() => {
      setStatus('loading');
      setStatusVisible(true);
    }, SHEET_SWAP_MS);
    later(() => setStatus('success'), SHEET_SWAP_MS + SUBMIT_MS);
    later(
      () => setStatusVisible(false),
      SHEET_SWAP_MS + SUBMIT_MS + SUCCESS_MS,
    );
  };

  // TODO: send to the support API.
  const submitComplaint = (_text: string) => {
    setComplaintOpen(false);
    showStatus({
      loadingTitle: strings.complaint.submitting,
      loadingMessage: strings.complaint.submittingMessage,
      doneTitle: strings.complaint.submitted,
      doneMessage: strings.complaint.submittedMessage,
    });
  };

  // TODO: send to the installation API.
  const submitInstallation = (date: Date, time: string) => {
    setInstallationOpen(false);
    showStatus({
      loadingTitle: strings.installation.submitting,
      loadingMessage: strings.installation.submittingMessage,
      doneTitle: strings.installation.submitted,
      doneMessage: strings.installation.submittedMessage(
        `${formatDate(date)}, ${time}`,
      ),
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={statusBarStyle()} />

      {/* 1. Header with Avatar, Greeting and App Logo */}
      <DashboardHeader />

      {/* Main Scroll Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Title Section */}
        <View style={styles.headerTitleSection}>
          <Text style={styles.mainTitle}>
            {strings.support.howCanWeHelpYou}
          </Text>
          <Text style={styles.subtitle}>
            {strings.support.getAssistanceWithYourAdmetrics}
          </Text>
        </View>

        {/* 1. Raise a Complaint Card */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <View style={styles.iconContainer}>
              <Icon name="alert-circle" size={scale(24)} color={colors.text} />
            </View>
          </View>
          <Text style={styles.cardTitle}>
            {strings.support.raiseAComplaint}
          </Text>
          <Text style={styles.cardDescription}>
            {strings.support.reportDeviceIssuesTvOffline}
          </Text>
          <Pressable
            style={styles.actionLinkRow}
            accessibilityRole="button"
            accessibilityLabel={strings.support.createComplaint}
            onPress={() => setComplaintOpen(true)}
          >
            <Text style={styles.actionLinkText}>
              {strings.support.createComplaint}
            </Text>
            <Icon
              name="arrow-right"
              size={scale(16)}
              color={colors.primary}
              style={styles.arrowIcon}
            />
          </Pressable>
        </View>

        {/* 2. Installation Request Card */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <View style={styles.iconContainer}>
              <Icon name="monitor" size={scale(24)} color={colors.text} />
            </View>
          </View>
          <Text style={styles.cardTitle}>
            {strings.support.installationRequest}
          </Text>
          <Text style={styles.cardDescription}>
            {strings.support.requestNewDeviceInstallationOr}
          </Text>
          <Pressable
            style={styles.actionLinkRow}
            accessibilityRole="button"
            accessibilityLabel={strings.support.requestInstallation}
            onPress={() => setInstallationOpen(true)}
          >
            <Text style={styles.actionLinkText}>
              {strings.support.requestInstallation}
            </Text>
            <Icon
              name="arrow-right"
              size={scale(16)}
              color={colors.primary}
              style={styles.arrowIcon}
            />
          </Pressable>
        </View>

        {/* 3. Recent Requests Section (Clean flat layout matching Figma) */}
        <View style={styles.recentRequestsSection}>
          <View style={styles.recentRequestsHeader}>
            <Text style={styles.sectionHeading}>
              {strings.support.recentRequests}
            </Text>
            <Pressable accessibilityRole="button">
              <Text style={styles.viewAllText}>{strings.common.viewAll}</Text>
            </Pressable>
          </View>

          {sampleSupportRequests.map((request, index) => (
            <View key={`${request.ticket}-${index}`} style={styles.requestItem}>
              <View style={styles.requestInfo}>
                <Text style={styles.requestTitle}>{request.title}</Text>
                <Text style={styles.requestTicketMeta}>
                  {strings.support.ticketLine(request.ticket, request.date)}
                </Text>
              </View>
              <Text
                style={
                  request.resolved
                    ? styles.statusResolved
                    : styles.statusInProgress
                }
              >
                {request.resolved
                  ? strings.support.resolved
                  : strings.support.inProgress}
              </Text>
            </View>
          ))}
        </View>

        {/* 4. Immediate Assistance Dark Banner Card */}
        <View style={styles.assistanceCard}>
          <Text style={styles.assistanceTitle}>
            {strings.support.needImmediateAssistance}
          </Text>
          <Text style={styles.assistanceDescription}>
            {strings.support.contactOurSupportTeamFor}
          </Text>
          <Pressable
            style={styles.assistanceButtonRow}
            accessibilityRole="button"
            accessibilityLabel={strings.support.contactSupport}
          >
            <Text style={styles.assistanceButtonText}>
              {strings.support.contactSupport}
            </Text>
            <Icon
              name="arrow-right"
              size={scale(16)}
              color={colors.onAccent}
              style={styles.arrowIcon}
            />
          </Pressable>
        </View>
      </ScrollView>

      <ComplaintSheet
        visible={complaintOpen}
        onClose={() => setComplaintOpen(false)}
        onSubmit={submitComplaint}
      />
      <InstallationSheet
        visible={installationOpen}
        onClose={() => setInstallationOpen(false)}
        onSubmit={submitInstallation}
      />
      <StatusSheet
        visible={statusVisible}
        status={status}
        title={
          status === 'success' ? statusText.doneTitle : statusText.loadingTitle
        }
        message={
          status === 'success'
            ? statusText.doneMessage
            : statusText.loadingMessage
        }
      />
    </SafeAreaView>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    // White behind the status bar so it matches the white header.
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    scrollView: {
      flex: 1,
      backgroundColor: colors.background,
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
      fontFamily: fonts.semibold,
      color: colors.text,
      marginBottom: scale(8),
    },
    subtitle: {
      fontSize: normalizeFont(12),
      lineHeight: normalizeFont(15),
      color: colors.text,
    },
    // Figma: white card, 1px #DDD border, 6px radius, 16px padding.
    card: {
      backgroundColor: colors.white,
      borderRadius: scale(6),
      borderWidth: 1,
      borderColor: colors.borderLight,
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
      fontFamily: fonts.semibold,
      color: colors.text,
      marginBottom: scale(8),
    },
    cardDescription: {
      fontSize: normalizeFont(12),
      lineHeight: normalizeFont(15),
      color: colors.text,
      marginBottom: scale(16),
    },
    actionLinkRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionLinkText: {
      fontSize: normalizeFont(14),
      fontFamily: fonts.bold,
      color: colors.primary,
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
      fontFamily: fonts.semibold,
      color: colors.text,
    },
    viewAllText: {
      fontSize: normalizeFont(12),
      fontFamily: fonts.semibold,
      color: colors.primary,
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
      fontFamily: fonts.semibold,
      color: colors.text,
      marginBottom: scale(8),
    },
    requestTicketMeta: {
      fontSize: normalizeFont(12),
      color: colors.text,
    },
    statusInProgress: {
      fontSize: normalizeFont(12),
      color: colors.pending,
    },
    statusResolved: {
      fontSize: normalizeFont(12),
      color: colors.green,
    },
    // Figma: dark slate banner, 12px radius.
    assistanceCard: {
      backgroundColor: colors.slate,
      borderRadius: scale(12),
      padding: scale(16),
      marginBottom: verticalScale(12),
    },
    assistanceTitle: {
      fontSize: normalizeFont(14),
      fontFamily: fonts.semibold,
      color: colors.onAccent,
      marginBottom: scale(8),
    },
    assistanceDescription: {
      fontSize: normalizeFont(12),
      color: colors.slateText,
      marginBottom: scale(16),
    },
    assistanceButtonRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    assistanceButtonText: {
      fontSize: normalizeFont(14),
      fontFamily: fonts.bold,
      color: colors.onAccent,
      marginRight: scale(8),
    },
  }),
);

export default SupportScreen;
