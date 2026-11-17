import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import GradientText from '../shared/GradientText';
import { normalizeFont, verticalScale } from '../../utils/responsive';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';
import { themedStyles } from '../../theme/themedStyles';

type ForgotPasswordLinkProps = {
  onPress: () => void;
};

// Figma: 12px medium gradient text, right aligned under the password field.
const ForgotPasswordLink: React.FC<ForgotPasswordLinkProps> = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    accessibilityRole="button"
    accessibilityLabel={strings.auth.forgotPassword}
    style={styles.container}
  >
    <GradientText style={styles.text}>
      {strings.auth.forgotPassword}
    </GradientText>
  </TouchableOpacity>
);

const styles = themedStyles(() =>
  StyleSheet.create({
    container: {
      alignSelf: 'flex-end',
      paddingVertical: verticalScale(2),
    },
    text: {
      fontSize: normalizeFont(12),
      fontFamily: fonts.medium,
    },
  }),
);

export default ForgotPasswordLink;
