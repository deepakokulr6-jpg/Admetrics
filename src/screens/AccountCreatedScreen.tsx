import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import GradientButton from '../components/GradientButton';
import type { AuthScreenProps } from '../navigation/types';

const DRAW_DURATION_MS = 800;
const PATH_LENGTH = 40;

const AccountCreatedScreen: React.FC<AuthScreenProps<'AccountCreated'>> = ({
  navigation,
}) => {
  const pathRef = useRef<Path>(null);

  useEffect(() => {
    let startTime: number | null = null;
    let frameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const progress = Math.min((timestamp - startTime) / DRAW_DURATION_MS, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const offset = PATH_LENGTH * (1 - ease);

      if (pathRef.current) {
        pathRef.current.setNativeProps({ strokeDashoffset: offset });
      }

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      if (frameId != null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <Svg width={48} height={48}>
            <Circle
              cx={24}
              cy={24}
              r={22}
              fill="none"
              stroke="#34C759"
              strokeWidth={4}
            />
            <Path
              ref={pathRef}
              d="M16 24 L22 30 L34 18"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={PATH_LENGTH}
              strokeDashoffset={PATH_LENGTH}
            />
          </Svg>
        </View>

        <Text style={styles.title}>Account Created Successfully!</Text>

        <Text style={styles.description}>
          Your account is ready! You can now Sign In using your email address
          and password.
        </Text>

        <View style={styles.buttonContainer}>
          <GradientButton
            title="Sign In"
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              })
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  iconWrapper: {
    marginBottom: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#221E25',
    textAlign: 'center',
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 8,
    marginBottom: 32,
  },

  buttonContainer: {
    marginBottom: 40,
  },
});

export default AccountCreatedScreen;
