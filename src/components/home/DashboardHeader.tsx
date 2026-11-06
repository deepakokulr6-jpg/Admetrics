import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import ProfileAvatar from '../shared/ProfileAvatar';
import AppLogo from '../shared/AppLogo';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';

type Props = {
  userName?: string;
  name?: string;
  onProfilePress?: () => void;
  onLogoPress?: () => void;
};

const DashboardHeader: React.FC<Props> = ({
  userName,
  name,
  onProfilePress,
  onLogoPress,
}) => {
  const displayName = userName ?? name ?? 'Ramkumar';
  const logoSize = scale(40);
  const logo = <AppLogo width={logoSize} height={logoSize} />;

  return (
    <View style={styles.container}>
      {onProfilePress ? (
        <Pressable
          style={styles.profileSection}
          onPress={onProfilePress}
          accessibilityRole="button"
          accessibilityLabel="Open profile"
        >
          <ProfileAvatar size={logoSize} />

          <View style={styles.textContainer}>
            <Text style={styles.greeting}>Good Morning!</Text>
            <Text style={styles.userName} numberOfLines={1}>
              {displayName}
            </Text>
          </View>
        </Pressable>
      ) : (
        <View style={styles.profileSection}>
          <ProfileAvatar size={logoSize} />

          <View style={styles.textContainer}>
            <Text style={styles.greeting}>Good Morning!</Text>
            <Text style={styles.userName} numberOfLines={1}>
              {displayName}
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
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(12),
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
    marginRight: scale(12),
  },

  textContainer: {
    flex: 1,
    marginLeft: scale(14),
  },

  greeting: {
    fontSize: normalizeFont(12),
    lineHeight: normalizeFont(16),
    fontWeight: '500',
    color: '#666666',
    marginBottom: verticalScale(2),
  },

  userName: {
    fontSize: normalizeFont(18),
    lineHeight: normalizeFont(22),
    fontWeight: '700',
    color: '#111111',
  },
});

export default DashboardHeader;
