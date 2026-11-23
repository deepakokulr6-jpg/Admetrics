import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../../components/shared/ScreenHeader';
import GradientButton from '../../components/shared/GradientButton';
import ClinicLocationSheet from '../../components/settings/ClinicLocationSheet';
import StatusSheet, {
  type SheetStatus,
} from '../../components/shared/StatusSheet';
import {
  type ClinicLocation,
  useClinicLocations,
} from '../../hooks/useClinicLocations';
import type { AppScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';
import strings from '../../constants/strings';
import { LIMITS } from '../../constants/fieldLimits';

const t = strings.deviceDetails;
const VERIFY_MS = 1800;
/** How long "Verified" stays up before the sheet closes. */
const DONE_MS = 1800;

/** After a scan / pairing code: shows the TV's serial and asks for a name. */
const DeviceDetailsScreen: React.FC<AppScreenProps<'DeviceDetails'>> = ({
  navigation,
  route,
}) => {
  const { serial } = route.params;
  const [name, setName] = useState('');
  const trimmed = name.trim();
  const clinics = useClinicLocations();
  const [clinic, setClinic] = useState<ClinicLocation | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  // "Verifying..." → "Verified" sheet, shown right here over this form.
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetStatus, setSheetStatus] = useState<SheetStatus>('loading');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  // TODO: replace the timers with the pairing API call (serial, name, clinic).
  const pair = () => {
    setSheetStatus('loading');
    setSheetVisible(true);
    timers.current.push(
      setTimeout(() => setSheetStatus('success'), VERIFY_MS),
      setTimeout(() => setSheetVisible(false), VERIFY_MS + DONE_MS),
    );
  };

  /** After the sheet closes: back to where Add Device was opened from. */
  const leave = () => {
    const { routes } = navigation.getState();
    const start = routes.findIndex(item => item.name === 'AddDevice');
    if (start > 0) {
      navigation.pop(routes.length - start);
    } else {
      navigation.goBack();
    }
  };

  // Only one clinic → nothing to choose.
  useEffect(() => {
    if (!clinic && clinics.length === 1) {
      setClinic(clinics[0]);
    }
  }, [clinic, clinics]);

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
          maxLength={LIMITS.deviceName.max}
          returnKeyType="done"
          style={[styles.input, styles.value]}
          accessibilityLabel={t.deviceName}
        />

        {/* Figma: one clinic per device, name + full address, ▼ dropdown. */}
        <Text style={[styles.label, styles.labelGap]}>{t.location}</Text>
        <Pressable
          onPress={() => setPickerOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={
            clinic
              ? `${t.location}: ${clinic.name}, ${clinic.address}`
              : t.location
          }
          style={[styles.input, styles.dropdown]}
        >
          <Text
            style={[styles.value, styles.flex, !clinic && styles.placeholder]}
            numberOfLines={1}
          >
            {clinic
              ? `${clinic.name} ${clinic.address}`
              : t.locationPlaceholder}
          </Text>
          <Svg width={scale(14)} height={scale(14)} viewBox="0 0 24 24">
            <Path d="M4 7h16l-8 11z" fill={colors.textStrong} />
          </Svg>
        </Pressable>

        <GradientButton
          title={t.add}
          disabled={trimmed.length < LIMITS.deviceName.min || !clinic}
          style={styles.button}
          onPress={pair}
        />
      </View>
      <StatusSheet
        visible={sheetVisible}
        status={sheetStatus}
        title={
          sheetStatus === 'success'
            ? strings.devicePairing.verified
            : strings.devicePairing.verifying
        }
        message={strings.devicePairing.message}
        onHidden={leave}
      />

      <ClinicLocationSheet
        visible={pickerOpen}
        clinics={clinics}
        selectedId={clinic?.id ?? null}
        onSelect={setClinic}
        onClose={() => setPickerOpen(false)}
      />
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
    dropdown: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(12),
    },
    flex: {
      flex: 1,
    },
    placeholder: {
      fontFamily: fonts.regular,
      color: colors.placeholder,
    },
    button: {
      marginTop: verticalScale(70),
    },
  }),
);

export default DeviceDetailsScreen;
