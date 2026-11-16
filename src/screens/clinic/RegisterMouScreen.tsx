import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  BackHandler,
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
import { useClinicRegistration } from '../../contexts/ClinicRegistrationContext';
import type { AppScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';
import { DOCUSEAL_FORM_URL } from '../../config/esign';

type Mode = 'read' | 'sign';

// Little pen stroke above "Your signature" (Figma hint).
const SQUIGGLE = 'M2 10c4-8 8-8 8-2s4 6 8 0 6-4 10 0';

/**
 * Step 4 of registration.
 * read → the MOU in a bordered box + "Signature".
 * sign → the box dims, the user signs with a finger, "Submit" (enabled once
 *        something is drawn) stores the signature and opens the Preview.
 */
const RegisterMouScreen: React.FC<AppScreenProps<'RegisterMou'>> = ({
  navigation,
}) => {
  const { setSignature } = useClinicRegistration();
  const [mode, setMode] = useState<Mode>('read');
  const [signature, setLocalSignature] = useState('');
  const [clearKey, setClearKey] = useState(0);
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

  const handleSubmit = () => {
    setSignature(signature);
    navigation.navigate('ClinicPreview');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScreenHeader
        title={strings.common.registerYourClinic}
        onBackPress={handleBack}
      />
      <StepProgress currentStep={4} />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>
            {isSigning
              ? strings.mou.signature
              : strings.mou.memorandumOfUnderstanding}
          </Text>
          {isSigning && signature ? (
            <Pressable
              onPress={clear}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={strings.mou.clear}
            >
              <Text style={styles.clear}>{strings.mou.clear}</Text>
            </Pressable>
          ) : null}
        </View>

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
              {!signature ? (
                <View style={styles.hint} pointerEvents="none">
                  <Svg width={scale(30)} height={scale(14)} viewBox="0 0 30 14">
                    <Path
                      d={SQUIGGLE}
                      stroke={colors.white}
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
              <SignaturePad onChange={setLocalSignature} clearKey={clearKey} />
            </View>
          ) : null}
        </View>

        <View style={styles.button}>
          {isSigning ? (
            <GradientButton
              title={strings.mou.submit}
              onPress={handleSubmit}
              disabled={!signature}
            />
          ) : (
            <GradientButton
              title={strings.mou.signature}
              onPress={() =>
                // DocuSeal link configured → real e-sign; otherwise the
                // built-in finger signature pad.
                DOCUSEAL_FORM_URL
                  ? navigation.navigate('MouESign')
                  : setMode('sign')
              }
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
  },
  title: {
    fontSize: normalizeFont(16),
    lineHeight: normalizeFont(20),
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  clear: {
    fontSize: normalizeFont(12),
    fontFamily: fonts.semibold,
    color: colors.primary,
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
  hint: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintText: {
    marginTop: verticalScale(4),
    fontSize: normalizeFont(16),
    fontFamily: fonts.medium,
    color: colors.white,
  },
  button: {
    paddingTop: verticalScale(40),
    paddingBottom: verticalScale(24),
  },
});

export default RegisterMouScreen;
