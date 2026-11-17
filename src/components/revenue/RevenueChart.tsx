import React, { useState } from 'react';
import { View, StyleSheet, type LayoutChangeEvent } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { useTween } from '../../hooks/useTween';
import { themedStyles } from '../../theme/themedStyles';

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

// Grid runs 1K (bottom) → 6K (top); values are in thousands.
const Y_MIN = 1;
const Y_MAX = 6;
const Y_TICKS = [6, 5, 4, 3, 2, 1];

const RevenueChart: React.FC<Props> = ({ period }) => {
  const data = chartData[period] ?? chartData['7 days'];
  const [width, setWidth] = useState(0);

  // Every time the chart opens or the period changes, it grows from the
  // baseline: the points rise while the line draws left → right and each dot
  // pops in as the line reaches it.
  const progress = useTween(period, 800);

  // Everything (labels, grid, line, dots) shares one coordinate space in real
  // pixels, so each label sits exactly on its grid line / under its point.
  const height = verticalScale(190);
  const axisWidth = scale(28); // room for "6K"
  const dotR = scale(5);
  const plotLeft = axisWidth + dotR + scale(4);
  const plotRight = width - dotR - scale(2);
  const plotTop = dotR + scale(4);
  const xLabelGap = scale(22);
  const plotBottom = height - xLabelGap;

  const yFor = (value: number) =>
    plotBottom - ((value - Y_MIN) / (Y_MAX - Y_MIN)) * (plotBottom - plotTop);
  const lastIndex = data.values.length - 1;
  const xFor = (index: number) =>
    plotLeft + (index * (plotRight - plotLeft)) / lastIndex;

  const points = data.values.map((value, index) => ({
    x: xFor(index),
    y: yFor(Y_MIN + (value - Y_MIN) * progress),
  }));

  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  const lineLength = points.reduce(
    (total, point, index) =>
      index === 0
        ? 0
        : total +
          Math.hypot(
            point.x - points[index - 1].x,
            point.y - points[index - 1].y,
          ),
    0,
  );
  const dotRadius = (index: number) =>
    dotR * Math.min(1, Math.max(0, (progress * lastIndex - index) * 2 + 1));

  const labelSize = normalizeFont(10);

  const onLayout = (event: LayoutChangeEvent) =>
    setWidth(event.nativeEvent.layout.width);

  return (
    <View style={styles.card}>
      <View onLayout={onLayout} style={{ height }}>
        {width > 0 && (
          <Svg width={width} height={height}>
            <Defs>
              <LinearGradient id="line" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={colors.primary} />
                <Stop offset="1" stopColor={colors.secondary} />
              </LinearGradient>
            </Defs>

            {Y_TICKS.map(tick => {
              const y = yFor(tick);
              return (
                <React.Fragment key={tick}>
                  <SvgText
                    x={0}
                    y={y + labelSize * 0.35}
                    fontSize={labelSize}
                    fontFamily={fonts.medium}
                    fill={colors.text}
                  >
                    {`${tick}K`}
                  </SvgText>
                  <Line
                    x1={axisWidth}
                    y1={y}
                    x2={width}
                    y2={y}
                    stroke={colors.disabled}
                    strokeWidth={1}
                  />
                </React.Fragment>
              );
            })}

            {data.days.map((day, index) => (
              <SvgText
                key={day}
                x={xFor(index)}
                y={height - scale(4)}
                fontSize={labelSize}
                fontFamily={fonts.semibold}
                fill={colors.text}
                textAnchor="middle"
              >
                {day}
              </SvgText>
            ))}

            <Path
              d={pathData}
              fill="none"
              stroke="url(#line)"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray={[lineLength, lineLength]}
              strokeDashoffset={lineLength * (1 - progress)}
            />

            {points.map((point, index) => (
              <Circle
                key={index}
                cx={point.x}
                cy={point.y}
                r={dotRadius(index)}
                fill={colors.textStrong}
              />
            ))}
          </Svg>
        )}
      </View>
    </View>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    card: {
      width: '100%',
      backgroundColor: colors.white,
      borderRadius: scale(12),
      padding: scale(16),
    },
  }),
);

export default RevenueChart;
