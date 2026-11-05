import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { normalizeFont, verticalScale } from '../../utils/responsive';

type AuthFooterProps = {
  text: string;
  onPress: () => void;
  highlight?: string;
  accent?: boolean;
  style?: ViewStyle;
};

const AuthFooter: React.FC<AuthFooterProps> = ({
  text,
  onPress,
  highlight,
  accent = false,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, style]}
      accessibilityRole="button"
    >
      <Text style={[styles.text, accent && styles.accent]}>
        {text}
        {highlight ? <Text style={styles.highlight}> {highlight}</Text> : null}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    paddingVertical: verticalScale(2),
  },

  text: {
    fontSize: normalizeFont(14),
    lineHeight: normalizeFont(20),
    fontWeight: '400',
    color: '#221E25',
    textAlign: 'center',
  },

  accent: {
    color: '#7B35FF',
    fontWeight: '700',
    textDecorationLine: 'underline',
    textDecorationColor: '#7B35FF',
  },

  highlight: {
    color: '#7B35FF',
    fontWeight: '700',
    textDecorationLine: 'underline',
    textDecorationColor: '#7B35FF',
  },
});

export default AuthFooter;
