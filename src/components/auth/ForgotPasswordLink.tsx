import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import GradientText from '../shared/GradientText';
import { normalizeFont, verticalScale } from '../../utils/responsive';

type ForgotPasswordLinkProps = {
  onPress: () => void;
};

// Figma: 12px medium gradient text, right aligned under the password field.
const ForgotPasswordLink: React.FC<ForgotPasswordLinkProps> = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    accessibilityRole="button"
    accessibilityLabel="Forgot Password?"
    style={styles.container}
  >
    <GradientText style={styles.text}>Forgot Password?</GradientText>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    paddingVertical: verticalScale(2),
  },
  text: {
    fontSize: normalizeFont(12),
    fontWeight: '500',
  },
});

export default ForgotPasswordLink;
