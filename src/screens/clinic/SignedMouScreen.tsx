import React, { useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import ScreenHeader from '../../components/shared/ScreenHeader';
import GradientButton from '../../components/shared/GradientButton';
import type { AppScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';
import strings from '../../constants/strings';

/**
 * Android's WebView can't display PDFs itself, so it goes through Google's
 * document viewer; iOS renders the PDF natively.
 */
const viewerUrl = (url: string) =>
  Platform.OS === 'android'
    ? `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(url)}`
    : url;

/** The DocuSeal-signed MOU PDF, with the signature on it. */
const SignedMouScreen: React.FC<AppScreenProps<'SignedMou'>> = ({
  navigation,
  route,
}) => {
  const { url } = route.params;
  const [failed, setFailed] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScreenHeader
        title={strings.mou.signedMou}
        onBackPress={() => navigation.goBack()}
      />

      {failed ? (
        <View style={styles.center}>
          <Text style={styles.error}>{strings.mou.documentLoadFailed}</Text>
          <GradientButton
            title={strings.mou.openInBrowser}
            onPress={() => Linking.openURL(url)}
          />
        </View>
      ) : (
        <WebView
          source={{ uri: viewerUrl(url) }}
          style={styles.web}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.center}>
              <ActivityIndicator color={colors.buttonPrimary} />
            </View>
          )}
          onError={() => setFailed(true)}
          onHttpError={() => setFailed(true)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.white,
    },
    web: {
      flex: 1,
      backgroundColor: colors.white,
    },
    center: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: scale(32),
      gap: verticalScale(20),
      backgroundColor: colors.white,
    },
    error: {
      fontSize: normalizeFont(14),
      fontFamily: fonts.regular,
      color: colors.bodyText,
      textAlign: 'center',
    },
  }),
);

export default SignedMouScreen;
