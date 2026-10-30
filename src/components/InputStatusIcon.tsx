import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

type Props = {
  status: 'loading' | 'success' | 'error' | 'none';
};

const InputStatusIcon: React.FC<Props> = ({ status }) => {
  if (status === 'none') {
    return null;
  }

  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#0265FB" />
      </View>
    );
  }

  const isSuccess = status === 'success';

  return (
    <View
      style={[
        styles.container,
        styles.circle,
        isSuccess ? styles.success : styles.error,
      ]}
    >
      <Icon name={isSuccess ? 'check' : 'x'} size={12} color="#FFFFFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  circle: {
    borderRadius: 10,
  },

  success: {
    backgroundColor: '#7B35FF',
  },

  error: {
    backgroundColor: '#E53935',
  },
});

export default InputStatusIcon;
