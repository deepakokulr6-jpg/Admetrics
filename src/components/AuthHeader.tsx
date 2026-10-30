import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
    color: '#221E25',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: '#221E25',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default AuthHeader;
