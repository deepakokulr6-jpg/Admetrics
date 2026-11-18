import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
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

/**
 * White sheet with a grab handle that glides up over the dimmed screen.
 * Tap outside or Android back closes it. Children can change while it is
 * open (e.g. Set Up → Verify → Recovery Codes) without re-animating.
 */
const BottomSheet: React.FC<Props> = ({ visible, onClose, children }) => {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const backdrop = useRef(new Animated.Value(0)).current;
  const offset = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 1,
          duration: 240,
          useNativeDriver: true,
        }),
        Animated.timing(offset, {
          toValue: 0,
          duration: 340,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(offset, {
          toValue: height,
          duration: 260,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => finished && setMounted(false));
    }
  }, [visible, backdrop, offset, height]);

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.backdrop, { opacity: backdrop }]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={strings.authenticator.closeSheet}
        />
      </Animated.View>

      <KeyboardAvoidingView
        style={styles.anchor}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        pointerEvents="box-none"
      >
        <Animated.View
          style={[
            styles.sheet,
            {
              maxHeight: height - insets.top - verticalScale(24),
              paddingBottom: insets.bottom + verticalScale(32),
              transform: [{ translateY: offset }],
            },
          ]}
        >
          <View style={styles.handle} />
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor: colors.sheetBackdrop,
    },
    anchor: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    sheet: {
      paddingHorizontal: scale(24),
      paddingTop: verticalScale(8),
      borderTopLeftRadius: scale(20),
      borderTopRightRadius: scale(20),
      backgroundColor: colors.white,
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
