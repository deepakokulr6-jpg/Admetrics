import React from 'react';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

import { scale } from '../../utils/responsive';
import colors from '../../theme/colors';

type Props = {
  /** Width in design px; height follows the 200 × 136 artwork ratio. */
  width?: number;
};

// Logo / splash brand gradient (primary blue → secondary purple), in a
// strong, a soft and a faint strength.
const D = 'url(#brandStrong)';
const M = 'url(#brandSoft)';
const L = 'url(#brandFaint)';
const W = colors.white;

/** Two-storey window with a cross bar. */
const Window = ({ x, y }: { x: number; y: number }) => (
  <>
    <Rect x={x} y={y} width={14} height={12} rx={1.5} fill={M} />
    <Path
      d={`M${x + 7} ${y}v12M${x} ${y + 6}h14`}
      stroke={W}
      strokeWidth={1.4}
    />
  </>
);

/** Rounded tree on a trunk. */
const Tree = ({ x, y, r }: { x: number; y: number; r: number }) => (
  <>
    <Rect x={x - 1.5} y={y} width={3} height={r * 1.6} rx={1} fill={D} />
    <Ellipse cx={x} cy={y - r * 0.2} rx={r} ry={r * 1.25} fill={D} />
  </>
);

/**
 * Empty Clinics screen artwork (design reference "Option 5"): lavender
 * clinic with a cross sign, windows, door, trees and soft clouds.
 */
const ClinicIllustration: React.FC<Props> = ({ width = 200 }) => {
  const w = scale(width);
  const h = (w * 136) / 200;

  return (
    <Svg width={w} height={h} viewBox="0 0 200 136" accessible={false}>
      <Defs>
        {(
          [
            ['brandStrong', 1],
            ['brandSoft', 0.45],
            ['brandFaint', 0.12],
          ] as const
        ).map(([id, opacity]) => (
          <LinearGradient
            key={id}
            id={id}
            x1="0"
            y1="0"
            x2="200"
            y2="136"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0" stopColor={colors.primary} stopOpacity={opacity} />
            <Stop
              offset="1"
              stopColor={colors.secondary}
              stopOpacity={opacity}
            />
          </LinearGradient>
        ))}
      </Defs>
      {/* Soft backdrop and clouds */}
      <Ellipse cx={100} cy={72} rx={70} ry={58} fill={L} />
      <Ellipse cx={30} cy={34} rx={14} ry={6} fill={W} />
      <Ellipse cx={170} cy={30} rx={14} ry={6} fill={W} />

      {/* Ground */}
      <Rect x={20} y={124} width={160} height={3} rx={1.5} fill={M} />

      {/* Side wings */}
      <Rect
        x={38}
        y={70}
        width={36}
        height={54}
        fill={W}
        stroke={M}
        strokeWidth={1.5}
      />
      <Rect
        x={126}
        y={70}
        width={36}
        height={54}
        fill={W}
        stroke={M}
        strokeWidth={1.5}
      />
      <Rect x={36} y={66} width={40} height={6} rx={1.5} fill={M} />
      <Rect x={124} y={66} width={40} height={6} rx={1.5} fill={M} />
      <Window x={49} y={82} />
      <Window x={137} y={82} />

      {/* Centre block */}
      <Path d="M86 30a14 10 0 0128 0z" fill={M} />
      <Rect
        x={70}
        y={30}
        width={60}
        height={94}
        fill={W}
        stroke={M}
        strokeWidth={1.5}
      />
      <Rect x={66} y={28} width={68} height={7} rx={2} fill={D} />

      {/* Cross sign */}
      <Rect x={89} y={42} width={22} height={20} rx={3} fill={D} />
      <Path
        d="M100 46.5v11M94.5 52h11"
        stroke={W}
        strokeWidth={2.6}
        strokeLinecap="round"
      />

      {/* Door */}
      <Rect x={88} y={96} width={24} height={28} rx={1.5} fill={M} />
      <Path d="M100 96v28" stroke={W} strokeWidth={1.4} />
      <Rect x={84} y={92} width={32} height={5} rx={1.5} fill={D} />

      {/* Trees */}
      <Tree x={28} y={108} r={10} />
      <Tree x={176} y={112} r={8} />

      {/* Little shrubs by the door */}
      <Circle cx={80} cy={122} r={4} fill={M} />
      <Circle cx={120} cy={122} r={4} fill={M} />
    </Svg>
  );
};

export default ClinicIllustration;
