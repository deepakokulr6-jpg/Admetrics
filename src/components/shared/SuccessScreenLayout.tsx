import React from 'react';
import { View, Image, StyleSheet, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import AppText from './AppText';
import GradientButton from './GradientButton';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';

type SuccessScreenLayoutProps = {
  title: string;
  description: string;
  buttonText: string;
  onButtonPress: () => void;
};

// Figma (Frame 37 / Frame 38): a white sheet, 682px tall on an 800px frame,
// with 40px top corners over the brand gradient. Check 80px, title 18px bold
// #121212, two-line 12px #444 description, standard 160x36 button.
const SuccessScreenLayout: React.FC<SuccessScreenLayoutProps> = ({
  title,
  description,
  buttonText,
  onButtonPress,
}) => {
  return (
    <LinearGradient
      colors={['#0265FB', '#B43AFC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.backdrop}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.sheet}>
        <Image
          source={require('../../../assets/images/figma/success_check.png')}
          style={styles.check}
          resizeMode="contain"
        />

        <AppText variant="headline" color="textDark" align="center">
          {title}
        </AppText>
        <AppText
          variant="label"
          color="bodyText"
          align="center"
          style={styles.description}
        >
          {description}
        </AppText>

        <View style={styles.button}>
          <GradientButton title={buttonText} onPress={onButtonPress} />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    height: '85.25%', // 682 / 800
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: scale(40),
    borderTopRightRadius: scale(40),
    alignItems: 'center',
    paddingTop: verticalScale(196),
    paddingHorizontal: scale(16),
  },
  check: {
    width: scale(80),
    height: scale(80),
  },
  description: {
    marginTop: verticalScale(8),
    lineHeight: normalizeFont(18),
  },
  button: {
    marginTop: verticalScale(18),
  },
});

export default SuccessScreenLayout;
