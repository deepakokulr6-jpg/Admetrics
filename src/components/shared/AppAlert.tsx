import React, {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';
import strings from '../../constants/strings';

/** Same shape as React Native's AlertButton, so call sites read the same. */
export type AppAlertButton = {
  text?: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

type AlertRequest = {
  id: number;
  title: string;
  message?: string;
  buttons: AppAlertButton[];
};

// Module-level queue: alerts can be raised from anywhere (screens, hooks),
// shown one at a time by the single <AppAlertHost /> in App.tsx.
let queue: AlertRequest[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(listener => listener());
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const current = () => queue[0] ?? null;

/**
 * Drop-in for `Alert.alert(title, message?, buttons?)`, drawn in the app's
 * theme (light / dark) instead of the system dialog. With no buttons it
 * shows a single "OK".
 */
export const appAlert = (
  title: string,
  message?: string,
  buttons?: AppAlertButton[],
) => {
  queue = [
    ...queue,
    {
      id: nextId++,
      title,
      message,
      buttons: buttons?.length ? buttons : [{ text: strings.common.ok }],
    },
  ];
  emit();
};

const dismiss = (id: number) => {
  queue = queue.filter(item => item.id !== id);
  emit();
};

/** Renders the front alert of the queue. Mount once near the app root. */
export const AppAlertHost: React.FC = () => {
  const request = useSyncExternalStore(subscribe, current);
  const [shown, setShown] = useState<AlertRequest | null>(request);
  const opacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    if (!request) {
      return;
    }
    setShown(request);
    opacity.setValue(0);
    cardScale.setValue(0.92);
    const open = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 7,
        tension: 140,
        useNativeDriver: true,
      }),
    ]);
    open.start();
    return () => open.stop();
  }, [request, opacity, cardScale]);

  if (!shown || !request) {
    return null;
  }

  // Fade out, then run the button's action (so it can navigate cleanly).
  const choose = (button?: AppAlertButton) => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 140,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      dismiss(shown.id);
      button?.onPress?.();
    });
  };

  const cancel = shown.buttons.find(button => button.style === 'cancel');
  // Two buttons side by side (Cancel first); three or more stacked.
  const stacked = shown.buttons.length > 2;

  return (
    <Modal
      visible
      transparent
      animationType="none"
      statusBarTranslucent
      // Android back: same as Cancel, or closes a single-button alert.
      onRequestClose={() =>
        cancel || shown.buttons.length === 1
          ? choose(cancel ?? shown.buttons[0])
          : undefined
      }
    >
      <Animated.View style={[styles.backdrop, { opacity }]}>
        <Animated.View
          style={[styles.card, { transform: [{ scale: cardScale }] }]}
          accessibilityViewIsModal
          accessibilityRole="alert"
        >
          <Text style={styles.title}>{shown.title}</Text>
          {shown.message ? (
            <Text style={styles.message}>{shown.message}</Text>
          ) : null}

          <View style={[styles.buttons, stacked && styles.buttonsStacked]}>
            {shown.buttons.map((button, index) => {
              const kind = button.style ?? 'default';
              return (
                <Pressable
                  key={`${button.text}-${index}`}
                  onPress={() => choose(button)}
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.button,
                    !stacked && styles.buttonFlex,
                    kind === 'cancel'
                      ? styles.cancel
                      : kind === 'destructive'
                      ? styles.destructive
                      : styles.primary,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      kind === 'cancel' ? styles.cancelText : styles.onFill,
                    ]}
                  >
                    {button.text ?? strings.common.ok}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: scale(28),
      backgroundColor: colors.sheetBackdrop,
    },
    card: {
      width: '100%',
      maxWidth: scale(360),
      paddingHorizontal: scale(20),
      paddingTop: verticalScale(22),
      paddingBottom: verticalScale(18),
      borderRadius: scale(20),
      backgroundColor: colors.white,
    },
    title: {
      fontSize: normalizeFont(18),
      lineHeight: normalizeFont(24),
      fontFamily: fonts.bold,
      color: colors.textStrong,
    },
    message: {
      marginTop: verticalScale(8),
      fontSize: normalizeFont(14),
      lineHeight: normalizeFont(20),
      fontFamily: fonts.regular,
      color: colors.bodyText,
    },
    buttons: {
      flexDirection: 'row',
      gap: scale(10),
      marginTop: verticalScale(22),
    },
    buttonsStacked: {
      flexDirection: 'column',
    },
    button: {
      height: verticalScale(44),
      borderRadius: verticalScale(22),
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: scale(12),
    },
    buttonFlex: {
      flex: 1,
    },
    primary: {
      backgroundColor: colors.buttonPrimary,
    },
    destructive: {
      backgroundColor: colors.red,
    },
    cancel: {
      backgroundColor: colors.surfaceMuted,
    },
    pressed: {
      opacity: 0.75,
    },
    buttonText: {
      fontSize: normalizeFont(15),
      fontFamily: fonts.semibold,
    },
    onFill: {
      color: colors.onAccent,
    },
    cancelText: {
      color: colors.textStrong,
    },
  }),
);
