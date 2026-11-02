
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Line,
  Circle,
  Polyline,
} from 'react-native-svg';

type Props = {
  period: string;
};

const chartData: Record<
  string,
  { days: string[]; values: number[] }
> = {
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

  const chartWidth = 270;
  const chartHeight = 190;
  const left = 27;
  const right = 8;
  const top = 12;
  const bottom = 25;

  const plotWidth = chartWidth - left - right;
  const plotHeight = chartHeight - top - bottom;

  const points = data.values.map((value, index) => {
    const x = left + (index * plotWidth) / (data.values.length - 1);
    const y = top + plotHeight - (value / 6) * plotHeight;

    return { x, y };
  });

  const polylinePoints = points
    .map(point => `${point.x},${point.y}`)
    .join(' ');

  return (
    <View style={styles.card}>
      <Svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
        {[1, 2, 3, 4, 5, 6].map(value => {
          const y = top + plotHeight - (value / 6) * plotHeight;

          return (
            <React.Fragment key={value}>
              <Line
                x1={left}
                y1={y}
                x2={chartWidth - right}
                y2={y}
                stroke="#EEEEEE"
                strokeWidth={1}
              />
            </React.Fragment>
          );
        })}

        <Polyline
          points={polylinePoints}
          fill="none"
          stroke="#6247FF"
          strokeWidth={1.6}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {points.map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={3.5}
            fill="#111111"
          />
        ))}

        {data.days.map((day, index) => (
          <React.Fragment key={day}>
            <Text />
          </React.Fragment>
        ))}
      </Svg>

      <View style={styles.labelsRow}>
        {data.days.map(day => (
          <Text key={day} style={styles.dayLabel}>
            {day}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 10,
    marginTop: 10,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 25,
    paddingRight: 8,
    marginTop: -20,
  },
  dayLabel: {
    color: '#221E25',
    fontSize: 9,
    textAlign: 'center',
  },
});

export default RevenueChart;
