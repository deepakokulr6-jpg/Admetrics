import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import ScreenHeader from '../../components/shared/ScreenHeader';
import { useClinicRegistration } from '../../contexts/ClinicRegistrationContext';
import { DOCUSEAL_FORM_SCRIPT, DOCUSEAL_FORM_URL } from '../../config/esign';
import type { AppScreenProps } from '../../navigation/types';
import colors from '../../theme/colors';
import strings from '../../constants/strings';

type DocusealMessage =
  | { type: 'completed'; detail: Record<string, unknown> }
  | { type: 'error'; message: string };

const escapeAttr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/**
 * Hosts DocuSeal's embeddable signing form. DocuSeal records who signed,
 * when and from where, and produces the signed PDF + audit certificate.
 * When the form fires `completed`, the submission reference is stored in the
 * registration draft and the Preview opens.
 */
const MouESignScreen: React.FC<AppScreenProps<'MouESign'>> = ({
  navigation,
}) => {
  const { draft, setSignature } = useClinicRegistration();
  const [loading, setLoading] = useState(true);

  const html = useMemo(
    () => `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
<style>html,body{margin:0;padding:0;background:#fff;overflow-x:hidden;overscroll-behavior:none;}canvas{touch-action:none;}</style>
<script src="${DOCUSEAL_FORM_SCRIPT}"></script>
</head>
<body>
<docuseal-form
  id="docusealForm"
  data-src="${escapeAttr(DOCUSEAL_FORM_URL)}"
  data-email="${escapeAttr(draft.personal.email)}"
  data-name="${escapeAttr(draft.personal.contactPerson)}">
</docuseal-form>
<script>
  function post(message) {
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  }
  document.getElementById('docusealForm').addEventListener('completed', function (e) {
    post({ type: 'completed', detail: e.detail || {} });
  });
  window.addEventListener('error', function (e) {
    post({ type: 'error', message: String(e.message || 'Script error') });
  });
</script>
</body>
</html>`,
    [draft.personal.email, draft.personal.contactPerson],
  );

  const handleMessage = (event: WebViewMessageEvent) => {
    let message: DocusealMessage;
    try {
      message = JSON.parse(event.nativeEvent.data);
    } catch {
      return;
    }

    if (message.type === 'completed') {
      const detail = message.detail;
      const reference = String(
        detail.submission_id ?? detail.id ?? detail.slug ?? Date.now(),
      );
      setSignature(`docuseal:${reference}`);
      // Replace, so Back from the Preview returns to the MOU step.
      navigation.replace('ClinicPreview');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScreenHeader
        title={strings.mou.signature}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.flex}>
        <WebView
          originWhitelist={['*']}
          source={{ html, baseUrl: 'https://docuseal.com' }}
          onMessage={handleMessage}
          onLoadEnd={() => setLoading(false)}
          onError={() =>
            Alert.alert(
              strings.mou.signingUnavailable,
              strings.mou.checkConnection,
            )
          }
          javaScriptEnabled
          domStorageEnabled
          setSupportMultipleWindows={false}
          // Keep the page still while drawing: no sideways drag, bounce or
          // browser back-swipe.
          bounces={false}
          overScrollMode="never"
          allowsBackForwardNavigationGestures={false}
          showsHorizontalScrollIndicator={false}
          scrollEnabled
          directionalLockEnabled
          style={styles.flex}
        />
        {loading ? (
          <View style={styles.loader} pointerEvents="none">
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex: {
    flex: 1,
  },
  loader: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
});

export default MouESignScreen;
