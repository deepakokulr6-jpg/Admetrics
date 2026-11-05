import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';

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
      colors={['#1A66FF', '#9E24FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={styles.topLeft}>
          <Text style={styles.label}>Total revenue</Text>
          <Text style={styles.totalValue}>{totalRevenue}</Text>
        </View>

        <View style={styles.walletContainer}>
          <Svg
            width={scale(32)}
            height={scale(32)}
            viewBox="0 0 32 32"
            fill="none"
          >
            <Path
              d="M23.0144 11.7019H27.4374V11.0312C26.7451 8.45188 24.9855 8.4687 22.81 8.49034C22.4519 8.49515 22.1273 8.49755 22.1081 8.49755H5.57446C5.19466 8.49755 4.88696 8.18986 4.88696 7.81005C4.88696 7.43024 5.19466 7.12255 5.57446 7.12255H22.1081C22.5961 7.12255 22.6995 7.12255 22.798 7.12015C24.6586 7.10091 26.2836 7.08409 27.4374 8.17303V7.85813C27.4374 7.0889 27.1225 6.39178 26.6153 5.88457C26.1081 5.37736 25.4086 5.06245 24.6418 5.06245H5.39898C4.62975 5.06245 3.93264 5.37736 3.42542 5.88457C2.91821 6.39178 2.60331 7.0913 2.60331 7.85813V23.8774C2.60331 24.6466 2.91821 25.3437 3.42542 25.8509C3.93264 26.3581 4.63216 26.673 5.39898 26.673H24.6394C25.4086 26.673 26.1057 26.3581 26.6129 25.8509C27.1201 25.3437 27.435 24.6442 27.435 23.8774V21.6033H23.012C21.6778 21.6033 20.4639 21.0576 19.5865 20.1802C18.7091 19.3028 18.1634 18.0889 18.1634 16.7548V16.5456C18.1634 15.2115 18.7091 13.9976 19.5865 13.1201C20.4663 12.2476 21.6778 11.7019 23.0144 11.7019ZM28.81 11.7283C29.3076 11.8028 29.7523 12.0384 30.0913 12.3798C30.5096 12.798 30.7668 13.375 30.7668 14.0096V19.2019C30.7668 19.8653 30.4975 20.4663 30.0624 20.9014C29.7283 21.2355 29.2932 21.4735 28.81 21.5649V23.8798C28.81 25.0264 28.3413 26.0697 27.5865 26.8245C26.8317 27.5793 25.7884 28.048 24.6418 28.048H5.39898C4.25235 28.048 3.20908 27.5793 2.45427 26.8245C1.69946 26.0721 1.23071 25.0288 1.23071 23.8822V7.86053C1.23071 6.7139 1.69946 5.67063 2.45427 4.91582C3.20908 4.16101 4.25235 3.69226 5.39898 3.69226H24.6394C25.786 3.69226 26.8293 4.16101 27.5841 4.91582C28.3389 5.67063 28.8076 6.7139 28.8076 7.86053V11.7283H28.81ZM22.4182 14.7764C23.3918 14.7764 24.1802 15.5649 24.1802 16.5384C24.1802 17.512 23.3918 18.3004 22.4182 18.3004C21.4447 18.3004 20.6562 17.512 20.6562 16.5384C20.6562 15.5649 21.4447 14.7764 22.4182 14.7764Z"
              fill="white"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </Svg>
        </View>
      </View>

      <View style={styles.growthRow}>
        <View style={styles.greenBadge}>
          <Text style={styles.growthArrow}>↗</Text>
          <Text style={styles.growthText}>{growth}</Text>
        </View>
        <Text style={styles.growthSubtext}>vs. previous month</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        <View style={styles.bottomColumn}>
          <Text style={styles.subLabel}>This Month</Text>
          <Text style={styles.subValue}>{monthlyRevenue}</Text>
        </View>

        <View style={styles.bottomColumnRight}>
          <Text style={styles.subLabel}>Pending Payout</Text>
          <Text style={styles.subValue}>{pendingPayout}</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: verticalScale(207),
    borderRadius: scale(12),
    padding: scale(18),
    justifyContent: 'space-between',
    marginTop: verticalScale(4),
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  topLeft: {
    flex: 1,
  },

  label: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: normalizeFont(13),
    fontWeight: '500',
    marginBottom: verticalScale(4),
  },

  totalValue: {
    color: '#FFFFFF',
    fontSize: normalizeFont(32),
    fontWeight: '800',
    letterSpacing: -0.5,
  },

  walletContainer: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(8),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  growthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(-2),
  },

  greenBadge: {
    width: scale(49),
    height: verticalScale(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#14AB00',
    borderRadius: scale(4),
    marginRight: scale(6),
  },

  growthArrow: {
    color: '#FFFFFF',
    fontSize: normalizeFont(10),
    fontWeight: '900',
    marginRight: scale(2),
  },

  growthText: {
    color: '#FFFFFF',
    fontSize: normalizeFont(11),
    fontWeight: '700',
  },

  growthSubtext: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: normalizeFont(12),
    fontWeight: '400',
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: verticalScale(2),
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  bottomColumn: {
    flex: 1,
  },

  bottomColumnRight: {
    flex: 1,
    alignItems: 'flex-end',
  },

  subLabel: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: normalizeFont(12),
    fontWeight: '500',
    marginBottom: verticalScale(4),
  },

  subValue: {
    color: '#FFFFFF',
    fontSize: normalizeFont(18),
    fontWeight: '700',
  },
});

export default RevenueSummaryCard;
