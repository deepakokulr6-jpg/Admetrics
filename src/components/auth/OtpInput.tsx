import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
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
};

const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChangeText,
  length = 6,
  disabled = false,
}) => {
  const inputRefs = useRef<any[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const setDigit = (index: number, digit: string) => {
    const chars = value.padEnd(length, ' ').split('');
    chars[index] = digit;
    onChangeText(chars.join('').replace(/\s/g, ''));
  };

  const handleChange = (text: string, index: number) => {
    const digits = text.replace(/\D/g, '');

    if (digits.length === 0) {
      setDigit(index, ' ');
      return;
    }

    // Handle pasting a complete OTP into any box.
    if (digits.length > 1) {
      const chars = value.padEnd(length, ' ').split('');

      for (let i = 0; i < digits.length && index + i < length; i++) {
        chars[index + i] = digits[i];
      }

      onChangeText(chars.join('').replace(/\s/g, ''));
      inputRefs.current[Math.min(index + digits.length, length - 1)]?.focus();
      return;
    }

    setDigit(index, digits);

    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length }, (_, index) => (
        <TextInput
          key={index}
          ref={ref => {
            inputRefs.current[index] = ref;
          }}
          style={[
            styles.otpBox,
            focusedIndex === index && styles.otpBoxFocused,
            value[index] ? styles.otpBoxFilled : null,
            disabled && styles.otpBoxDisabled,
          ]}
          editable={!disabled}
          placeholder={disabled ? '*' : undefined}
          placeholderTextColor={colors.borderLight}
          value={value[index] || ''}
          onChangeText={text => handleChange(text, index)}
          onKeyPress={event => handleKeyPress(event, index)}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(null)}
          keyboardType="number-pad"
          selectTextOnFocus
          textAlign="center"
          autoCorrect={false}
          autoComplete="one-time-code"
          selectionColor={colors.primary}
          accessibilityLabel={strings.auth.otpDigit(index + 1)}
        />
      ))}
    </View>
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
    padding: 0,
    fontSize: normalizeFont(14),
    fontFamily: fonts.regular,
    color: colors.text,
  },

  otpBoxFocused: {
    borderColor: colors.primary,
  },

  otpBoxFilled: {
    fontFamily: fonts.semibold,
  },
  otpBoxDisabled: {
    borderColor: colors.borderLight,
    fontFamily: fonts.semibold,
  },
});

export default OtpInput;
