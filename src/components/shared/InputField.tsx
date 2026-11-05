import React, { ReactNode, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  KeyboardTypeOptions,
  TextInputProps,
} from 'react-native';

import EmailIcon from '../../../assets/images/email.svg';
import PasswordIcon from '../../../assets/images/password.svg';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';

type InputFieldProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  iconName?: 'email' | 'password';
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  containerStyle?: ViewStyle;
  rightElement?: ReactNode;
  textContentType?: TextInputProps['textContentType'];
  autoComplete?: TextInputProps['autoComplete'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  maxLength?: number;
  editable?: boolean;
  required?: boolean;
  error?: string | null;
  multiline?: boolean;
  numberOfLines?: number;
  onFocus?: TextInputProps['onFocus'];
  onBlur?: TextInputProps['onBlur'];
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  iconName,
  secureTextEntry = false,
  keyboardType = 'default',
  containerStyle,
  rightElement,
  textContentType,
  autoComplete,
  autoCapitalize = 'none',
  maxLength,
  editable = true,
  required = false,
  error,
  multiline = false,
  numberOfLines,
  onFocus,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const InputIcon =
    iconName === 'email'
      ? EmailIcon
      : iconName === 'password'
      ? PasswordIcon
      : null;

  const handleFocus: TextInputProps['onFocus'] = event => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur: TextInputProps['onBlur'] = event => {
    setIsFocused(false);
    onBlur?.(event);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}

      <View
        style={[
          styles.inputBox,
          multiline && styles.multilineBox,
          isFocused ? styles.inputBoxFocused : null,
          error ? styles.inputBoxError : null,
          !editable && styles.inputBoxDisabled,
        ]}
      >
        {InputIcon ? (
          <InputIcon width={scale(20)} height={scale(20)} />
        ) : null}

        <TextInput
          style={[
            styles.input,
            InputIcon ? styles.inputWithIcon : null,
            multiline && styles.multilineInput,
            value.length > 0 && styles.inputFilled,
          ]}
          placeholder={placeholder}
          placeholderTextColor="#AAAAAA"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          selectionColor="#0265FB"
          textContentType={textContentType}
          autoComplete={autoComplete}
          maxLength={maxLength}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {rightElement ? (
          <View style={styles.rightElement}>{rightElement}</View>
        ) : null}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: verticalScale(14),
  },

  label: {
    fontSize: normalizeFont(12),
    lineHeight: normalizeFont(16),
    fontWeight: '400',
    color: '#221E25',
    marginBottom: verticalScale(6),
  },

  required: {
    color: '#D93025',
  },

  inputBox: {
    width: '100%',
    minHeight: verticalScale(40),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#AAAAAA',
    borderRadius: scale(6),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
  },

  inputBoxError: {
    borderColor: '#D93025',
  },

  inputBoxFocused: {
    borderColor: '#221E25',
  },

  inputBoxDisabled: {
    backgroundColor: '#F7F7F7',
    borderColor: '#DDDDDD',
  },

  input: {
    flex: 1,
    minHeight: verticalScale(38),
    paddingVertical: 0,
    fontSize: normalizeFont(14),
    fontWeight: '400',
    color: '#221E25',
  },

  inputFilled: {
    fontWeight: '600',
    color: '#221E25',
  },

  inputWithIcon: {
    marginLeft: scale(10),
  },

  multilineBox: {
    minHeight: verticalScale(76),
    alignItems: 'flex-start',
    paddingVertical: verticalScale(10),
  },

  multilineInput: {
    minHeight: verticalScale(54),
    textAlignVertical: 'top',
  },

  rightElement: {
    marginLeft: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorText: {
    marginTop: verticalScale(4),
    fontSize: normalizeFont(11),
    lineHeight: normalizeFont(15),
    color: '#D93025',
  },
});

export default InputField;
