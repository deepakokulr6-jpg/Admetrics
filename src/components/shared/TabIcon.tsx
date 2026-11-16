import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import colors from '../../theme/colors';
import type { TabName } from './BottomNavigation';

type Props = {
  name: TabName;
  /** Selected tab → solid (filled) icon, otherwise outline. */
  active: boolean;
  color: string;
  size: number;
};

// Shapes come from the Figma nav icons (24px grid). The filled variants use
// the same outlines, with inner details knocked out in white.
const CLINIC_SHAPE =
  'M10.1492 2.48184C11.4736 1.67273 13.1403 1.67255 14.4646 2.48184L20.3279 6.06485C21.6461 6.87044 22.4065 8.34405 22.2986 9.88516L21.8621 16.102C21.634 19.353 18.9297 21.8742 15.6707 21.8744H8.94215C5.68301 21.8743 2.97881 19.3531 2.75075 16.102L2.3152 9.88516C2.20727 8.34401 2.96664 6.87044 4.28493 6.06485L10.1492 2.48184Z';

const RUPEE =
  'M12.647 7.40229C12.4799 7.40229 12.3391 7.28144 12.2956 7.12012C12.2318 6.88395 12.1415 6.66225 12.0245 6.45502C11.9645 6.34872 12.0377 6.20796 12.1597 6.20866L13.1405 6.21427C13.2948 6.21515 13.4307 6.11315 13.473 5.96479L13.6233 5.43795C13.6859 5.2184 13.521 4.99994 13.2927 4.99994H8.8562H8.63097H7.61868C7.46387 4.99994 7.32816 5.10343 7.28719 5.25272L7.11941 5.86405C7.05937 6.08285 7.22402 6.29877 7.45091 6.29877H8.85558C9.54894 6.29877 10.0584 6.45991 10.3839 6.78217C10.4456 6.84326 10.5015 6.90839 10.5515 6.97755C10.6893 7.16814 10.5251 7.40229 10.2899 7.40229H7.60178C7.44803 7.40229 7.31297 7.50439 7.27105 7.65231L7.12409 8.17087C7.06191 8.3903 7.22674 8.60834 7.45482 8.60834H10.3669C10.5916 8.60834 10.7574 8.82427 10.6417 9.01689C10.6404 9.01906 10.6391 9.02122 10.6378 9.02338C10.4816 9.27729 10.2537 9.47097 9.95421 9.60444C9.65473 9.7379 9.28852 9.80463 8.85558 9.80463H7.46948C7.27825 9.80463 7.12378 9.96069 7.12574 10.1519L7.1307 10.6354C7.13151 10.7139 7.15919 10.7898 7.20914 10.8505L10.5249 14.8748C10.5902 14.954 10.6875 14.9999 10.7902 14.9999H12.3875C12.4001 14.9999 12.4103 14.9898 12.4103 14.9772C12.4103 14.9382 12.3968 14.9005 12.3722 14.8703L9.24405 11.0391C9.2316 11.0238 9.23958 11.0008 9.25881 10.9965C9.26017 10.9962 9.26156 10.996 9.26296 10.9959C10.0139 10.9502 10.6203 10.7923 11.0821 10.5224C11.5444 10.2522 11.8813 9.90229 12.0929 9.4726C12.1832 9.28922 12.2542 9.09665 12.306 8.8949C12.3479 8.73146 12.4896 8.60834 12.6583 8.60834H13.1416C13.2954 8.60834 13.4304 8.50625 13.4723 8.35832L13.6193 7.83977C13.6815 7.62033 13.5166 7.40229 13.2886 7.40229H12.647Z';

const RECEIPT =
  'M20.5 2.75C19.9 3.1 19.5 3.6 19.5 4.2V20.4C19.5 21.2 18.6 21.6 17.9 21.2L16 19.95C15.6 19.7 14.95 19.75 14.55 20.1L12.65 21.7C12.25 22.05 11.5 22.05 11.1 21.7L9.2 20.1C8.8 19.75 8.15 19.7 7.75 19.95L5.8 21.2C5.1 21.65 4.75 21.25 4.75 20.45V5.9C4.75 4.1 5.6 2.75 8.5 2.75H20.5Z';

const HEADSET_ARC =
  'M2.25 15V12.75C2.25 7.37 6.62 3 12 3C17.38 3 21.75 7.37 21.75 12.75V15';

const TabIcon: React.FC<Props> = ({ name, active, color, size }) => {
  const cutout = colors.white;

  switch (name) {
    case 'Revenue':
      return (
        <Svg width={size} height={size} viewBox="-2 -2 24 24" fill="none">
          {active ? (
            <Circle cx={10} cy={10} r={10} fill={color} />
          ) : (
            <Circle cx={10} cy={10} r={9.25} stroke={color} strokeWidth={1.5} />
          )}
          <Path d={RUPEE} fill={active ? cutout : color} fillRule="evenodd" />
        </Svg>
      );

    case 'Clinics':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d={CLINIC_SHAPE}
            fill={active ? color : 'none'}
            stroke={color}
            strokeWidth={active ? 0 : 1.5}
            strokeLinejoin="round"
          />
          <Rect
            x={11.2}
            y={8}
            width={1.9}
            height={8}
            rx={0.6}
            fill={active ? cutout : color}
          />
          <Rect
            x={8.2}
            y={11.1}
            width={8}
            height={1.8}
            rx={0.6}
            fill={active ? cutout : color}
          />
        </Svg>
      );

    case 'Statement':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d={RECEIPT}
            fill={active ? color : 'none'}
            stroke={color}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          <Rect
            x={8}
            y={12}
            width={8}
            height={2}
            rx={1}
            fill={active ? cutout : color}
          />
          <Rect
            x={7}
            y={8}
            width={10}
            height={2}
            rx={1}
            fill={active ? cutout : color}
          />
        </Svg>
      );

    case 'Support':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d={HEADSET_ARC}
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          {[1.5, 16.5].map(x => (
            <Rect
              key={x}
              x={x + 0.75}
              y={13.5}
              width={4.5}
              height={7.5}
              rx={2.25}
              fill={active ? color : 'none'}
              stroke={color}
              strokeWidth={1.5}
            />
          ))}
        </Svg>
      );
  }
};

export default TabIcon;
