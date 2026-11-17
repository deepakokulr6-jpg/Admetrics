import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../../components/shared/ScreenHeader';
import GradientButton from '../../components/shared/GradientButton';
import type { AppScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';
import strings from '../../constants/strings';

const t = strings.deviceDetails;

/** After a scan / pairing code: shows the TV's serial and asks for a name. */
const DeviceDetailsScreen: React.FC<AppScreenProps<'DeviceDetails'>> = ({
  navigation,
  route,
}) => {
  const { serial } = route.params;
  const [name, setName] = useState('');
  const trimmed = name.trim();

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScreenHeader title={t.title} onBackPress={() => navigation.goBack()} />

      <View style={styles.content}>
        <Text style={styles.label}>{t.serialNumber}</Text>
        <View style={styles.readOnly}>
          <Text style={styles.value} selectable numberOfLines={1}>
            {serial}
          </Text>
        </View>

        <Text style={[styles.label, styles.labelGap]}>{t.deviceName}</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t.deviceNamePlaceholder}
          placeholderTextColor={colors.placeholder}
          autoCapitalize="words"
          maxLength={40}
          returnKeyType="done"
          style={[styles.input, styles.value]}
          accessibilityLabel={t.deviceName}
        />

        <GradientButton
          title={t.add}
          disabled={!trimmed}
          style={styles.button}
          onPress={() =>
            navigation.navigate('DevicePairing', { serial, name: trimmed })
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.white,
    },
    content: {
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(24),
    },
    label: {
      fontSize: normalizeFont(12),
      fontFamily: fonts.regular,
      color: colors.text,
      marginBottom: verticalScale(8),
    },
    labelGap: {
      marginTop: verticalScale(24),
    },
    value: {
      fontSize: normalizeFont(14),
      fontFamily: fonts.semibold,
      color: colors.textStrong,
    },
    // Figma: grey filled box for the read-only serial number.
    readOnly: {
      height: verticalScale(40),
      justifyContent: 'center',
      paddingHorizontal: scale(16),
      borderRadius: scale(6),
      backgroundColor: colors.disabled,
    },
    input: {
      height: verticalScale(40),
      paddingHorizontal: scale(16),
      borderRadius: scale(6),
      borderWidth: 1,
      borderColor: colors.border,
    },
    button: {
      marginTop: verticalScale(70),
    },
  }),
);

export default DeviceDetailsScreen;
