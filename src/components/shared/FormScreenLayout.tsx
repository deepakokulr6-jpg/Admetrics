import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from './ScreenHeader';
import StepProgress from './StepProgress';
import type { useKeyboardAutoScroll } from '../../utils/useKeyboardAutoScroll';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';

type Props = {
  title: string;
  onBack: () => void;
  /** Registration step (1–4) for the step bar; omit to hide it. */
  step?: number;
  /** From useKeyboardAutoScroll(), to keep bottom fields above the keyboard. */
  keyboard?: ReturnType<typeof useKeyboardAutoScroll>;
  contentStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

/**
 * Shell shared by the clinic forms: header, optional step bar, and a
 * keyboard-aware scrolling body.
 */
const FormScreenLayout: React.FC<Props> = ({
  title,
  onBack,
  step,
  keyboard,
  contentStyle,
  children,
}) => (
  // Top inset is handled by ScreenHeader – only pad the bottom here.
  <SafeAreaView style={styles.safeArea} edges={['bottom']}>
    <ScreenHeader title={title} onBackPress={onBack} />
    {step ? <StepProgress currentStep={step} /> : null}

    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        ref={keyboard?.scrollRef}
        onScroll={keyboard?.onScroll}
        onLayout={keyboard?.onLayout}
        scrollEventThrottle={16}
        style={styles.flex}
        contentContainerStyle={[styles.content, contentStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
);

/** Styles reused inside form bodies. */
export const formStyles = themedStyles(() =>
  StyleSheet.create({
    heading: {
      fontSize: normalizeFont(16),
      lineHeight: normalizeFont(19),
      fontFamily: fonts.semibold,
      color: colors.text,
      marginBottom: verticalScale(16),
    },
    /** Short forms: pin the button low on the screen (Figma y634 of 800). */
    pinnedContent: {
      flexGrow: 1,
      paddingBottom: verticalScale(110),
    },
    pinnedButton: {
      marginTop: 'auto',
      paddingTop: verticalScale(24),
    },
  }),
);

const styles = themedStyles(() =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.white,
    },
    flex: {
      flex: 1,
    },
    content: {
      width: '100%',
      maxWidth: scale(420),
      alignSelf: 'center',
      paddingHorizontal: scale(16),
      paddingBottom: verticalScale(32),
    },
  }),
);

export default FormScreenLayout;
