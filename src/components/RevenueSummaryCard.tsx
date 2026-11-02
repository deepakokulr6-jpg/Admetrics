import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

type Props = {
  totalRevenue: string;
  growth: string;
  monthlyRevenue: string;
  pendingPayout: string;
};

const RevenueSummaryCard: React.FC<Props> = ({
  totalRevenue,
  growth,
  monthlyRevenue,
  pendingPayout,
}) => {
  return (
    <LinearGradient
      colors={['#1765FF', '#B42FFC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.card}
    >
      <View style={styles.header}>
        <Text style={styles.label}>Total revenue</Text>
        <Icon name="credit-card" size={23} color="#FFFFFF" />
      </View>

      <Text style={styles.total}>{totalRevenue}</Text>

      <View style={styles.growthRow}>
        <Icon name="trending-up" size={10} color="#FFFFFF" />
        <Text style={styles.growth}>{growth}</Text>
        <Text style={styles.growthDescription}>vs. previous month</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.label}>This Month</Text>
          <Text style={styles.amount}>{monthlyRevenue}</Text>
        </View>

        <View style={styles.payout}>
          <Text style={styles.label}>Pending Payout</Text>
          <Text style={styles.amount}>{pendingPayout}</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 12,
    minHeight: 155,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  total: {
    color: '#FFFFFF',
    fontSize: 29,
    fontWeight: '700',
    marginTop: 3,
  },
  growthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.13)',
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 3,
    gap: 3,
  },
  growth: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
  },
  growthDescription: {
    color: '#FFFFFF',
    fontSize: 9,
    marginLeft: 3,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.55)',
    marginVertical: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  payout: {
    alignItems: 'flex-end',
  },
  amount: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },
});

export default RevenueSummaryCard;
