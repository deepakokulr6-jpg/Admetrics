import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProfilePic from '../../../assets/images/profile_pic.svg';

type Props = {
  size?: number;
};

const ProfileAvatar: React.FC<Props> = ({ size = 40 }) => {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <ProfilePic width={size} height={size} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EBEBEB',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

export default ProfileAvatar;
