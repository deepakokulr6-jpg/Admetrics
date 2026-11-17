import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';

type GradientButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={[styles.wrapper, style]}
    >
      <View style={[styles.button, isDisabled && styles.buttonDisabled]}>
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.buttonText}>{title}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: scale(160),
    maxWidth: '100%',
    height: verticalScale(36),
    alignSelf: 'center',
  },

  button: {
    flex: 1,
    width: '100%',
    height: verticalScale(36),
    borderRadius: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.buttonPrimary,
  },

  buttonDisabled: {
    backgroundColor: colors.disabledButton,
  },

  buttonText: {
    fontSize: normalizeFont(14),
    lineHeight: normalizeFont(18),
    fontFamily: fonts.bold,
    color: colors.white,
    textAlign: 'center',
  },
});

export default GradientButton;
