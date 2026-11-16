import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';
import { normalizeFont, scale } from '../../utils/responsive';

type Props = {
  title: string;
  status: 'Online' | 'Offline';
  displayId: string;
  uptime: string;
  revenue: string;
};

const GREEN = '#14AB00';
const RED = '#FF2A2A';

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
      fill="#FFFFFF"
      stroke={color}
      strokeWidth={1.2}
    />
  </Svg>
);

// Figma (Total Revenue): white card, 76px tinted icon tile, title 12 semibold,
// "Online · Display 01" 12, uptime 12 #565656, revenue 16 bold on the right.
const TvDisplayCard: React.FC<Props> = ({
  title,
  status,
  displayId,
  uptime,
  revenue,
}) => {
  const isOnline = status === 'Online';

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
            {status}
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
    backgroundColor: '#FFFFFF',
    borderRadius: scale(8),
    padding: scale(10),
    marginBottom: scale(16),
  },
  tile: {
    width: scale(76),
    height: scale(76),
    borderRadius: scale(6),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  tileOnline: {
    backgroundColor: '#DDEFDA',
  },
  tileOffline: {
    backgroundColor: '#F4DBDB',
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: normalizeFont(12),
    fontWeight: '600',
    color: '#221E25',
    marginBottom: scale(8),
  },
  meta: {
    fontSize: normalizeFont(12),
    color: '#565656',
    marginBottom: scale(4),
  },
  online: {
    fontWeight: '500',
    color: GREEN,
  },
  offline: {
    fontWeight: '500',
    color: RED,
  },
  revenue: {
    marginLeft: scale(8),
    marginRight: scale(14),
    fontSize: normalizeFont(16),
    fontWeight: '700',
    color: '#221E25',
  },
});

export default TvDisplayCard;
