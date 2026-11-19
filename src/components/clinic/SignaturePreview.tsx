import React, { useMemo } from 'react';
import Svg, { Path } from 'react-native-svg';

import colors from '../../theme/colors';

type Props = {
  /** Signature as SVG path data (from SignaturePad). */
  path: string;
  width: number;
  height: number;
  color?: string;
};

const PAD = 6;

/**
 * Draws a saved signature scaled to fit the box. The path was recorded in
 * the signing box's own coordinates, so the view box is fitted to the
 * strokes' bounds instead.
 */
const SignaturePreview: React.FC<Props> = ({ path, width, height, color }) => {
  const viewBox = useMemo(() => {
    const xs: number[] = [];
    const ys: number[] = [];
    const pairs = path.matchAll(/[ML]\s*(-?[\d.]+)\s+(-?[\d.]+)/g);
    for (const [, x, y] of pairs) {
      xs.push(Number(x));
      ys.push(Number(y));
    }
    if (!xs.length) {
      return '0 0 1 1';
    }
    const minX = Math.min(...xs) - PAD;
    const minY = Math.min(...ys) - PAD;
    const w = Math.max(...xs) - minX + PAD;
    const h = Math.max(...ys) - minY + PAD;
    return `${minX} ${minY} ${w} ${h}`;
  }, [path]);

  return (
    <Svg width={width} height={height} viewBox={viewBox}>
      <Path
        d={path}
        stroke={color ?? colors.textStrong}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
};

export default SignaturePreview;
