import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { normalizeFont, verticalScale } from '../../utils/responsive';

type ForgotPasswordLinkProps = {
  onPress: () => void;
};

const ForgotPasswordLink: React.FC<ForgotPasswordLinkProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Forgot Password?"
      style={styles.container}
    >
      <Text style={styles.text}>Forgot Password?</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    paddingVertical: verticalScale(2),
  },

  text: {
    fontSize: normalizeFont(12),
    lineHeight: normalizeFont(16),
    fontWeight: '500',
    color: '#7B35FF',
  },
});

export default ForgotPasswordLink;
