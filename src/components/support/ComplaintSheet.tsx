import React, { useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';

import BottomSheet, { useKeyboardVisible } from '../shared/BottomSheet';
import GradientButton from '../shared/GradientButton';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';
import strings from '../../constants/strings';
import { LIMITS } from '../../constants/fieldLimits';

const t = strings.complaint;
export const COMPLAINT_MAX_LENGTH = LIMITS.complaint.max;

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
};

/**
 * Figma "Raise a Complaint" sheet: a large text box (up to 1000
 * characters, with a live counter) and Submit, enabled once something is
 * typed.
 */
const ComplaintSheet: React.FC<Props> = ({ visible, onClose, onSubmit }) => {
  const [text, setText] = useState('');
  const trimmed = text.trim();
  // Shorter box while typing, so Submit stays above the keyboard.
  const keyboardOpen = useKeyboardVisible();

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={styles.title}>{t.title}</Text>
      <Text style={styles.intro}>{t.intro}</Text>

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={t.placeholder}
        placeholderTextColor={colors.placeholder}
        multiline
        maxLength={COMPLAINT_MAX_LENGTH}
        textAlignVertical="top"
        autoCapitalize="sentences"
        style={[styles.input, keyboardOpen && styles.inputCompact]}
        accessibilityLabel={t.title}
      />
      <Text style={styles.counter}>
        {t.counter(text.length, COMPLAINT_MAX_LENGTH)}
      </Text>

      <GradientButton
        title={t.submit}
        // Enough to describe the issue (10+ characters).
        disabled={trimmed.length < LIMITS.complaint.min}
        onPress={() => {
          onSubmit(trimmed);
          setText('');
        }}
        style={keyboardOpen ? styles.buttonCompact : styles.button}
      />
    </BottomSheet>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    title: {
      fontSize: normalizeFont(18),
      lineHeight: normalizeFont(24),
      fontFamily: fonts.bold,
      color: colors.textStrong,
    },
    intro: {
      marginTop: verticalScale(8),
      fontSize: normalizeFont(12),
      lineHeight: normalizeFont(18),
      fontFamily: fonts.regular,
      color: colors.bodyText,
    },
    // Figma: tall box with an 8px radius.
    input: {
      marginTop: verticalScale(16),
      height: verticalScale(280),
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(14),
      paddingBottom: verticalScale(14),
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: scale(8),
      fontSize: normalizeFont(14),
      lineHeight: normalizeFont(20),
      fontFamily: fonts.regular,
      color: colors.textStrong,
    },
    counter: {
      alignSelf: 'flex-end',
      marginTop: verticalScale(8),
      marginRight: scale(8),
      fontSize: normalizeFont(10),
      fontFamily: fonts.regular,
      color: colors.bodyText,
    },
    button: {
      marginTop: verticalScale(36),
    },
    // Keyboard open: box and gap shrink so the whole sheet fits above it.
    inputCompact: {
      height: verticalScale(130),
    },
    buttonCompact: {
      marginTop: verticalScale(16),
    },
  }),
);

export default ComplaintSheet;
