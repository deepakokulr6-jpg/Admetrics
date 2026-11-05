import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AppLogo from './AppLogo';
import GradientButton from './GradientButton';
import SuccessMessage from './SuccessMessage';
import { scale, verticalScale } from '../../utils/responsive';

type SuccessScreenLayoutProps = {
  title: string;
  description: string;
  buttonText: string;
  onButtonPress: () => void;
};

const SuccessScreenLayout: React.FC<SuccessScreenLayoutProps> = ({
  title,
  description,
  buttonText,
  onButtonPress,
}) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.logo}>
            <AppLogo width={scale(160)} />
          </View>

          <LinearGradient
            colors={['#0265FB', '#B43AFC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconCircle}
          >
            <Ionicons name="checkmark-sharp" size={scale(34)} color="#FFFFFF" />
          </LinearGradient>

          <SuccessMessage title={title} description={description} />

          <View style={styles.button}>
            <GradientButton title={buttonText} onPress={onButtonPress} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  flex: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(32),
  },

  content: {
    width: '100%',
    maxWidth: scale(360),
    alignItems: 'center',
  },

  logo: {
    alignItems: 'center',
    marginBottom: verticalScale(32),
  },

  iconCircle: {
    width: scale(72),
    height: scale(72),
    borderRadius: scale(36),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(20),
  },

  button: {
    marginTop: verticalScale(36),
  },
});

export default SuccessScreenLayout;
