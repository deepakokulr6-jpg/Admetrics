import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    color: '#221E25',
    textAlign: 'center',
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});

export default SuccessMessage;
