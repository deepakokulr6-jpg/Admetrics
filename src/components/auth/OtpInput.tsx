import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { normalizeFont, scale } from '../../utils/responsive';
import strings from '../../constants/strings';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';

type OtpInputProps = {
  value: string;
  onChangeText: (otp: string) => void;
  length?: number;
  // Figma: before the OTP is sent the boxes are greyed out with "*".
  disabled?: boolean;
  /** Called once all digits are entered (typed, pasted or autofilled). */
  onComplete?: (otp: string) => void;
  autoFocus?: boolean;
};

/**
 * One real TextInput (invisible, stretched over the boxes) drives six visual
 * boxes. A single input is what makes paste, iOS "From Messages" autofill and
 * Android SMS autofill fill every box in one go, and backspace always walks
 * back cleanly – per-box inputs drop or split pasted codes on both platforms.
 */
const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChangeText,
  length = 6,
  disabled = false,
  onComplete,
  autoFocus = false,
}) => {
  const inputRef = useRef<React.ComponentRef<typeof TextInput>>(null);
  const [focused, setFocused] = useState(false);
  const caret = useRef(new Animated.Value(1)).current;

  // Blinking caret in the active box.
  useEffect(() => {
    if (!focused) {
      return;
    }
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(caret, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(caret, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );
    blink.start();
    return () => {
      blink.stop();
      caret.setValue(1);
    };
  }, [focused, caret]);

  // Clear focus when the boxes get locked (e.g. email edited).
  useEffect(() => {
    if (disabled) {
      inputRef.current?.blur();
    }
  }, [disabled]);

  const handleChange = (text: string) => {
    // Keep digits only: pasted text may contain spaces, dashes or words
    // ("Your code is 123-456").
    const digits = text.replace(/\D/g, '').slice(0, length);
    onChangeText(digits);

    if (digits.length === length && value.length !== length) {
      onComplete?.(digits);
    }
  };

  const activeIndex = Math.min(value.length, length - 1);

  return (
    <Pressable
      style={styles.container}
      onPress={() => inputRef.current?.focus()}
      disabled={disabled}
      accessible={false}
    >
      {Array.from({ length }, (_, index) => {
        const digit = value[index];
        const isActive = focused && !disabled && index === activeIndex;

        return (
          <View
            key={index}
            style={[
              styles.otpBox,
              isActive && styles.otpBoxFocused,
              disabled && styles.otpBoxDisabled,
            ]}
          >
            {digit ? (
              <Text style={styles.digit}>{digit}</Text>
            ) : disabled ? (
              <Text style={styles.placeholder}>{strings.auth.otpMask}</Text>
            ) : isActive ? (
              <Animated.View style={[styles.caret, { opacity: caret }]} />
            ) : null}
          </View>
        );
      })}

      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={value}
        onChangeText={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        editable={!disabled}
        autoFocus={autoFocus}
        maxLength={length}
        keyboardType="number-pad"
        // iOS: "From Messages / Mail" suggestion above the keyboard.
        textContentType="oneTimeCode"
        // Android: SMS / Google autofill suggestion.
        autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
        importantForAutofill="yes"
        autoCorrect={false}
        spellCheck={false}
        contextMenuHidden={false}
        caretHidden
        selectionColor={colors.transparent}
        cursorColor={colors.transparent}
        accessibilityLabel={strings.auth.otpCode(length)}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  otpBox: {
    width: scale(40),
    height: scale(40),
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: scale(6),
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  otpBoxFocused: {
    borderColor: colors.primary,
  },

  otpBoxDisabled: {
    borderColor: colors.borderLight,
  },

  digit: {
    fontSize: normalizeFont(14),
    fontFamily: fonts.semibold,
    color: colors.text,
  },

  placeholder: {
    fontSize: normalizeFont(14),
    fontFamily: fonts.semibold,
    color: colors.borderLight,
  },

  caret: {
    width: 1.5,
    height: scale(18),
    backgroundColor: colors.primary,
  },

  // Covers the whole row so a tap or long-press (Paste) anywhere reaches it,
  // but it is never visible. Not opacity 0: some Android versions skip
  // touch / autofill on fully transparent views.
  hiddenInput: {
    ...StyleSheet.absoluteFill,
    opacity: 0.011,
    color: colors.transparent,
    fontSize: 1,
    padding: 0,
  },
});

export default OtpInput;
