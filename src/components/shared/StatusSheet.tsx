import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Easing,
  Image,
  Modal,
  PanResponder,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import GradientButton from './GradientButton';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';

const SPINNER = require('../../../assets/images/figma/spinner.gif');
const SUCCESS = require('../../../assets/images/figma/success_check.gif');

/** Drag further than this (or flick down) to close once done. */
const DRAG_CLOSE_DISTANCE = 100;
const DRAG_CLOSE_VELOCITY = 1;

export type SheetStatus = 'loading' | 'success';

type Props = {
  visible: boolean;
  status: SheetStatus;
  /** e.g. "Verifying..." while loading, "Verified" on success. */
  title: string;
  message: string;
  /** Called once the sheet has fully slid away after `visible` → false. */
  onHidden?: () => void;
  /** Optional button under the text on success (e.g. "Done"). */
  actionLabel?: string;
  onAction?: () => void;
};

/**
 * Figma "Verifying..." sheet: grab handle, spinner + title + message, then
 * the animated green check on success. While loading it can't be dismissed;
 * once done it can be dragged down to close early. Used by Add Device and clinic registration.
 */
const StatusSheet: React.FC<Props> = ({
  visible,
  status,
  title,
  message,
  onHidden,
  actionLabel,
  onAction,
}) => {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const sheetHeight = Math.round(height * 0.62);
  const [mounted, setMounted] = useState(visible);

  const backdrop = useRef(new Animated.Value(0)).current;
  const offset = useRef(new Animated.Value(sheetHeight)).current;
  const checkScale = useRef(new Animated.Value(0.4)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;
  const onHiddenRef = useRef(onHidden);
  onHiddenRef.current = onHidden;
  // Only report "hidden" after the sheet was actually shown; otherwise the
  // first render (visible=false) would fire onHidden and e.g. leave the screen.
  const wasShown = useRef(false);

  // Leaving the screen mid-animation: stop everything, so no callback runs
  // (and nothing navigates) after unmount.
  useEffect(
    () => () => {
      [backdrop, offset, checkScale, checkOpacity, textOpacity].forEach(value =>
        value.stopAnimation(),
      );
    },
    [backdrop, offset, checkScale, checkOpacity, textOpacity],
  );

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(backdrop, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.timing(offset, {
        toValue: sheetHeight,
        duration: 280,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished && wasShown.current) {
        wasShown.current = false;
        setMounted(false);
        onHiddenRef.current?.();
      }
    });
  }, [backdrop, offset, sheetHeight]);

  // Once done (success), drag down to close early. Not while loading: the
  // work is still running.
  const statusRef = useRef(status);
  statusRef.current = status;
  const onActionRef = useRef(onAction);
  onActionRef.current = onAction;
  const drag = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) =>
          statusRef.current === 'success' &&
          g.dy > 8 &&
          Math.abs(g.dy) > Math.abs(g.dx),
        onPanResponderMove: (_, g) => offset.setValue(Math.max(0, g.dy)),
        onPanResponderRelease: (_, g) => {
          if (g.dy > DRAG_CLOSE_DISTANCE || g.vy > DRAG_CLOSE_VELOCITY) {
            // Same as the button (e.g. "Done"), else just slide away.
            if (onActionRef.current) {
              onActionRef.current();
            } else {
              hide();
            }
          } else {
            Animated.spring(offset, {
              toValue: 0,
              friction: 8,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [offset, hide],
  );

  // Slide in / out.
  useEffect(() => {
    if (visible) {
      wasShown.current = true;
      setMounted(true);
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(offset, {
          toValue: 0,
          duration: 380,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      hide();
    }
  }, [visible, backdrop, offset, hide]);

  // Success: the check pops in with a small bounce, the text fades over.
  useEffect(() => {
    if (status !== 'success') {
      checkScale.setValue(0.4);
      checkOpacity.setValue(0);
      return;
    }
    textOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(checkScale, {
        toValue: 1,
        friction: 5,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.timing(checkOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();
  }, [status, checkScale, checkOpacity, textOpacity]);

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      // Busy: Android back does nothing until the screen hides the sheet.
      onRequestClose={() => undefined}
    >
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, { opacity: backdrop }]} />

        <Animated.View
          {...drag.panHandlers}
          style={[
            styles.sheet,
            {
              height: sheetHeight,
              paddingBottom: insets.bottom,
              transform: [{ translateY: offset }],
            },
          ]}
        >
          <View style={styles.handle} />

          <View style={styles.body}>
            {/* Same slot for spinner and check, so the text never jumps. */}
            <View style={styles.iconSlot}>
              {status === 'success' ? (
                <Animated.Image
                  source={SUCCESS}
                  style={[
                    styles.check,
                    {
                      opacity: checkOpacity,
                      transform: [{ scale: checkScale }],
                    },
                  ]}
                />
              ) : (
                <Image source={SPINNER} style={styles.spinner} />
              )}
            </View>

            <Animated.View style={[styles.text, { opacity: textOpacity }]}>
              <Text style={styles.title} accessibilityLiveRegion="polite">
                {title}
              </Text>
              <Text style={styles.message}>{message}</Text>
              {status === 'success' && actionLabel && onAction ? (
                <GradientButton
                  title={actionLabel}
                  onPress={onAction}
                  style={styles.action}
                />
              ) : null}
            </Animated.View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const ICON_SLOT = scale(64);

const styles = themedStyles(() =>
  StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor: colors.sheetBackdrop,
    },
    sheet: {
      paddingHorizontal: scale(24),
      paddingTop: verticalScale(8),
      borderTopLeftRadius: scale(24),
      borderTopRightRadius: scale(24),
      backgroundColor: colors.white,
    },
    // Figma: 120 × 4 grey grab handle centred at the top.
    handle: {
      alignSelf: 'center',
      width: scale(120),
      height: verticalScale(4),
      borderRadius: verticalScale(2),
      backgroundColor: colors.border,
    },
    // Figma: spinner about a third of the way down the sheet.
    body: {
      flex: 1,
      alignItems: 'center',
      paddingTop: '28%',
    },
    iconSlot: {
      width: ICON_SLOT,
      height: ICON_SLOT,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: verticalScale(20),
    },
    spinner: {
      width: scale(30),
      height: scale(30),
    },
    check: {
      width: ICON_SLOT,
      height: ICON_SLOT,
    },
    text: {
      alignItems: 'center',
    },
    action: {
      marginTop: verticalScale(28),
    },
    title: {
      fontSize: normalizeFont(18),
      lineHeight: normalizeFont(24),
      fontFamily: fonts.bold,
      color: colors.textStrong,
    },
    message: {
      marginTop: verticalScale(10),
      fontSize: normalizeFont(12),
      lineHeight: normalizeFont(16),
      fontFamily: fonts.regular,
      color: colors.bodyText,
      textAlign: 'center',
    },
  }),
);

export default StatusSheet;
