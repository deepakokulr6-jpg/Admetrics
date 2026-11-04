// import React, { useState } from 'react';
// import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';

// type Props = {
//   value: string;
//   onChange: (value: string) => void;
// };

// const periods = ['7 days', '30 days', '90 days'];

// const RevenuePeriodDropdown: React.FC<Props> = ({ value, onChange }) => {
//   const [visible, setVisible] = useState(false);

//   return (
//     <>
//       <Pressable style={styles.button} onPress={() => setVisible(true)}>
//         <Text style={styles.buttonText}>{value}</Text>
//         <Icon name="chevron-down" size={14} color="#221E25" />
//       </Pressable>

//       <Modal
//         transparent
//         visible={visible}
//         animationType="fade"
//         onRequestClose={() => setVisible(false)}
//       >
//         <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
//           <View style={styles.menu}>
//             {periods.map(period => (
//               <Pressable
//                 key={period}
//                 style={styles.option}
//                 onPress={() => {
//                   onChange(period);
//                   setVisible(false);
//                 }}
//               >
//                 <Text
//                   style={[
//                     styles.optionText,
//                     value === period && styles.selected,
//                   ]}
//                 >
//                   {period}
//                 </Text>
//               </Pressable>
//             ))}
//           </View>
//         </Pressable>
//       </Modal>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     minWidth: 76,
//     height: 25,
//     borderWidth: 1,
//     borderColor: '#777777',
//     borderRadius: 6,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 6,
//     gap: 4,
//   },
//   buttonText: {
//     fontSize: 11,
//     color: '#221E25',
//   },
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.15)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   menu: {
//     width: 150,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 8,
//     paddingVertical: 5,
//     elevation: 5,
//   },
//   option: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   optionText: {
//     color: '#221E25',
//     fontSize: 14,
//   },
//   selected: {
//     color: '#0265FB'
//     fontWeight: '700',
//   },
// });

// export default RevenuePeriodDropdown;
//============================================================updated code for Revenue period dropdown(1)=========================================================//
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  FlatList,
} from 'react-native';

type Props = {
  value: string;
  onChange: (val: string) => void;
};

const periods = ['7 days', '30 days', '90 days'];

const RevenuePeriodDropdown: React.FC<Props> = ({ value, onChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, right: 16 });
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
      {/* Dropdown Button */}
      <Pressable
        style={styles.dropdownContainer}
        accessibilityRole="button"
        onPress={handleOpen}
      >
        <Text style={styles.dropdownText}>{value}</Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>

      {/* Popover Menu Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={[
              styles.dropdownMenu,
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
                    styles.menuItem,
                    item === value && styles.selectedMenuItem,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.menuItemText,
                      item === value && styles.selectedMenuItemText,
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
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dropdownText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 6,
  },
  chevron: {
    fontSize: 12,
    color: '#4B5563',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  dropdownMenu: {
    position: 'absolute',
    width: 115,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
  },
  menuItem: {
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  selectedMenuItem: {
    backgroundColor: '#F3F4F6',
  },
  menuItemText: {
    fontSize: 13,
    color: '#374151',
  },
  selectedMenuItemText: {
    fontWeight: '700',
    color: '#2563EB',
  },
});

export default RevenuePeriodDropdown;
