import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';

type OtpInputProps = {
  value: string;
  onChangeText: (otp: string) => void;
  length?: number;
};

const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChangeText,
  length = 6,
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
          ]}
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
          selectionColor="#0265FB"
          accessibilityLabel={`OTP digit ${index + 1}`}
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
    gap: scale(8),
  },

  otpBox: {
    flex: 1,
    maxWidth: scale(40),
    height: verticalScale(40),
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: scale(6),
    backgroundColor: '#FFFFFF',
    padding: 0,
    fontSize: normalizeFont(14),
    fontWeight: '400',
    color: '#221E25',
  },

  otpBoxFocused: {
    borderColor: '#0265FB',
  },

  otpBoxFilled: {
    fontWeight: '600',
  },
});

export default OtpInput;
