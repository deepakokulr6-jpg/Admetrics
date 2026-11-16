import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { normalizeFont, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';

type AuthHeaderProps = {
  title: string;
  subtitle?: string;
};

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },

  title: {
    fontSize: normalizeFont(20),
    lineHeight: normalizeFont(24),
    fontFamily: fonts.bold,
    color: colors.text,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: normalizeFont(14),
    lineHeight: normalizeFont(20),
    fontFamily: fonts.regular,
    color: colors.text,
    textAlign: 'center',
    marginTop: verticalScale(8),
  },
});

export default AuthHeader;
