import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';
import { normalizeFont, scale } from '../../utils/responsive';
import colors from '../../theme/colors';
import strings from '../../constants/strings';
import { fonts } from '../../theme/typography';

type Props = {
  title: string;
  online: boolean;
  displayId: string;
  uptime: string;
  revenue: string;
};

const GREEN = colors.green;
const RED = colors.red;

// TV outline from the Figma icon, drawn at the size used on this card.
const TvIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={scale(40)} height={scale(33)} viewBox="0 0 23.7 19.55">
    <Rect
      x={0.6}
      y={0.6}
      width={22.5}
      height={16.575}
      rx={1.4}
      stroke={color}
      strokeWidth={1.2}
      fill="none"
    />
    <Circle
      cx={11.85}
      cy={17.18}
      r={1.77}
      fill={colors.white}
      stroke={color}
      strokeWidth={1.2}
    />
  </Svg>
);

// Figma (Total Revenue): white card, 76px tinted icon tile, title 12 semibold,
// "Online · Display 01" 12, uptime 12 #565656, revenue 16 bold on the right.
const TvDisplayCard: React.FC<Props> = ({
  title,
  online,
  displayId,
  uptime,
  revenue,
}) => {
  const isOnline = online;

  return (
    <View style={styles.card}>
      <View
        style={[styles.tile, isOnline ? styles.tileOnline : styles.tileOffline]}
      >
        <TvIcon color={isOnline ? GREEN : RED} />
      </View>

      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          <Text style={isOnline ? styles.online : styles.offline}>
            {isOnline ? strings.common.online : strings.common.offline}
          </Text>
          {` · ${displayId}`}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {uptime}
        </Text>
      </View>

      <Text style={styles.revenue}>{revenue}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: scale(8),
    padding: scale(10),
    marginBottom: scale(16),
  },
  tile: {
    width: scale(72),
    height: scale(72),
    borderRadius: scale(6),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  tileOnline: {
    backgroundColor: colors.successTint,
  },
  tileOffline: {
    backgroundColor: colors.errorTint,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: normalizeFont(12),
    fontFamily: fonts.semibold,
    color: colors.text,
    marginBottom: scale(8),
  },
  meta: {
    fontSize: normalizeFont(12),
    color: colors.secondaryText,
    marginBottom: scale(4),
  },
  online: {
    fontFamily: fonts.medium,
    color: GREEN,
  },
  offline: {
    fontFamily: fonts.medium,
    color: RED,
  },
  revenue: {
    marginLeft: scale(8),
    marginRight: scale(14),
    fontSize: normalizeFont(16),
    fontFamily: fonts.bold,
    color: colors.text,
  },
});

export default TvDisplayCard;
