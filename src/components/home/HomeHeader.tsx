import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Logo from '../../../assets/images/logo5.svg';
import ProfilePic from '../../../assets/images/profile_pic.svg';

type Props = {
  name: string;
  onProfilePress?: () => void;
};

const HomeHeader: React.FC<Props> = ({ name, onProfilePress }) => (
  <View style={styles.container}>
    <View style={styles.avatarContainer}>
      <ProfilePic width={40} height={40} />
    </View>
    <View style={styles.info}>
      <Text style={styles.greeting}>Good Morning!</Text>
      <Text style={styles.name}>{name}</Text>
    </View>
    <TouchableOpacity
      onPress={onProfilePress}
      accessibilityRole="button"
      accessibilityLabel="Logo"
      style={styles.logoContainer}
    >
      <Logo width={40} height={40} />
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
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginHorizontal: 12,
  },
  greeting: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#221E25',
  },
  logoContainer: {
    padding: 4,
  },
});

export default HomeHeader;
