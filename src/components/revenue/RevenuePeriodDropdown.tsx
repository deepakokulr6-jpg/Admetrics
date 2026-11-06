import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';

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
        <Icon name="chevron-down" size={scale(14)} color="#221E25" />
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
                    item === value && styles.selectedOption,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item === value && styles.selected,
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
    minWidth: scale(76),
    height: verticalScale(25),
    borderWidth: 1,
    borderColor: '#777777',
    borderRadius: scale(6),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(6),
    gap: scale(4),
  },

  buttonText: {
    fontSize: normalizeFont(11),
    color: '#221E25',
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },

  menu: {
    position: 'absolute',
    width: scale(150),
    backgroundColor: '#FFFFFF',
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: verticalScale(5),
    shadowColor: '#000',
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
    backgroundColor: '#F3F4F6',
  },

  optionText: {
    color: '#221E25',
    fontSize: normalizeFont(14),
  },

  selected: {
    color: '#0265FB',
    fontWeight: '700',
  },
});

export default RevenuePeriodDropdown;
