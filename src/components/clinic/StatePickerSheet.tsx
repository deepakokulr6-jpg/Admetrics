import React, { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import BottomSheet, { SheetFlatList } from '../shared/BottomSheet';
import { allStates } from '../../utils/pincode';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { themedStyles } from '../../theme/themedStyles';
import strings from '../../constants/strings';

const ROW_HEIGHT = verticalScale(46);

type Props = {
  visible: boolean;
  selected: string;
  onSelect: (state: string) => void;
  onClose: () => void;
};

/** Searchable list of the 36 states and union territories. */
const StatePickerSheet: React.FC<Props> = ({
  visible,
  selected,
  onSelect,
  onClose,
}) => {
  const { height } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const states = useMemo(() => allStates(), []);
  const listStyle = useMemo(() => ({ height: height * 0.45 }), [height]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? states.filter(s => s.toLowerCase().includes(q)) : states;
  }, [query, states]);

  const close = () => {
    setQuery('');
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={close}>
      <Text style={styles.title}>{strings.clinicForm.selectState}</Text>
      <View style={styles.search}>
        <Svg width={scale(18)} height={scale(18)} viewBox="0 0 24 24">
          <Circle
            cx={11}
            cy={11}
            r={6.5}
            stroke={colors.mutedText}
            strokeWidth={2}
            fill="none"
          />
          <Path
            d="M16 16l4 4"
            stroke={colors.mutedText}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </Svg>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={strings.clinicForm.searchState}
          placeholderTextColor={colors.placeholder}
          autoCorrect={false}
          returnKeyType="search"
          style={styles.searchInput}
          accessibilityLabel={strings.clinicForm.searchState}
        />
        {query ? (
          <Pressable
            onPress={() => setQuery('')}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={strings.clinicForm.clearSearch}
          >
            <Svg width={scale(16)} height={scale(16)} viewBox="0 0 24 24">
              <Path
                d="M6 6l12 12M18 6L6 18"
                stroke={colors.mutedText}
                strokeWidth={2.2}
                strokeLinecap="round"
              />
            </Svg>
          </Pressable>
        ) : null}
      </View>
      <SheetFlatList
        data={filtered}
        keyExtractor={item => item}
        startsAtTop={!selected || states.indexOf(selected) <= 2}
        keyboardShouldPersistTaps="handled"
        style={listStyle}
        // Open on the chosen state.
        initialScrollIndex={
          !query && selected
            ? Math.max(0, states.indexOf(selected) - 2)
            : undefined
        }
        getItemLayout={(_, index) => ({
          length: ROW_HEIGHT,
          offset: ROW_HEIGHT * index,
          index,
        })}
        ListEmptyComponent={
          <Text style={styles.empty}>{strings.clinicForm.noStateMatch}</Text>
        }
        renderItem={({ item }) => {
          const isSelected = item === selected;
          return (
            <Pressable
              onPress={() => {
                onSelect(item);
                close();
              }}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              style={({ pressed }) => [
                styles.row,
                isSelected && styles.rowSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.rowText, isSelected && styles.selected]}>
                {item}
              </Text>
              {isSelected ? (
                <Svg width={scale(18)} height={scale(18)} viewBox="0 0 24 24">
                  <Path
                    d="M5 12.5l4.5 4.5L19 7.5"
                    stroke={colors.buttonPrimary}
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </Svg>
              ) : null}
            </Pressable>
          );
        }}
      />
    </BottomSheet>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    title: {
      fontSize: normalizeFont(18),
      fontFamily: fonts.bold,
      color: colors.textStrong,
      marginBottom: verticalScale(12),
    },
    search: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(8),
      height: verticalScale(44),
      paddingHorizontal: scale(12),
      borderRadius: scale(10),
      backgroundColor: colors.surfaceMuted,
      marginBottom: verticalScale(8),
    },
    searchInput: {
      flex: 1,
      height: '100%',
      padding: 0,
      fontSize: normalizeFont(14),
      fontFamily: fonts.regular,
      color: colors.textStrong,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: ROW_HEIGHT,
      paddingHorizontal: scale(12),
      borderRadius: scale(10),
    },
    rowSelected: {
      backgroundColor: colors.accentTint,
    },
    empty: {
      paddingVertical: verticalScale(24),
      textAlign: 'center',
      fontSize: normalizeFont(13),
      fontFamily: fonts.regular,
      color: colors.mutedText,
    },
    pressed: {
      backgroundColor: colors.surfaceMuted,
    },
    rowText: {
      fontSize: normalizeFont(14),
      fontFamily: fonts.regular,
      color: colors.text,
    },
    selected: {
      fontFamily: fonts.bold,
      color: colors.buttonPrimary,
    },
  }),
);

export default StatePickerSheet;
