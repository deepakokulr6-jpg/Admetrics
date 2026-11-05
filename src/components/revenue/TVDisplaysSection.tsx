import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import TvDisplayCard from './TvDisplayCard';
import Icon from 'react-native-vector-icons/Feather';
import { scale, verticalScale, moderateScale } from '../../utils/responsive';

type Props = {
  onViewAll?: () => void;
};

const TVDisplaysSection: React.FC<Props> = ({ onViewAll }) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Your TV displays</Text>

        <Pressable onPress={onViewAll} hitSlop={8}>
          <Text style={styles.viewAllText}>View All</Text>
        </Pressable>
      </View>

      <TvDisplayCard
        title="Reception TV"
        status="Online"
        displayId="Display 01"
        uptime="10 hours 56 minutes"
        revenue="₹18,250"
      />

      <TvDisplayCard
        title="Waiting Hall TV"
        status="Online"
        displayId="Display 02"
        uptime="10 hours 39 minutes"
        revenue="₹14,800"
      />

      <TvDisplayCard
        title="Pharmacy TV"
        status="Offline"
        displayId="Display 03"
        uptime="07 hours 39 minutes"
        revenue="₹6,000"
      />

      <View style={styles.topPerformingCard}>
        <View style={styles.starsRow}>
          <Icon name="star" size={16} color="#F59E0B" />
          <Icon name="star" size={16} color="#F59E0B" />
          <Icon name="star" size={16} color="#F59E0B" />
        </View>

        <Text style={styles.topPerformingTitle}>Top performing display</Text>

        <Text style={styles.topPerformingSubtitle}>
          Reception TV generates the highest revenue
        </Text>

        <View style={styles.progressBarBg}>
          <View style={styles.progressBarFill} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: verticalScale(20),
    width: '100%',
    paddingBottom: verticalScale(16),
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
    width: '100%',
    maxWidth: scale(345),
    alignSelf: 'center',
  },

  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#1F2937',
  },

  viewAllText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: '#2563EB',
  },

  topPerformingCard: {
    width: '100%',
    maxWidth: scale(390),
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: scale(16),
    marginTop: verticalScale(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  starsRow: {
    flexDirection: 'row',
    gap: scale(4),
    marginBottom: verticalScale(6),
  },

  topPerformingTitle: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: verticalScale(2),
  },

  topPerformingSubtitle: {
    fontSize: moderateScale(12),
    color: '#6B7280',
    marginBottom: verticalScale(12),
  },

  progressBarBg: {
    width: '100%',
    height: verticalScale(4),
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    overflow: 'hidden',
  },

  progressBarFill: {
    width: '75%',
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 2,
  },
});

export default TVDisplaysSection;
