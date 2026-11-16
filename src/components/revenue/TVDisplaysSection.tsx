import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import TvDisplayCard from './TvDisplayCard';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';

type Props = {
  onViewAll?: () => void;
};

const STAR =
  'M12 2l2.9 6.26 6.85.66-5.16 4.55 1.52 6.71L12 16.77l-6.11 3.41 1.52-6.71L2.25 8.92l6.85-.66z';

const Star: React.FC<{ size: number; lift?: number }> = ({
  size,
  lift = 0,
}) => (
  <Svg
    width={scale(size)}
    height={scale(size)}
    viewBox="0 0 24 24"
    style={{ marginBottom: scale(lift) }}
  >
    <Path d={STAR} fill="#F5BE0B" />
  </Svg>
);

// Figma (Total Revenue): "Your TV displays" 14 semibold + underlined "View All",
// display cards, then the "Top performing display" card with stars and a bar.
const TVDisplaysSection: React.FC<Props> = ({ onViewAll }) => (
  <View style={styles.section}>
    <View style={styles.headerRow}>
      <Text style={styles.title}>Your TV displays</Text>
      <Pressable onPress={onViewAll} hitSlop={8} accessibilityRole="button">
        <Text style={styles.viewAll}>View All</Text>
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

    <View style={styles.topCard}>
      <View style={styles.stars}>
        <Star size={14} />
        <Star size={22} lift={6} />
        <Star size={14} />
      </View>
      <Text style={styles.topTitle}>Top performing display</Text>
      <Text style={styles.topSubtitle}>
        Reception TV generates the highest revenue
      </Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: '34%' }]} />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginTop: verticalScale(24),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  title: {
    fontSize: normalizeFont(14),
    fontWeight: '600',
    color: '#221E25',
  },
  viewAll: {
    fontSize: normalizeFont(12),
    fontWeight: '600',
    color: '#0265FB',
    textDecorationLine: 'underline',
  },
  topCard: {
    marginTop: verticalScale(16),
    backgroundColor: '#FFFFFF',
    borderRadius: scale(8),
    paddingHorizontal: scale(16),
    paddingTop: scale(14),
    paddingBottom: scale(18),
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: scale(4),
  },
  topTitle: {
    fontSize: normalizeFont(14),
    fontWeight: '600',
    color: '#221E25',
  },
  topSubtitle: {
    marginTop: scale(6),
    fontSize: normalizeFont(12),
    color: '#565656',
    marginBottom: scale(10),
  },
  track: {
    height: 2,
    backgroundColor: '#DDDDDD',
    borderRadius: 1,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#14AB00',
  },
});

export default TVDisplaysSection;
