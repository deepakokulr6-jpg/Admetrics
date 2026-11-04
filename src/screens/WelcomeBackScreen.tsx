import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import AppLogo from '../components/AppLogo';

export default function WelcomeBackScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    Alert.alert('Success', `Signing in with ${email}`);
    // Example: navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.innerContainer}
      >
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <AppLogo width={160} />
        </View>

        {/* Header Text */}
        <Text style={styles.title}>Welcome Back!</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Sign in to continue to <Text style={styles.brandText}>Admetrics</Text>
        </Text>

        {/* Email Input Group */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email ID</Text>
          <View style={styles.inputContainer}>
            <Feather
              name="user"
              size={18}
              color="#71717a"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#a1a1aa"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Password Input Group */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Feather
              name="lock"
              size={18}
              color="#71717a"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your Password"
              placeholderTextColor="#a1a1aa"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(previous => !previous)}
              hitSlop={10}
            >
              <Feather
                name={showPassword ? 'eye-off' : 'eye'}
                size={18}
                color="#71717a"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={() => {
              Alert.alert(
                'Forgot Password',
                'Password recovery flow triggered.',
              );
            }}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Gradient Sign In Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.buttonWrapper}
          onPress={handleSignIn}
        >
          <LinearGradient
            colors={['#0265FB', '#B43AFC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.signInButton}
            pointerEvents="none"
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* New User Link - Navigates to CreateAccount screen */}
        <TouchableOpacity
          style={styles.newUserContainer}
          activeOpacity={0.7}
          onPress={() => navigation?.navigate('CreateAccount')}
        >
          <Text style={styles.newUserText}>New User?</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#221E25',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#221E25',
    textAlign: 'center',
    marginBottom: 32,
    alignSelf: 'center',
  },
  brandText: {
    color: '#B43AFC',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 18,
    width: '100%',
    alignSelf: 'center',
  },
  label: {
    fontSize: 12,
    color: '#221E25',
    marginBottom: 6,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#AAAAAA',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    height: 40,
    width: '100%',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#18181b',
    paddingLeft: 4,
    height: '100%',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: '#B43AFC',
    fontSize: 12,
    fontWeight: '500',
  },
  buttonWrapper: {
    marginTop: 24,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#0265FB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    alignSelf: 'center',
    width: '100%',
  },
  signInButton: {
    height: 48,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  newUserContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  newUserText: {
    color: '#B43AFC',
    fontSize: 14,
    fontWeight: '700',
  },
});