import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppLogo from '../shared/AppLogo';
import { scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';

type Props = {
  /** Title block under the logo (usually <AuthHeader />). */
  header: React.ReactNode;
  /** The form: fields, messages, button and footer link. */
  children: React.ReactNode;
};

/**
 * Shell shared by Login, Create Account, Verify OTP / Forgot Password and
 * Confirm Password. Figma: logo top at y144 of 800, 24px gutters, the form
 * 24px under the title, and the whole page scrolls above the keyboard.
 */
const AuthScreenLayout: React.FC<Props> = ({ header, children }) => (
  <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
    <StatusBar barStyle="dark-content" />

    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.logo}>
            <AppLogo width={scale(200)} />
          </View>

          {header}

          <View style={styles.form}>{children}</View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: scale(24),
    // Status bar ≈ 24, so the logo lands at y144.
    paddingTop: verticalScale(120),
    paddingBottom: verticalScale(32),
  },
  content: {
    width: '100%',
    maxWidth: scale(360),
    alignSelf: 'center',
  },
  logo: {
    alignItems: 'center',
    marginBottom: verticalScale(40),
  },
  form: {
    marginTop: verticalScale(24),
  },
});

export default AuthScreenLayout;
