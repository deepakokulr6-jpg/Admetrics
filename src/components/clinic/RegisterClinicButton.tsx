import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import AppText from '../shared/AppText';
import { scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import strings from '../../constants/strings';
import { themedStyles } from '../../theme/themedStyles';

type Props = {
  onPress: () => void;
};

// Figma: 48px solid blue "+" button with "Register Your Clinic" 12px medium
// text 12px below it.
const RegisterClinicButton: React.FC<Props> = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    accessibilityRole="button"
    accessibilityLabel={strings.common.registerYourClinic}
    style={styles.container}
  >
    <View style={styles.circle}>
      <Svg width={scale(20)} height={scale(20)} viewBox="0 0 20 20">
        <Path
          d="M10 3v14M3 10h14"
          stroke={colors.onAccent}
          strokeWidth={2.4}
          strokeLinecap="round"
        />
      </Svg>
    </View>
    <AppText variant="labelMedium" style={styles.text}>
      {strings.common.registerYourClinic}
    </AppText>
  </TouchableOpacity>
);

const styles = themedStyles(() =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    circle: {
      width: scale(48),
      height: scale(48),
      borderRadius: scale(24),
      backgroundColor: colors.buttonPrimary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      marginTop: verticalScale(12),
    },
  }),
);

export default RegisterClinicButton;
