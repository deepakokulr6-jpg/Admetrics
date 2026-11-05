import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';

type Props = {
  onPress: () => void;
};

const RegisterClinicButton: React.FC<Props> = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    accessibilityRole="button"
  >
    <LinearGradient
      colors={['#0265FB', '#B43AFC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.button}
    >
      <Text style={styles.text}>Register Clinic</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(28),
    borderRadius: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: normalizeFont(14),
  },
});

export default RegisterClinicButton;
