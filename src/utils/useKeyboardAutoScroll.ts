import { useCallback, useEffect, useRef } from 'react';
import {
  Keyboard,
  NativeScrollEvent,
  NativeSyntheticEvent,
  type ScrollViewInstance,
} from 'react-native';

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

  const scrollToEnd = useCallback(() => {
    if (autoScrollRef.current) {
      scrollRef.current?.scrollToEnd({ animated: true });
    }
  }, []);

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

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
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
