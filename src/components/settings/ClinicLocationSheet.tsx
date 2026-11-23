import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import BottomSheet, { SheetFlatList } from '../shared/BottomSheet';
import type { ClinicLocation } from '../../hooks/useClinicLocations';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';
import strings from '../../constants/strings';

type Props = {
  visible: boolean;
  clinics: ClinicLocation[];
  selectedId: string | null;
  onSelect: (clinic: ClinicLocation) => void;
  onClose: () => void;
};

/** Pick the one clinic a device is installed at (name + full address). */
const ClinicLocationSheet: React.FC<Props> = ({
  visible,
  clinics,
  selectedId,
  onSelect,
  onClose,
}) => {
  const { height } = useWindowDimensions();
  const listStyle = { maxHeight: height * 0.55 };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={styles.title}>{strings.deviceDetails.selectLocation}</Text>
      <SheetFlatList
        data={clinics}
        keyExtractor={item => item.id}
        style={listStyle}
        ListEmptyComponent={
          <Text style={styles.empty}>{strings.deviceDetails.noClinics}</Text>
        }
        renderItem={({ item }) => {
          const selected = item.id === selectedId;
          return (
            <Pressable
              onPress={() => {
                onSelect(item);
                onClose();
              }}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={`${item.name}, ${item.address}`}
              style={({ pressed }) => [
                styles.row,
                selected && styles.rowSelected,
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.radio, selected && styles.radioOn]}>
                {selected ? <View style={styles.radioDot} /> : null}
              </View>
              <View style={styles.text}>
                <Text style={[styles.name, selected && styles.nameOn]}>
                  {item.name}
                </Text>
                <Text style={styles.address}>{item.address}</Text>
              </View>
            </Pressable>
          );
        }}
      />
    </BottomSheet>
  );
};

const RADIO = scale(20);

const styles = themedStyles(() =>
  StyleSheet.create({
    title: {
      fontSize: normalizeFont(18),
      fontFamily: fonts.bold,
      color: colors.textStrong,
      marginBottom: verticalScale(12),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: scale(12),
      padding: scale(12),
      marginBottom: verticalScale(6),
      borderRadius: scale(10),
    },
    // Soft blue band on the choice, like the time wheel.
    rowSelected: {
      backgroundColor: colors.accentTint,
    },
    pressed: {
      backgroundColor: colors.surfaceMuted,
    },
    radio: {
      width: RADIO,
      height: RADIO,
      marginTop: verticalScale(1),
      borderRadius: RADIO / 2,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioOn: {
      borderColor: colors.buttonPrimary,
    },
    radioDot: {
      width: RADIO / 2,
      height: RADIO / 2,
      borderRadius: RADIO / 4,
      backgroundColor: colors.buttonPrimary,
    },
    text: {
      flex: 1,
    },
    name: {
      fontSize: normalizeFont(14),
      fontFamily: fonts.semibold,
      color: colors.textStrong,
    },
    nameOn: {
      fontFamily: fonts.bold,
      color: colors.buttonPrimary,
    },
    address: {
      marginTop: verticalScale(4),
      fontSize: normalizeFont(12),
      lineHeight: normalizeFont(17),
      fontFamily: fonts.regular,
      color: colors.bodyText,
    },
    empty: {
      paddingVertical: verticalScale(24),
      textAlign: 'center',
      fontSize: normalizeFont(13),
      fontFamily: fonts.regular,
      color: colors.mutedText,
    },
  }),
);

export default ClinicLocationSheet;
