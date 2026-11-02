import React, { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const periods = ['7 days', '30 days', '90 days'];

const RevenuePeriodDropdown: React.FC<Props> = ({ value, onChange }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Pressable style={styles.button} onPress={() => setVisible(true)}>
        <Text style={styles.buttonText}>{value}</Text>
        <Icon name="chevron-down" size={14} color="#221E25" />
      </Pressable>

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.menu}>
            {periods.map(period => (
              <Pressable
                key={period}
                style={styles.option}
                onPress={() => {
                  onChange(period);
                  setVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    value === period && styles.selected,
                  ]}
                >
                  {period}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
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
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    width: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 5,
    elevation: 5,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
