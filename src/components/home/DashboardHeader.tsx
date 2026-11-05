import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import ProfileAvatar from '../shared/ProfileAvatar';
import AppLogo from '../shared/AppLogo';

type Props = {
  userName: string;
  onProfilePress?: () => void;
  onLogoPress?: () => void;
};

const DashboardHeader: React.FC<Props> = ({
  userName,
  onProfilePress,
  onLogoPress,
}) => {
  const logo = <AppLogo width={40} height={40} />;

  return (
    <View style={styles.container}>
      {onProfilePress ? (
        <Pressable
          style={styles.profileSection}
          onPress={onProfilePress}
          accessibilityRole="button"
          accessibilityLabel="Open profile"
        >
          <ProfileAvatar size={40} />

          <View style={styles.textContainer}>
            <Text style={styles.greeting}>Good Morning!</Text>
            <Text style={styles.userName} numberOfLines={1}>
              {userName}
            </Text>
          </View>
        </Pressable>
      ) : (
        <View style={styles.profileSection}>
          <ProfileAvatar size={40} />

          <View style={styles.textContainer}>
            <Text style={styles.greeting}>Good Morning!</Text>
            <Text style={styles.userName} numberOfLines={1}>
              {userName}
            </Text>
          </View>
        </View>
      )}

      {onLogoPress ? (
        <Pressable
          onPress={onLogoPress}
          accessibilityRole="button"
          accessibilityLabel="Admetrics home"
          hitSlop={8}
        >
          {logo}
        </Pressable>
      ) : (
        <View accessible accessibilityLabel="Admetrics logo">
          {logo}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    borderTopWidth: 0,
  },

  profileSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },

  textContainer: {
    flex: 1,
    marginLeft: 14,
  },

  greeting: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 2,
  },

  userName: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    color: '#111111',
  },
});

export default DashboardHeader;
