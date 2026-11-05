import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';

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
    fontWeight: '700',
    color: '#221E25',
    textAlign: 'center',
    marginBottom: verticalScale(8),
  },

  description: {
    fontSize: normalizeFont(14),
    lineHeight: normalizeFont(20),
    fontWeight: '400',
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: scale(8),
  },
});

export default SuccessMessage;
