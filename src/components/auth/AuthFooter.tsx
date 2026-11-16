import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ViewStyle } from 'react-native';
import GradientText from '../shared/GradientText';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';

type AuthFooterProps = {
  text: string;
  onPress: () => void;
  highlight?: string;
  // When true the whole text is the gradient link (e.g. "New User?").
  accent?: boolean;
  style?: ViewStyle;
};

// Figma: 14px regular #221E25 text followed by a bold gradient link.
const AuthFooter: React.FC<AuthFooterProps> = ({
  text,
  onPress,
  highlight,
  accent = false,
  style,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[styles.container, style]}
    accessibilityRole="button"
  >
    <View style={styles.row}>
      {accent ? (
        <GradientText style={styles.link}>{text}</GradientText>
      ) : (
        <>
          <Text style={styles.text}>{text}</Text>
          {highlight ? (
            <View style={styles.highlight}>
              <GradientText style={styles.link}>{highlight}</GradientText>
            </View>
          ) : null}
        </>
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    paddingVertical: verticalScale(2),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: normalizeFont(14),
    color: '#221E25',
  },
  highlight: {
    marginLeft: scale(4),
  },
  link: {
    fontSize: normalizeFont(14),
    fontWeight: '700',
  },
});

export default AuthFooter;
