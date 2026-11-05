import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { scale, verticalScale, moderateScale } from '../../utils/responsive';

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
      <LinearGradient
        colors={isDisabled ? ['#D9D9D9', '#D9D9D9'] : ['#0265FB', '#B43AFC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>{title}</Text>
        )}
      </LinearGradient>
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
    borderRadius: moderateScale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    fontSize: moderateScale(14),
    lineHeight: verticalScale(18),
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default GradientButton;
