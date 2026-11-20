import React, { ReactNode, useEffect, useState } from 'react';
import {
  FlatList,
  type FlatListProps,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { ModalBottomSheet } from '@swmansion/react-native-bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { themedStyles } from '../../theme/themedStyles';
import strings from '../../constants/strings';

type Props = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

/** Closed, then sized to the content (capped to the screen natively). */
const DETENTS: (0 | 'content')[] = [0, 'content'];
const CLOSED = 0;
/**
 * The sheet floats above the screen but stays in its React tree, so a list
 * in it would think it sits inside the screen's ScrollView (dev warning).
 * Reset that context: the sheet is its own scroll root.
 */
const ScrollContext = (
  ScrollView as unknown as {
    Context: React.Context<unknown>;
  }
).Context;
const OPEN = 1;

/**
 * True while the keyboard is up (both platforms), so tall sheet content can
 * shrink to keep its button above the keyboard.
 */
export const useKeyboardVisible = () => {
  const [visible, setVisible] = useState(Keyboard.isVisible());
  useEffect(() => {
    const ios = Platform.OS === 'ios';
    const show = Keyboard.addListener(
      ios ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setVisible(true),
    );
    const hide = Keyboard.addListener(
      ios ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setVisible(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return visible;
};

/**
 * iOS keyboard height (0 when hidden). Android needs none: the window
 * already resizes for the keyboard (adjustResize), lifting the sheet.
 */
const useKeyboardHeight = () => {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }
    const show = Keyboard.addListener('keyboardWillShow', event =>
      setHeight(event.endCoordinates.height),
    );
    const hide = Keyboard.addListener('keyboardWillHide', () => setHeight(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return height;
};

/**
 * List inside a sheet. The sheet library hands drags between the list and
 * the sheet natively (pull down at the top closes it), so this is a plain
 * FlatList; kept as its own name so sheets read clearly.
 */
export function SheetFlatList<T>({
  startsAtTop: _startsAtTop,
  ...props
}: FlatListProps<T> & { startsAtTop?: boolean }) {
  // No scroll bar in sheets, like the rest of the app.
  return <FlatList showsVerticalScrollIndicator={false} {...props} />;
}

/**
 * White sheet with a grab handle over a dimmed screen, built on Software
 * Mansion's native bottom sheet: drag down (from anywhere, or from a list at
 * its top), tap outside or Android back closes it. Rendered through the
 * BottomSheetProvider in App.tsx (inside the app window, so the keyboard
 * shows above it); grows above the keyboard while one is open.
 * Children can change while open (e.g. Set Up → Verify → Recovery Codes).
 */
const BottomSheet: React.FC<Props> = ({ visible, onClose, children }) => {
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();

  return (
    <ModalBottomSheet
      lazy
      detents={DETENTS}
      index={visible ? OPEN : CLOSED}
      onIndexChange={index => {
        if (index === CLOSED) {
          onClose();
        }
      }}
      onCloseRequest={onClose}
      scrimColor={colors.sheetBackdrop}
      scrimAccessibilityLabel={strings.authenticator.closeSheet}
      surface={<View style={styles.surface} />}
      surfaceStyle={styles.surfaceShape}
    >
      <View
        style={[
          styles.content,
          {
            // Grow above the keyboard so a focused field stays visible.
            paddingBottom: keyboardHeight
              ? keyboardHeight + verticalScale(16)
              : insets.bottom + verticalScale(32),
          },
        ]}
      >
        <View style={styles.handle} />
        <ScrollContext.Provider value={null}>{children}</ScrollContext.Provider>
      </View>
    </ModalBottomSheet>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    surface: {
      ...StyleSheet.absoluteFill,
      backgroundColor: colors.white,
    },
    surfaceShape: {
      borderTopLeftRadius: scale(20),
      borderTopRightRadius: scale(20),
    },
    content: {
      paddingHorizontal: scale(24),
      paddingTop: verticalScale(8),
    },
    // Figma: 120 × 4 grey grab handle centred at the top.
    handle: {
      alignSelf: 'center',
      width: scale(120),
      height: verticalScale(4),
      borderRadius: verticalScale(2),
      backgroundColor: colors.border,
      marginBottom: verticalScale(28),
    },
  }),
);

export default BottomSheet;
