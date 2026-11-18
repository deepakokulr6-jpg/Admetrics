import React, { useEffect, useRef, useState } from 'react';
import { Pressable } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Svg, { Path, Rect } from 'react-native-svg';

import { scale } from '../../utils/responsive';
import colors from '../../theme/colors';
import strings from '../../constants/strings';

type Props = {
  /** Text put on the clipboard (spaces kept as shown). */
  value: string;
  disabled?: boolean;
};

/**
 * Two overlapping squares; copies `value` and shows a tick for a moment.
 */
const CopyButton: React.FC<Props> = ({ value, disabled }) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onPress = () => {
    Clipboard.setString(value);
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1500);
  };

  const color = disabled ? colors.borderLight : colors.textStrong;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={
        copied
          ? strings.authenticator.copied
          : strings.authenticator.copy(value)
      }
    >
      <Svg width={scale(18)} height={scale(18)} viewBox="0 0 18 18">
        {copied ? (
          <Path
            d="M3.5 9.5l3.5 3.5 7.5-8"
            stroke={colors.success}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ) : (
          <>
            <Rect
              x={5.5}
              y={1.5}
              width={11}
              height={11}
              rx={2}
              stroke={color}
              strokeWidth={1.3}
              fill="none"
            />
            <Path
              d="M12.5 15.5a1 1 0 01-1 1h-8a2 2 0 01-2-2v-8a1 1 0 011-1"
              stroke={color}
              strokeWidth={1.3}
              fill="none"
            />
          </>
        )}
      </Svg>
    </Pressable>
  );
};

export default CopyButton;
