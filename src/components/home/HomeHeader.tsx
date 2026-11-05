import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Logo from '../../../assets/images/logo5.svg';
import ProfilePic from '../../../assets/images/profile_pic.svg';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';

type Props = {
  name: string;
  onProfilePress?: () => void;
};

const HomeHeader: React.FC<Props> = ({ name, onProfilePress }) => {
  const avatarSize = scale(40);

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <ProfilePic width={avatarSize} height={avatarSize} />
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
        <Logo width={avatarSize} height={avatarSize} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    backgroundColor: '#FFFFFF',
  },
  avatarContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginHorizontal: scale(12),
  },
  greeting: {
    fontSize: normalizeFont(14),
    color: '#777777',
    marginBottom: verticalScale(2),
  },
  name: {
    fontSize: normalizeFont(20),
    fontWeight: '700',
    color: '#221E25',
  },
  logoContainer: {
    padding: scale(4),
  },
});

export default HomeHeader;
