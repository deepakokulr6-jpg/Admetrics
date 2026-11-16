import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';

type SuccessMessageProps = {
  title: string;
  description: string;
};

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  title,
  description,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: normalizeFont(20),
    lineHeight: normalizeFont(26),
    fontFamily: fonts.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: verticalScale(8),
  },

  description: {
    fontSize: normalizeFont(14),
    lineHeight: normalizeFont(20),
    fontFamily: fonts.regular,
    color: colors.secondaryText,
    textAlign: 'center',
    paddingHorizontal: scale(8),
  },
});

export default SuccessMessage;
