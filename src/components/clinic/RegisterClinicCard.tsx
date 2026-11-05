import React from 'react';
import { StyleSheet, Pressable } from 'react-native';

import RegisterIcon from '../../../assets/images/register.svg';
import { scale } from '../../utils/responsive';

type Props = {
  onPress: () => void;
  title?: string;
};

/**
 * The supplied register.svg already contains both the gradient circular plus
 * icon and the "Register Your Clinic" label, so it is rendered as one asset to
 * preserve the Figma proportions instead of duplicating the text.
 */
const RegisterClinicCard: React.FC<Props> = ({
  onPress,
  title = 'Register Your Clinic',
}) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <RegisterIcon width={scale(140)} height={scale(94)} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    padding: scale(8),
  },

  pressed: {
    opacity: 0.7,
  },
});

export default RegisterClinicCard;
