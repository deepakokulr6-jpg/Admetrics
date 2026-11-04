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

import EmailIcon from '../../assets/images/email.svg';
import PasswordIcon from '../../assets/images/password.svg';

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
        {InputIcon ? <InputIcon width={20} height={20} /> : null}

        <TextInput
          style={[
            styles.input,
            InputIcon ? styles.inputWithIcon : null,
            multiline && styles.multilineInput,
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
    marginBottom: 14,
  },

  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: '#221E25',
    marginBottom: 6,
  },

  required: {
    color: '#D93025',
  },

  inputBox: {
    width: '100%',
    minHeight: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#AAAAAA',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
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
    minHeight: 38,
    paddingVertical: 0,
    fontSize: 14,
    fontWeight: '400',
    color: '#221E25',
  },

  inputWithIcon: {
    marginLeft: 10,
  },

  multilineBox: {
    minHeight: 76,
    alignItems: 'flex-start',
    paddingVertical: 10,
  },

  multilineInput: {
    minHeight: 54,
    textAlignVertical: 'top',
  },

  rightElement: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorText: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 15,
    color: '#D93025',
  },
});

export default InputField;
