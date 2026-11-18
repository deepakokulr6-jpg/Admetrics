import React from 'react';
import Svg, { Path } from 'react-native-svg';

import colors from '../../theme/colors';
import type { BiometryKind } from '../../services/biometricService';

type Props = {
  kind: BiometryKind;
  size: number;
  color?: string;
};

// Face ID / face unlock: corner brackets with eyes, nose and smile.
const FACE =
  'M3 8V5.5A2.5 2.5 0 015.5 3H8M16 3h2.5A2.5 2.5 0 0121 5.5V8M21 16v2.5a2.5 2.5 0 01-2.5 2.5H16M8 21H5.5A2.5 2.5 0 013 18.5V16M8.5 9v1.5M15.5 9v1.5M12 9v4.5h-1M9 16.5c1.7 1.3 4.3 1.3 6 0';

// Touch ID / fingerprint: nested ridges.
const FINGERPRINT =
  'M12 3a8.5 8.5 0 00-8.5 8.5M20.5 11.5A8.5 8.5 0 0016 4.2M12 6a5.5 5.5 0 00-5.5 5.5v2M17.5 11.5A5.5 5.5 0 0012 6M12 9a2.5 2.5 0 00-2.5 2.5v3c0 2.5-1 4.5-2.5 6M14.5 11.5A2.5 2.5 0 0012 9M12 12v3c0 2.5-.8 4.6-2 6.5M14.5 14.5c0 2.6-.6 4.8-1.6 6.5M17.5 14c0 2.3-.4 4.4-1.1 6.2M20.5 14.5c0 1.6-.2 3.1-.6 4.5M3.5 14.5c0 1 .1 2 .3 2.8';

/** Icon matching the phone's biometric: face for Face ID, else fingerprint. */
const BiometryIcon: React.FC<Props> = ({ kind, size, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d={kind === 'faceId' || kind === 'face' ? FACE : FINGERPRINT}
      stroke={color ?? colors.textStrong}
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

export default BiometryIcon;
