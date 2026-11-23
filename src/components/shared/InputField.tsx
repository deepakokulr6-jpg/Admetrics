import React, { ReactNode, useState } from 'react';
import {
  View,
  Text,
  DeviceEventEmitter,
  TextInput,
  StyleSheet,
  ViewStyle,
  KeyboardTypeOptions,
  TextInputProps,
  Pressable,
} from 'react-native';

import { INPUT_FOCUSED_EVENT } from '../../utils/useKeyboardAutoScroll';
import EmailIcon from '../../../assets/images/figma/mail.svg';
import PasswordIcon from '../../../assets/images/figma/lock.svg';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import strings from '../../constants/strings';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';

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
  /** Opens a picker on tap instead of the keyboard (looks like a normal field). */
  onPress?: () => void;
  /** For moving focus here from the previous field's "Next" key. */
  inputRef?: React.Ref<React.ComponentRef<typeof TextInput>>;
  returnKeyType?: TextInputProps['returnKeyType'];
  onSubmitEditing?: TextInputProps['onSubmitEditing'];
  /** "submit" keeps the keyboard up while focus moves to the next field. */
  submitBehavior?: TextInputProps['submitBehavior'];
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
  onPress,
  inputRef,
  returnKeyType,
  onSubmitEditing,
  submitBehavior,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const InputIcon =
    iconName === 'email'
      ? EmailIcon
      : iconName === 'password'
      ? PasswordIcon
      : null;

  const handleFocus: TextInputProps['onFocus'] = event => {
    DeviceEventEmitter.emit(INPUT_FOCUSED_EVENT);
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
          {required ? (
            <Text style={styles.required}>{strings.common.requiredMark}</Text>
          ) : null}
        </Text>
      ) : null}

      <Pressable
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={onPress ? label : undefined}
        style={[
          styles.inputBox,
          multiline && styles.multilineBox,
          isFocused ? styles.inputBoxFocused : null,
          error ? styles.inputBoxError : null,
          !editable && !onPress && styles.inputBoxDisabled,
        ]}
      >
        {InputIcon ? (
          <View style={styles.icon}>
            <InputIcon
              width={iconName === 'password' ? scale(13.5) : scale(24)}
              height={iconName === 'password' ? scale(15.3) : scale(24)}
              color={colors.text}
            />
          </View>
        ) : null}

        <TextInput
          ref={inputRef}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          submitBehavior={submitBehavior}
          style={[
            styles.input,
            InputIcon ? styles.inputWithIcon : null,
            multiline && styles.multilineInput,
            value.length > 0 && styles.inputFilled,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.border}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          selectionColor={colors.primary}
          textContentType={textContentType}
          autoComplete={autoComplete}
          maxLength={maxLength}
          editable={editable && !onPress}
          pointerEvents={onPress ? 'none' : undefined}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {rightElement ? (
          <View style={styles.rightElement}>{rightElement}</View>
        ) : null}
      </Pressable>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    container: {
      width: '100%',
      marginBottom: verticalScale(16),
    },

    label: {
      fontSize: normalizeFont(12),
      lineHeight: normalizeFont(16),
      fontFamily: fonts.regular,
      color: colors.text,
      marginBottom: verticalScale(8),
    },

    required: {
      color: colors.red,
    },

    inputBox: {
      width: '100%',
      minHeight: verticalScale(40),
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: scale(6),
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: scale(16),
    },

    inputBoxError: {
      borderColor: colors.red,
    },

    inputBoxFocused: {
      borderColor: colors.text,
    },

    inputBoxDisabled: {
      backgroundColor: colors.disabled,
      borderColor: colors.disabled,
    },

    input: {
      flex: 1,
      minHeight: verticalScale(38),
      paddingVertical: 0,
      fontSize: normalizeFont(14),
      fontFamily: fonts.regular,
      color: colors.text,
    },

    inputFilled: {
      fontFamily: fonts.semibold,
      color: colors.text,
    },

    icon: {
      width: scale(24),
      height: scale(24),
      alignItems: 'center',
      justifyContent: 'center',
    },

    inputWithIcon: {
      marginLeft: scale(8),
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
      color: colors.red,
    },
  }),
);

export default InputField;
