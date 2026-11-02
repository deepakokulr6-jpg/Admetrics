import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  name: string;
  onProfilePress?: () => void;
};

const HomeHeader: React.FC<Props> = ({ name, onProfilePress }) => (
  <View style={styles.container}>
    <View>
      <Text style={styles.greeting}>Hello,</Text>
      <Text style={styles.name}>{name}</Text>
    </View>
    <TouchableOpacity
      onPress={onProfilePress}
      accessibilityRole="button"
      accessibilityLabel="Profile"
      style={styles.iconButton}
    >
      <Ionicons name="person-circle-outline" size={36} color="#0265FB" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 13,
    color: '#777777',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#221E25',
  },
  iconButton: {
    padding: 4,
  },
});

export default HomeHeader;
