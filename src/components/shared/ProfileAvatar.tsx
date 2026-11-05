import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProfilePic from '../../../assets/images/profile_pic.svg';
import { scale } from '../../utils/responsive';

type Props = {
  size?: number;
};

const ProfileAvatar: React.FC<Props> = ({ size }) => {
  const avatarSize = size ?? scale(40);

  return (
    <View
      style={[
        styles.container,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
        },
      ]}
    >
      <ProfilePic width={avatarSize} height={avatarSize} />
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
