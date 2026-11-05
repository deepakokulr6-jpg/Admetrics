import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { scale, verticalScale, moderateScale } from '../../utils/responsive';

type Props = {
  period: string;
};

const chartData: Record<string, { days: string[]; values: number[] }> = {
  '7 days': {
    days: ['23', '24', '25', '26', '27', '28', '29'],
    values: [3, 4.5, 1.9, 5.2, 2.3, 2.9, 4.7],
  },
  '30 days': {
    days: ['1', '5', '10', '15', '20', '25', '30'],
    values: [2.1, 3.8, 2.9, 5.1, 3.2, 4.4, 5.6],
  },
  '90 days': {
    days: ['1', '15', '30', '45', '60', '75', '90'],
    values: [1.7, 2.8, 2.2, 4.1, 3.4, 4.8, 5.7],
  },
};

const RevenueChart: React.FC<Props> = ({ period }) => {
  const data = chartData[period] ?? chartData['7 days'];
  const { width: screenWidth } = useWindowDimensions();

  const chartWidth = Math.min(scale(280), screenWidth * 0.9);
  const chartHeight = moderateScale(190);
  const top = moderateScale(8);
  const bottom = moderateScale(12);
  const left = 0;
  const right = 0;

  const plotWidth = chartWidth - left - right;
  const plotHeight = chartHeight - top - bottom;

  const points = data.values.map((value, index) => {
    const x = left + (index * plotWidth) / (data.values.length - 1);

    const y = top + plotHeight - (value / 6) * plotHeight;

    return { x, y };
  });

  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  return (
    <View style={styles.card}>
      <View style={styles.chartContainer}>
        <View style={styles.yAxis}>
          {['6K', '5K', '4K', '3K', '2K', '1K'].map((label, index) => (
            <View key={index} style={styles.yAxisRow}>
              <Text style={styles.axisText}>{label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.svgWrapper}>
          <Svg
            height={chartHeight}
            width="100%"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          >
            {[1, 2, 3, 4, 5, 6].map(value => {
              const y = top + plotHeight - (value / 6) * plotHeight;

              return (
                <Line
                  key={value}
                  x1={0}
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke="#F3F4F6"
                  strokeWidth={1}
                />
              );
            })}

            <Path
              d={pathData}
              fill="none"
              stroke="#6366F1"
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {points.map((point, index) => (
              <Circle
                key={index}
                cx={point.x}
                cy={point.y}
                r={4.5}
                fill="#1E1B4B"
                stroke="#FFFFFF"
                strokeWidth={2}
              />
            ))}
          </Svg>
        </View>
      </View>

      <View style={styles.xAxis}>
        {data.days.map((day, index) => (
          <Text key={index} style={styles.xAxisText}>
            {day}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: verticalScale(305),
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    padding: scale(16),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginTop: verticalScale(12),
  },

  chartContainer: {
    flexDirection: 'row',
    height: verticalScale(220),
    alignItems: 'center',
  },

  yAxis: {
    width: scale(32),
    height: '100%',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10),
  },

  yAxisRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  axisText: {
    fontSize: moderateScale(10),
    fontWeight: '500',
    color: '#000000',
    width: scale(24),
  },

  svgWrapper: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },

  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(28),
    marginTop: verticalScale(4),
  },

  xAxisText: {
    fontSize: moderateScale(10),
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
  },
});

export default RevenueChart;
