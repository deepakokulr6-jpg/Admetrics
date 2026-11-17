import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import TvDisplayCard from './TvDisplayCard';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';
import { sampleDisplays, sampleTopDisplay } from '../../constants/mockData';
import { themedStyles } from '../../theme/themedStyles';

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
    <Path d={STAR} fill={colors.star} />
  </Svg>
);

// Figma (Total Revenue): "Your TV displays" 14 semibold + underlined "View All",
// display cards, then the "Top performing display" card with stars and a bar.
const TVDisplaysSection: React.FC<Props> = ({ onViewAll }) => (
  <View style={styles.section}>
    <View style={styles.headerRow}>
      <Text style={styles.title}>
        {strings.tvDisplaysSection.yourTvDisplays}
      </Text>
      <Pressable onPress={onViewAll} hitSlop={8} accessibilityRole="button">
        <Text style={styles.viewAll}>{strings.common.viewAll}</Text>
      </Pressable>
    </View>

    {sampleDisplays.map(display => (
      <TvDisplayCard
        key={display.id}
        title={display.name}
        online={display.online}
        displayId={display.id}
        uptime={display.uptime}
        revenue={display.revenue}
      />
    ))}

    <View style={styles.topCard}>
      <View style={styles.stars}>
        <Star size={14} />
        <Star size={22} lift={6} />
        <Star size={14} />
      </View>
      <Text style={styles.topTitle}>
        {strings.tvDisplaysSection.topPerformingDisplay}
      </Text>
      <Text style={styles.topSubtitle}>
        {strings.tvDisplaysSection.generatesHighestRevenue(
          sampleTopDisplay.name,
        )}
      </Text>
      <View style={styles.track}>
        <View
          style={[styles.fill, { width: `${sampleTopDisplay.share * 100}%` }]}
        />
      </View>
    </View>
  </View>
);

const styles = themedStyles(() =>
  StyleSheet.create({
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
      fontFamily: fonts.semibold,
      color: colors.text,
    },
    viewAll: {
      fontSize: normalizeFont(12),
      fontFamily: fonts.semibold,
      color: colors.primary,
      textDecorationLine: 'underline',
    },
    topCard: {
      marginTop: verticalScale(16),
      backgroundColor: colors.white,
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
      fontFamily: fonts.semibold,
      color: colors.text,
    },
    topSubtitle: {
      marginTop: scale(6),
      fontSize: normalizeFont(12),
      color: colors.secondaryText,
      marginBottom: scale(10),
    },
    track: {
      height: 2,
      backgroundColor: colors.borderLight,
      borderRadius: 1,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      backgroundColor: colors.green,
    },
  }),
);

export default TVDisplaysSection;
