import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { normalizeFont, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';

/** Row height and rows shown; the middle row is the selected value. */
export const WHEEL_ITEM_HEIGHT = verticalScale(44);
export const WHEEL_VISIBLE = 5;
const PAD = WHEEL_ITEM_HEIGHT * Math.floor(WHEEL_VISIBLE / 2);

const A11Y_ACTIONS = [{ name: 'increment' }, { name: 'decrement' }];

type ItemProps = {
  label: string;
  position: number;
  selected: boolean;
  scrollY: Animated.Value;
  onPress: (position: number) => void;
};

/**
 * One row. Memoised with its fade / scale built once, so settling on a new
 * value only re-renders the two rows whose highlight changes (smooth even on
 * long lists like years on low-end Android).
 */
const WheelItem = memo(
  ({ label, position, selected, scrollY, onPress }: ItemProps) => {
    const animated = useMemo(() => {
      const range = [-2, -1, 0, 1, 2].map(
        d => (position + d) * WHEEL_ITEM_HEIGHT,
      );
      return {
        opacity: scrollY.interpolate({
          inputRange: range,
          outputRange: [0.25, 0.5, 1, 0.5, 0.25],
          extrapolate: 'clamp',
        }),
        transform: [
          {
            scale: scrollY.interpolate({
              inputRange: range,
              outputRange: [0.8, 0.9, 1.1, 0.9, 0.8],
              extrapolate: 'clamp',
            }),
          },
        ],
      };
    }, [position, scrollY]);

    return (
      <Pressable onPress={() => onPress(position)} style={styles.row}>
        <Animated.Text
          style={[styles.text, selected && styles.textOn, animated]}
        >
          {label}
        </Animated.Text>
      </Pressable>
    );
  },
);

type Props = {
  items: readonly string[];
  index: number;
  onChange: (index: number) => void;
  accessibilityLabel: string;
};

/**
 * iOS-style scroll wheel: snaps row by row, the centred row is the value,
 * rows fade and shrink away from the centre. Tap a row to jump to it.
 * Draw the highlight band behind it with <WheelBand />.
 */
const WheelColumn: React.FC<Props> = ({
  items,
  index,
  onChange,
  accessibilityLabel,
}) => {
  const scrollRef = useRef<ScrollViewHandle>(null);
  const scrollY = useRef(new Animated.Value(index * WHEEL_ITEM_HEIGHT)).current;
  const current = useRef(index);

  // Start on the given value (contentOffset alone is unreliable on Android).
  useEffect(() => {
    const id = setTimeout(() =>
      scrollRef.current?.scrollTo({
        y: current.current * WHEEL_ITEM_HEIGHT,
        animated: false,
      }),
    );
    return () => clearTimeout(id);
  }, []);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Built once: a new Animated.event each render would re-attach the native
  // scroll listener, and a changing contentOffset could jerk the wheel.
  const onScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: true,
      }),
    [scrollY],
  );
  const initialOffset = useRef({ x: 0, y: index * WHEEL_ITEM_HEIGHT }).current;

  const settle = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    const next = Math.max(
      0,
      Math.min(items.length - 1, Math.round(y / WHEEL_ITEM_HEIGHT)),
    );
    if (next !== current.current) {
      current.current = next;
      onChangeRef.current(next);
    }
  };

  // A drag that ends with a flick keeps gliding; wait for momentum end.
  const onDragEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const velocity = event.nativeEvent.velocity?.y ?? 0;
    if (Math.abs(velocity) < 0.05) {
      settle(event);
    }
  };

  const jumpTo = useCallback((next: number) => {
    scrollRef.current?.scrollTo({
      y: next * WHEEL_ITEM_HEIGHT,
      animated: true,
    });
    current.current = next;
    onChangeRef.current(next);
  }, []);

  return (
    <Animated.ScrollView
      ref={scrollRef as never}
      style={styles.wheel}
      contentContainerStyle={styles.content}
      contentOffset={initialOffset}
      showsVerticalScrollIndicator={false}
      snapToInterval={WHEEL_ITEM_HEIGHT}
      decelerationRate="fast"
      nestedScrollEnabled
      scrollEventThrottle={16}
      onScroll={onScroll}
      onMomentumScrollEnd={settle}
      onScrollEndDrag={onDragEnd}
      overScrollMode="never"
      bounces={false}
      removeClippedSubviews={false}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ text: items[index] }}
      accessibilityActions={A11Y_ACTIONS}
      onAccessibilityAction={event =>
        jumpTo(
          Math.max(
            0,
            Math.min(
              items.length - 1,
              index + (event.nativeEvent.actionName === 'increment' ? 1 : -1),
            ),
          ),
        )
      }
    >
      {items.map((item, i) => (
        <WheelItem
          key={item}
          label={item}
          position={i}
          selected={i === index}
          scrollY={scrollY}
          onPress={jumpTo}
        />
      ))}
    </Animated.ScrollView>
  );
};

type ScrollViewHandle = {
  scrollTo: (options: { y: number; animated: boolean }) => void;
};

/** Rounded tinted band marking the centre row, behind the wheels. */
export const WheelBand = () => (
  <View style={styles.band} pointerEvents="none" />
);

const styles = themedStyles(() =>
  StyleSheet.create({
    wheel: {
      flex: 1,
      height: WHEEL_ITEM_HEIGHT * WHEEL_VISIBLE,
    },
    content: {
      paddingVertical: PAD,
    },
    row: {
      height: WHEEL_ITEM_HEIGHT,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: normalizeFont(18),
      fontFamily: fonts.medium,
      color: colors.textStrong,
    },
    textOn: {
      fontFamily: fonts.bold,
      color: colors.buttonPrimary,
    },
    band: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: PAD,
      height: WHEEL_ITEM_HEIGHT,
      borderRadius: WHEEL_ITEM_HEIGHT / 4,
      backgroundColor: colors.accentTint,
    },
  }),
);

export default WheelColumn;
