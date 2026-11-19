import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Alert,
  BackHandler,
  type LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import ScreenHeader from '../../components/shared/ScreenHeader';
import StepProgress from '../../components/shared/StepProgress';
import GradientButton from '../../components/shared/GradientButton';
import MouDocument from '../../components/clinic/MouDocument';
import SignaturePad from '../../components/clinic/SignaturePad';
import { useClinicRegistration } from '../../hooks/useClinicRegistration';
import { useAuth } from '../../hooks/useAuth';
import { isESignConfigured, signMou } from '../../services/esignService';
import type { AppScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';
import { themedStyles } from '../../theme/themedStyles';

type Mode = 'read' | 'sign';

// Little pen stroke above "Your signature" (Figma hint).
const SQUIGGLE = 'M2 10c4-8 8-8 8-2s4 6 8 0 6-4 10 0';
const CLOSE = 'M7 7l10 10M17 7L7 17';
/** One page of placeholder MOU for now; grows with the real agreement. */
const MOU_PAGE_COUNT = 1;

/** Drawn signature (SVG path) → base64 PNG via a hidden <Svg>. */
const toPng = (svg: Svg | null) =>
  new Promise<string>((resolve, reject) => {
    if (!svg) {
      reject(new Error('Signature not ready'));
      return;
    }
    svg.toDataURL(resolve);
  });

/**
 * Step 4 of registration.
 * read → the MOU in a bordered box + "Signature".
 * sign → the MOU dims, a framed signature box appears over it (× clears),
 *        "Submit" signs the MOU on DocuSeal and opens the Preview.
 */
const RegisterMouScreen: React.FC<AppScreenProps<'RegisterMou'>> = ({
  navigation,
}) => {
  const { draft, setSignature, setSignedMou } = useClinicRegistration();
  const { user } = useAuth();
  const [mode, setMode] = useState<Mode>('read');
  const [signature, setLocalSignature] = useState('');
  const [clearKey, setClearKey] = useState(0);
  const [padSize, setPadSize] = useState({ width: 0, height: 0 });
  const [submitting, setSubmitting] = useState(false);
  const exportRef = useRef<Svg>(null);
  const isSigning = mode === 'sign';

  // While signing: no iOS swipe-back (it would fight with drawing near the
  // left edge) and back returns to reading instead of leaving the step.
  useLayoutEffect(() => {
    navigation.setOptions({ gestureEnabled: !isSigning });
  }, [navigation, isSigning]);

  useEffect(() => {
    if (!isSigning) {
      return;
    }
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        setMode('read');
        return true;
      },
    );
    return () => subscription.remove();
  }, [isSigning]);

  const clear = () => {
    setLocalSignature('');
    setClearKey(key => key + 1);
  };

  const handleBack = () => {
    if (isSigning) {
      setMode('read');
      return;
    }
    navigation.goBack();
  };

  const onPadLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setPadSize({ width, height });
  };

  /** Keep the signature locally and move on (signed PDF can come later). */
  const finish = (signedUrl: string | null) => {
    setSignature(signature);
    setSignedMou(signedUrl);
    navigation.navigate('ClinicPreview');
  };

  const handleSubmit = async () => {
    if (!isESignConfigured()) {
      finish(null);
      return;
    }
    setSubmitting(true);
    try {
      const png = await toPng(exportRef.current);
      const signed = await signMou({
        signaturePng: png,
        email: draft.personal.email || user?.email || '',
        name: draft.personal.contactPerson || draft.clinic.clinicName,
      });
      finish(signed.documentUrl);
    } catch (error) {
      console.warn('[mou] DocuSeal signing failed', error);
      Alert.alert(strings.mou.signingFailed, strings.mou.signingFailedMessage, [
        { text: strings.mou.continueAnyway, onPress: () => finish(null) },
        { text: strings.mou.retry, onPress: handleSubmit },
      ]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScreenHeader
        title={strings.common.registerYourClinic}
        onBackPress={handleBack}
      />
      <StepProgress currentStep={4} />

      <View style={styles.content}>
        <Text style={styles.title}>
          {isSigning
            ? strings.mou.signature
            : strings.mou.memorandumOfUnderstanding}
        </Text>

        <View style={styles.documentBox}>
          <ScrollView
            contentContainerStyle={styles.document}
            scrollEnabled={!isSigning}
            showsVerticalScrollIndicator={false}
          >
            <MouDocument compact />
          </ScrollView>

          {isSigning ? (
            <View style={styles.overlay}>
              <View style={styles.pageBadge} pointerEvents="none">
                <Text style={styles.pageBadgeText}>
                  {strings.mou.pageCount(1, MOU_PAGE_COUNT)}
                </Text>
              </View>

              {/* Figma: framed signing box over the dimmed MOU. */}
              <View style={styles.signBox} onLayout={onPadLayout}>
                {!signature ? (
                  <View style={styles.hint} pointerEvents="none">
                    <Svg
                      width={scale(30)}
                      height={scale(14)}
                      viewBox="0 0 30 14"
                    >
                      <Path
                        d={SQUIGGLE}
                        stroke={colors.onAccent}
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        fill="none"
                      />
                    </Svg>
                    <Text style={styles.hintText}>
                      {strings.mou.yourSignature}
                    </Text>
                  </View>
                ) : null}
                <SignaturePad
                  onChange={setLocalSignature}
                  clearKey={clearKey}
                />
              </View>

              {signature ? (
                <Pressable
                  onPress={clear}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={strings.mou.clearSignature}
                  style={styles.clearButton}
                >
                  <Svg width={scale(18)} height={scale(18)} viewBox="0 0 24 24">
                    <Path
                      d={CLOSE}
                      stroke={colors.shadow}
                      strokeWidth={2.6}
                      strokeLinecap="round"
                    />
                  </Svg>
                </Pressable>
              ) : null}
            </View>
          ) : null}
        </View>

        <View style={styles.button}>
          {isSigning ? (
            <GradientButton
              title={strings.mou.submit}
              onPress={handleSubmit}
              disabled={!signature}
              loading={submitting}
            />
          ) : (
            <GradientButton
              title={strings.mou.signature}
              onPress={() => setMode('sign')}
            />
          )}
        </View>
      </View>

      {/* Off-screen copy of the signature in black ink for the PDF. */}
      {signature && padSize.width > 0 ? (
        <View style={styles.exporter} pointerEvents="none">
          <Svg
            ref={exportRef}
            width={padSize.width}
            height={padSize.height}
            viewBox={`0 0 ${padSize.width} ${padSize.height}`}
          >
            <Path
              d={signature}
              stroke={colors.shadow}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const CLEAR_SIZE = scale(36);

const styles = themedStyles(() =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.white,
    },
    content: {
      flex: 1,
      paddingHorizontal: scale(16),
    },
    title: {
      fontSize: normalizeFont(16),
      lineHeight: normalizeFont(20),
      fontFamily: fonts.semibold,
      color: colors.text,
      marginBottom: verticalScale(16),
    },
    // Figma: grey 1px border, 24px corners, fills down to the button.
    documentBox: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: scale(24),
      overflow: 'hidden',
      backgroundColor: colors.white,
    },
    document: {
      paddingHorizontal: scale(24),
      paddingVertical: verticalScale(24),
    },
    overlay: {
      ...StyleSheet.absoluteFill,
      backgroundColor: colors.signatureOverlay,
    },
    pageBadge: {
      position: 'absolute',
      top: verticalScale(12),
      right: scale(12),
      paddingHorizontal: scale(10),
      paddingVertical: verticalScale(4),
      borderRadius: scale(14),
      backgroundColor: colors.shadow,
    },
    pageBadgeText: {
      fontSize: normalizeFont(12),
      fontFamily: fonts.semibold,
      color: colors.onAccent,
    },
    // Figma: white-outlined box ~26% down, 40px in from the sides.
    signBox: {
      position: 'absolute',
      top: '22%',
      bottom: '18%',
      left: scale(40),
      right: scale(40),
      borderWidth: 1,
      borderColor: colors.onAccent,
      borderRadius: scale(24),
      overflow: 'hidden',
    },
    hint: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    hintText: {
      marginTop: verticalScale(4),
      fontSize: normalizeFont(16),
      fontFamily: fonts.medium,
      color: colors.onAccent,
    },
    // White circle with × on the box's top-right corner.
    clearButton: {
      position: 'absolute',
      top: '22%',
      right: scale(40) - CLEAR_SIZE / 2,
      marginTop: -CLEAR_SIZE / 2,
      width: CLEAR_SIZE,
      height: CLEAR_SIZE,
      borderRadius: CLEAR_SIZE / 2,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.onAccent,
    },
    exporter: {
      position: 'absolute',
      left: -10000,
      top: 0,
    },
    button: {
      paddingTop: verticalScale(40),
      paddingBottom: verticalScale(24),
    },
  }),
);

export default RegisterMouScreen;
