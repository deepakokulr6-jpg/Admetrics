import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { normalizeFont, scale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';
import { sampleRevenue } from '../../constants/mockData';
import { useCountUp } from '../../hooks/useCountUp';
import { themedStyles } from '../../theme/themedStyles';

type Props = {
  totalRevenue?: string;
  growth?: string;
  monthlyRevenue?: string;
  pendingPayout?: string;
};

const RevenueSummaryCard: React.FC<Props> = ({
  totalRevenue = sampleRevenue.totalRevenue,
  growth = sampleRevenue.growth,
  monthlyRevenue = sampleRevenue.monthlyRevenue,
  pendingPayout = sampleRevenue.pendingPayout,
}) => {
  // Amounts count up from 0 when the screen opens.
  const totalText = useCountUp(totalRevenue);
  const growthText = useCountUp(growth);
  const monthlyText = useCountUp(monthlyRevenue);
  const pendingText = useCountUp(pendingPayout);

  return (
    <View style={styles.card}>
      {/* Gradient is a background layer only – wrapping content in
          LinearGradient mis-sizes and clips it on iOS. */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.topRow}>
        <View style={styles.topLeft}>
          <Text style={styles.label}>
            {strings.revenueSummaryCard.totalRevenue}
          </Text>
          <Text style={styles.totalValue}>{totalText}</Text>
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
          <Text style={styles.growthArrow}>
            {strings.revenueSummaryCard.growthArrow}
          </Text>
          <Text style={styles.growthText}>{growthText}</Text>
        </View>
        <Text style={styles.growthSubtext}>
          {strings.revenueSummaryCard.vsPreviousMonth}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        <View style={styles.bottomColumn}>
          <Text style={styles.subLabel}>
            {strings.revenueSummaryCard.thisMonth}
          </Text>
          <Text style={styles.subValue}>{monthlyText}</Text>
        </View>

        <View style={styles.bottomColumnRight}>
          <Text style={styles.subLabel}>
            {strings.revenueSummaryCard.pendingPayout}
          </Text>
          <Text style={styles.subValue}>{pendingText}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    card: {
      width: '100%',
      borderRadius: scale(12),
      padding: scale(16),
      overflow: 'hidden',
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
      color: colors.onAccent,
      fontSize: normalizeFont(12),
      marginTop: scale(6),
      marginBottom: scale(8),
    },

    totalValue: {
      color: colors.onAccent,
      fontSize: normalizeFont(36),
      fontFamily: fonts.bold,
    },

    walletContainer: {
      width: scale(32),
      height: scale(32),
      justifyContent: 'center',
      alignItems: 'center',
    },

    growthRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: scale(10),
    },

    greenBadge: {
      paddingHorizontal: scale(5),
      height: scale(18),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.green,
      borderRadius: scale(2),
      marginRight: scale(6),
    },

    growthArrow: {
      color: colors.onAccent,
      fontSize: normalizeFont(9),
      marginRight: scale(3),
    },

    growthText: {
      color: colors.onAccent,
      fontSize: normalizeFont(10),
      fontFamily: fonts.medium,
    },

    growthSubtext: {
      color: colors.onAccent,
      fontSize: normalizeFont(10),
    },

    divider: {
      height: 1,
      backgroundColor: colors.whiteTranslucent,
      marginTop: scale(14),
      marginBottom: scale(12),
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
      color: colors.onAccent,
      fontSize: normalizeFont(12),
      marginBottom: scale(8),
    },

    subValue: {
      color: colors.onAccent,
      fontSize: normalizeFont(18),
      fontFamily: fonts.bold,
    },
  }),
);

export default RevenueSummaryCard;
