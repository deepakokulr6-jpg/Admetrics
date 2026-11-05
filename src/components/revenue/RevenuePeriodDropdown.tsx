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

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const periods = ['7 days', '30 days', '90 days'];

const RevenuePeriodDropdown: React.FC<Props> = ({ value, onChange }) => {
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
    onChange(item);
    setModalVisible(false);
  };

  return (
    <View ref={containerRef} collapsable={false}>
      <Pressable
        style={styles.button}
        accessibilityRole="button"
        onPress={handleOpen}
      >
        <Text style={styles.buttonText}>{value}</Text>
        <Icon name="chevron-down" size={14} color="#221E25" />
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
    minWidth: 76,
    height: 25,
    borderWidth: 1,
    borderColor: '#777777',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    gap: 4,
  },

  buttonText: {
    fontSize: 11,
    color: '#221E25',
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },

  menu: {
    position: 'absolute',
    width: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
  },

  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  selectedOption: {
    backgroundColor: '#F3F4F6',
  },

  optionText: {
    color: '#221E25',
    fontSize: 14,
  },

  selected: {
    color: '#0265FB',
    fontWeight: '700',
  },
});

export default RevenuePeriodDropdown;
