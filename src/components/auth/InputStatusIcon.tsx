import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import VerifiedIcon from '../../../assets/images/figma/email_verified.svg';
import { scale } from '../../utils/responsive';

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

  if (status === 'success') {
    // Figma: 24px gradient "verified" badge inside the email field.
    return <VerifiedIcon width={scale(24)} height={scale(24)} />;
  }

  const isSuccess = false;

  return (
    <View
      style={[
        styles.container,
        styles.circle,
        isSuccess ? styles.success : styles.error,
      ]}
    >
      <Icon name={isSuccess ? 'check' : 'x'} size={scale(12)} color="#FFFFFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(24),
    height: scale(24),
    alignItems: 'center',
    justifyContent: 'center',
  },

  circle: {
    borderRadius: scale(10),
  },

  success: {
    backgroundColor: '#7B35FF',
  },

  error: {
    backgroundColor: '#FF2A2A',
  },
});

export default InputStatusIcon;
