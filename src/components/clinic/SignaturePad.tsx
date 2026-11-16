import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import colors from '../../theme/colors';
import strings from '../../constants/strings';

type Props = {
  /** Called with the SVG path data after every stroke ('' when cleared). */
  onChange: (path: string) => void;
  /** Bump to clear the pad. */
  clearKey?: number;
  strokeColor?: string;
};

const round = (n: number) => Math.round(n * 10) / 10;

/**
 * Finger-drawn signature. Each stroke is collected as SVG path data, so the
 * result can be stored as a string and drawn again anywhere with <Path>.
 * Pure JS (PanResponder + react-native-svg) – no extra native module.
 */
const SignaturePad: React.FC<Props> = ({
  onChange,
  clearKey = 0,
  strokeColor = colors.white,
}) => {
  const [strokes, setStrokes] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const currentRef = useRef('');
  const strokesRef = useRef<string[]>([]);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Reset when the parent asks to clear.
  useEffect(() => {
    strokesRef.current = [];
    currentRef.current = '';
    setStrokes([]);
    setCurrent('');
  }, [clearKey]);

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        // Keep the gesture: no parent scroll / swipe-back steals it mid-stroke.
        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => true,
        onPanResponderGrant: event => {
          const { locationX, locationY } = event.nativeEvent;
          // A dot, so a single tap still leaves a mark.
          currentRef.current = `M${round(locationX)} ${round(
            locationY,
          )} l0.1 0.1`;
          setCurrent(currentRef.current);
        },
        onPanResponderMove: event => {
          const { locationX, locationY } = event.nativeEvent;
          currentRef.current += ` L${round(locationX)} ${round(locationY)}`;
          setCurrent(currentRef.current);
        },
        onPanResponderRelease: () => {
          if (currentRef.current) {
            strokesRef.current = [...strokesRef.current, currentRef.current];
            setStrokes(strokesRef.current);
            onChangeRef.current(strokesRef.current.join(' '));
          }
          currentRef.current = '';
          setCurrent('');
        },
      }),
    [],
  );

  return (
    <View
      style={StyleSheet.absoluteFill}
      accessible
      accessibilityLabel={strings.mou.signatureArea}
      {...responder.panHandlers}
    >
      <Svg width="100%" height="100%" pointerEvents="none">
        {[...strokes, current].filter(Boolean).map((d, index) => (
          <Path
            key={index}
            d={d}
            stroke={strokeColor}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ))}
      </Svg>
    </View>
  );
};

export default SignaturePad;
