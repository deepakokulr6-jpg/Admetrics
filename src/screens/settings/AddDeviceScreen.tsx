import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';

import ScreenHeader from '../../components/shared/ScreenHeader';
import GradientButton from '../../components/shared/GradientButton';
import type { AppScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';
import strings from '../../constants/strings';

const CODE_LENGTH = 6;
const t = strings.addDevice;

/** Small QR glyph from the design (three finder squares + data dots). */
const QrGlyph = () => (
  <Svg width={scale(40)} height={scale(40)} viewBox="0 0 40 40">
    {[
      [0, 0],
      [26, 0],
      [0, 26],
    ].map(([x, y]) => (
      <React.Fragment key={`${x}-${y}`}>
        <Rect
          x={x + 1.5}
          y={y + 1.5}
          width={11}
          height={11}
          stroke={colors.textStrong}
          strokeWidth={3}
          fill="none"
        />
        <Rect
          x={x + 5}
          y={y + 5}
          width={4}
          height={4}
          fill={colors.textStrong}
        />
      </React.Fragment>
    ))}
    <Path
      d="M17 0h4v4h-4zM17 8h4v8h-4zM0 18h4v4H0zM8 18h4v4H8zM16 20h4v4h-4zM24 18h4v4h-4zM32 18h4v4h-4zM20 24h4v4h-4zM28 24h4v4h-4zM36 24h4v4h-4zM16 30h4v6h-4zM24 30h4v4h-4zM32 32h8v4h-8zM20 36h8v4h-8zM36 36h4v4h-4z"
      fill={colors.textStrong}
    />
  </Svg>
);

/** Settings › Add Device: pair a TV by QR code or 6-digit pairing code. */
const AddDeviceScreen: React.FC<AppScreenProps<'AddDevice'>> = ({
  navigation,
}) => {
  const [code, setCode] = useState('');
  const isComplete = code.length === CODE_LENGTH;

  const onScan = () => navigation.navigate('ScanQr');

  // The pairing code identifies the TV, so it goes to the same naming step.
  const onConnect = () =>
    navigation.navigate('DeviceDetails', { serial: code });

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScreenHeader title={t.title} onBackPress={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heading}>{t.heading}</Text>
          <Text style={styles.body}>{t.intro}</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t.option1Title}</Text>
            <Text style={styles.body}>{t.option1Body}</Text>
            <View style={styles.qr}>
              <QrGlyph />
              <Text style={styles.hint}>{t.scannerHint}</Text>
            </View>
            <GradientButton title={t.scanQrCode} onPress={onScan} />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t.option2Title}</Text>
            <Text style={styles.body}>{t.option2Body}</Text>
            <TextInput
              value={code}
              onChangeText={value =>
                setCode(value.replace(/\D/g, '').slice(0, CODE_LENGTH))
              }
              placeholder={t.codePlaceholder}
              placeholderTextColor={colors.placeholder}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              maxLength={CODE_LENGTH}
              style={styles.input}
              accessibilityLabel={t.codePlaceholder}
            />
            <GradientButton
              title={t.connectTv}
              onPress={onConnect}
              disabled={!isComplete}
            />
          </View>

          <Text style={styles.footer}>{t.footer}</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.white,
    },
    flex: {
      flex: 1,
    },
    content: {
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(24),
      paddingBottom: verticalScale(32),
    },
    heading: {
      fontSize: normalizeFont(18),
      lineHeight: normalizeFont(24),
      fontFamily: fonts.bold,
      color: colors.textStrong,
      marginBottom: verticalScale(8),
    },
    body: {
      fontSize: normalizeFont(12),
      lineHeight: normalizeFont(20),
      fontFamily: fonts.regular,
      color: colors.bodyText,
    },
    // Figma: beige panels, 8px radius, 16px padding, 24px apart.
    card: {
      marginTop: verticalScale(20),
      padding: scale(16),
      borderRadius: scale(8),
      backgroundColor: colors.background,
    },
    cardTitle: {
      fontSize: normalizeFont(12),
      lineHeight: normalizeFont(16),
      fontFamily: fonts.bold,
      color: colors.textStrong,
      marginBottom: verticalScale(8),
    },
    qr: {
      alignItems: 'center',
      marginTop: verticalScale(24),
      marginBottom: verticalScale(28),
      gap: verticalScale(16),
    },
    hint: {
      fontSize: normalizeFont(10),
      fontFamily: fonts.regular,
      color: colors.bodyText,
    },
    input: {
      marginTop: verticalScale(20),
      marginBottom: verticalScale(24),
      height: verticalScale(40),
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: scale(4),
      paddingHorizontal: scale(16),
      fontSize: normalizeFont(12),
      fontFamily: fonts.regular,
      color: colors.textStrong,
    },
    footer: {
      marginTop: verticalScale(16),
      fontSize: normalizeFont(10),
      lineHeight: normalizeFont(14),
      fontFamily: fonts.regular,
      color: colors.bodyText,
    },
  }),
);

export default AddDeviceScreen;
