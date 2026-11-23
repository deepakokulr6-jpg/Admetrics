import { useCallback, useEffect, useRef } from 'react';
import {
  DeviceEventEmitter,
  Keyboard,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TextInput,
  type ScrollViewInstance,
} from 'react-native';

/** Emitted by InputField on focus, so the form can reveal that field. */
export const INPUT_FOCUSED_EVENT = 'admetrics.inputFocused';
/** Space kept between the focused field and the keyboard / top edge. */
const REVEAL_MARGIN = 24;

/**
 * Keeps a form's bottom content (last fields and submit button) above the
 * keyboard without requiring a manual scroll.
 *
 * Screens mark the bottom-most fields with `setAutoScroll(true)` on focus.
 * When the keyboard opens while one of those fields is focused, the scroll
 * view jumps to the end so the whole footer stays visible. When the keyboard
 * closes, the previous scroll position is restored.
 */
export const useKeyboardAutoScroll = () => {
  const scrollRef = useRef<ScrollViewInstance>(null);
  const offsetRef = useRef(0);
  const restoreOffsetRef = useRef(0);
  const autoScrollRef = useRef(false);

  // Scroll just enough to show the focused field above the keyboard (works
  // for any field, wherever it sits in the form, and on "Next").
  const revealFocused = useCallback(() => {
    const input = TextInput.State.currentlyFocusedInput();
    const scroll = scrollRef.current;
    if (!input || !scroll || !Keyboard.isVisible()) {
      return;
    }
    scroll.measureInWindow((_x, viewTop, _w, viewHeight) => {
      input.measureInWindow((_ix, fieldTop, _iw, fieldHeight) => {
        const viewBottom = viewTop + viewHeight;
        const fieldBottom = fieldTop + fieldHeight;
        let delta = 0;
        if (fieldBottom > viewBottom - REVEAL_MARGIN) {
          delta = fieldBottom - (viewBottom - REVEAL_MARGIN);
        } else if (fieldTop < viewTop + REVEAL_MARGIN) {
          delta = fieldTop - (viewTop + REVEAL_MARGIN);
        }
        if (delta !== 0) {
          scroll.scrollTo({
            y: Math.max(0, offsetRef.current + delta),
            animated: true,
          });
        }
      });
    });
  }, []);

  const scrollToEnd = useCallback(() => {
    if (autoScrollRef.current) {
      scrollRef.current?.scrollToEnd({ animated: true });
    } else {
      revealFocused();
    }
  }, [revealFocused]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      restoreOffsetRef.current = offsetRef.current;
      scrollToEnd();
    });

    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      autoScrollRef.current = false;
      scrollRef.current?.scrollTo({
        y: restoreOffsetRef.current,
        animated: true,
      });
    });

    // Focus moved while the keyboard is up (e.g. "Next"): reveal the field
    // once the layout has settled.
    let pending: ReturnType<typeof setTimeout> | undefined;
    const focusSubscription = DeviceEventEmitter.addListener(
      INPUT_FOCUSED_EVENT,
      () => {
        clearTimeout(pending);
        pending = setTimeout(scrollToEnd, 60);
      },
    );

    return () => {
      clearTimeout(pending);
      showSubscription.remove();
      hideSubscription.remove();
      focusSubscription.remove();
    };
  }, [scrollToEnd]);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      offsetRef.current = event.nativeEvent.contentOffset.y;
    },
    [],
  );

  // The keyboard shrinks the scroll view after `keyboardDidShow`, so scroll
  // again once the new layout is known. Without this the end of the form is
  // still measured against the pre-keyboard height.
  const onLayout = useCallback(() => {
    if (Keyboard.isVisible()) {
      scrollToEnd();
    }
  }, [scrollToEnd]);

  const setAutoScroll = useCallback((enabled: boolean) => {
    autoScrollRef.current = enabled;
  }, []);

  return { scrollRef, onScroll, onLayout, setAutoScroll };
};
