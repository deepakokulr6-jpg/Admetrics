import React, { ReactNode } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  KeyboardTypeOptions,
} from 'react-native';

import EmailIcon from '../../assets/images/email.svg';
import PasswordIcon from '../../assets/images/password.svg';

type InputFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  iconName: 'email' | 'password';
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  containerStyle?: ViewStyle;
  rightElement?: ReactNode;
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
}) => {
  const InputIcon = iconName === 'email' ? EmailIcon : PasswordIcon;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={styles.inputBox}>
        <InputIcon width={24} height={24} />

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#AAAAAA"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
          selectionColor="#0265FB"
        />

        {rightElement ? (
          <View style={styles.rightElement}>{rightElement}</View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },

  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: '#221E25',
    marginBottom: 8,
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

  input: {
    flex: 1,
    minHeight: 38,
    marginLeft: 10,
    paddingVertical: 0,
    fontSize: 14,
    fontWeight: '400',
    color: '#221E25',
  },

  rightElement: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default InputField;