// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import Svg, {
//   Line,
//   Circle,
//   Polyline,
// } from 'react-native-svg';

// type Props = {
//   period: string;
// };

// const chartData: Record<
//   string,
//   { days: string[]; values: number[] }
// > = {
//   '7 days': {
//     days: ['23', '24', '25', '26', '27', '28', '29'],
//     values: [3, 4.5, 1.9, 5.2, 2.3, 2.9, 4.7],
//   },
//   '30 days': {
//     days: ['1', '5', '10', '15', '20', '25', '30'],
//     values: [2.1, 3.8, 2.9, 5.1, 3.2, 4.4, 5.6],
//   },
//   '90 days': {
//     days: ['1', '15', '30', '45', '60', '75', '90'],
//     values: [1.7, 2.8, 2.2, 4.1, 3.4, 4.8, 5.7],
//   },
// };

// const RevenueChart: React.FC<Props> = ({ period }) => {
//   const data = chartData[period] ?? chartData['7 days'];

//   const chartWidth = 270;
//   const chartHeight = 190;
//   const left = 27;
//   const right = 8;
//   const top = 12;
//   const bottom = 25;

//   const plotWidth = chartWidth - left - right;
//   const plotHeight = chartHeight - top - bottom;

//   const points = data.values.map((value, index) => {
//     const x = left + (index * plotWidth) / (data.values.length - 1);
//     const y = top + plotHeight - (value / 6) * plotHeight;

//     return { x, y };
//   });

//   const polylinePoints = points
//     .map(point => `${point.x},${point.y}`)
//     .join(' ');

//   return (
//     <View style={styles.card}>
//       <Svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
//         {[1, 2, 3, 4, 5, 6].map(value => {
//           const y = top + plotHeight - (value / 6) * plotHeight;

//           return (
//             <React.Fragment key={value}>
//               <Line
//                 x1={left}
//                 y1={y}
//                 x2={chartWidth - right}
//                 y2={y}
//                 stroke="#EEEEEE"
//                 strokeWidth={1}
//               />
//             </React.Fragment>
//           );
//         })}

//         <Polyline
//           points={polylinePoints}
//           fill="none"
//           stroke="#6247FF"
//           strokeWidth={1.6}
//           strokeLinejoin="round"
//           strokeLinecap="round"
//         />

//         {points.map((point, index) => (
//           <Circle
//             key={index}
//             cx={point.x}
//             cy={point.y}
//             r={3.5}
//             fill="#111111"
//           />
//         ))}

//         {data.days.map(day => (
//           <React.Fragment key={day}>
//             <Text />
//           </React.Fragment>
//         ))}
//       </Svg>

//       <View style={styles.labelsRow}>
//         {data.days.map(day => (
//           <Text key={day} style={styles.dayLabel}>
//             {day}
//           </Text>
//         ))}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     paddingHorizontal: 8,
//     paddingTop: 6,
//     paddingBottom: 10,
//     marginTop: 10,
//   },
//   labelsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingLeft: 25,
//     paddingRight: 8,
//     marginTop: -20,
//   },
//   dayLabel: {
//     color: '#221E25',
//     fontSize: 9,
//     textAlign: 'center',
//   },
// });

// export default RevenueChart;
//============================================================updated code for Revenue chart(1)=========================================================//
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';

type Props = {
  period?: string;
};

const RevenueChart: React.FC<Props> = () => {
  const data = [
    { day: '23', value: 3000, yPos: 140 },
    { day: '24', value: 4500, yPos: 95 },
    { day: '25', value: 1800, yPos: 175 },
    { day: '26', value: 5200, yPos: 75 },
    { day: '27', value: 2200, yPos: 165 },
    { day: '28', value: 2800, yPos: 148 },
    { day: '29', value: 4600, yPos: 90 },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.chartContainer}>
        {/* Y-Axis Labels matching exact Figma text properties */}
        <View style={styles.yAxis}>
          {['6K', '5K', '4K', '3K', '2K', '1K'].map((label, index) => (
            <View key={index} style={styles.yAxisRow}>
              <Text style={styles.axisText}>{label}</Text>
            </View>
          ))}
        </View>

        {/* SVG Graph Canvas */}
        <View style={styles.svgWrapper}>
          <Svg height="190" width="100%" viewBox="0 0 280 190">
            {[0, 31, 62, 93, 124, 155].map((y, idx) => (
              <Line
                key={idx}
                x1="0"
                y1={y}
                x2="280"
                y2={y}
                stroke="#F3F4F6"
                strokeWidth="1"
              />
            ))}

            <Path
              d="M 20 140 L 60 95 L 100 175 L 140 75 L 180 165 L 220 148 L 260 90"
              fill="none"
              stroke="#6366F1"
              strokeWidth="2.5"
            />

            {data.map((item, index) => {
              const xCoords = [20, 60, 100, 140, 180, 220, 260];
              return (
                <Circle
                  key={index}
                  cx={xCoords[index]}
                  cy={item.yPos}
                  r="4.5"
                  fill="#1E1B4B"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              );
            })}
          </Svg>
        </View>
      </View>

      {/* X-Axis Date Labels */}
      <View style={styles.xAxis}>
        {data.map((item, index) => (
          <Text key={index} style={styles.xAxisText}>
            {item.day}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 305,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginTop: 12,
  },
  chartContainer: {
    flexDirection: 'row',
    height: 220,
    alignItems: 'center',
  },
  yAxis: {
    width: 32,
    height: '100%',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  yAxisRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  axisText: {
    fontSize: 10, // Matches Figma 10px size[cite: 14]
    fontWeight: '500', // Matches Medium weight[cite: 14]
    color: '#000000', // Matches exact hex #000000 fill[cite: 14]
    width: 24,
  },
  svgWrapper: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    marginTop: 4,
  },
  xAxisText: {
    fontSize: 10, // Matches Figma 10px size[cite: 14]
    fontWeight: '500', // Matches Medium weight[cite: 14]
    color: '#000000', // Matches exact hex #000000 fill[cite: 14]
    textAlign: 'center',
  },
});

export default RevenueChart;
