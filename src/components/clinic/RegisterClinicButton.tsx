import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import AppText from '../shared/AppText';
import RegisterPlus from '../../../assets/images/figma/register_plus.svg';
import { scale, verticalScale } from '../../utils/responsive';

type Props = {
  onPress: () => void;
};

// Figma: 48px gradient "+" button with "Register Your Clinic" 12px medium
// text 12px below it.
const RegisterClinicButton: React.FC<Props> = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    accessibilityRole="button"
    accessibilityLabel="Register Your Clinic"
    style={styles.container}
  >
    <RegisterPlus width={scale(48)} height={scale(48)} />
    <AppText variant="labelMedium" style={styles.text}>
      Register Your Clinic
    </AppText>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: {
    marginTop: verticalScale(12),
  },
});

export default RegisterClinicButton;
