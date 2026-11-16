import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  FlatList,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  selectedPeriod?: string;
  onSelectPeriod?: (value: string) => void;
};

const periods = ['7 days', '30 days', '90 days'];

const RevenuePeriodDropdown: React.FC<Props> = ({
  value,
  onChange,
  selectedPeriod,
  onSelectPeriod,
}) => {
  const currentValue = value ?? selectedPeriod ?? '7 days';
  const handleChange = onChange ?? onSelectPeriod ?? (() => {});
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownCoords, setDropdownCoords] = useState({
    top: 0,
    right: 16,
  });

  const containerRef = useRef<any>(null);

  const handleOpen = () => {
    containerRef.current?.measure(
      (
        fx: number,
        fy: number,
        width: number,
        height: number,
        px: number,
        py: number,
      ) => {
        setDropdownCoords({
          top: py + height + 6,
          right: 16,
        });
        setModalVisible(true);
      },
    );
  };

  const handleSelect = (item: string) => {
    handleChange(item);
    setModalVisible(false);
  };

  return (
    <View ref={containerRef} collapsable={false}>
      <Pressable
        style={styles.button}
        accessibilityRole="button"
        onPress={handleOpen}
      >
        <Text style={styles.buttonText}>{currentValue}</Text>
        <Svg width={scale(10)} height={scale(6)} viewBox="0 0 10 6">
          <Path d="M0 0h10L5 6z" fill={colors.text} />
        </Svg>
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={[
              styles.menu,
              {
                top: dropdownCoords.top,
                right: dropdownCoords.right,
              },
            ]}
          >
            <FlatList
              data={periods}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.option,
                    item === currentValue && styles.selectedOption,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item === currentValue && styles.selected,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    minWidth: scale(80),
    height: scale(26),
    borderWidth: 1,
    borderColor: colors.text,
    borderRadius: scale(6),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(8),
    gap: scale(8),
  },

  buttonText: {
    fontSize: normalizeFont(14),
    color: colors.text,
  },

  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
  },

  menu: {
    position: 'absolute',
    width: scale(150),
    backgroundColor: colors.white,
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: colors.divider,
    paddingVertical: verticalScale(5),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
  },

  option: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
  },

  selectedOption: {
    backgroundColor: colors.surfaceMuted,
  },

  optionText: {
    color: colors.text,
    fontSize: normalizeFont(14),
  },

  selected: {
    color: colors.primary,
    fontFamily: fonts.bold,
  },
});

export default RevenuePeriodDropdown;
