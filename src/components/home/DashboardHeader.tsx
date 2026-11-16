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
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    // Figma: soft shadow instead of a divider line.
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  profileSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: scale(12),
  },

  textContainer: {
    flex: 1,
    marginLeft: scale(16),
  },

  greeting: {
    fontSize: normalizeFont(12),
    lineHeight: normalizeFont(16),
    fontWeight: '500',
    color: '#111111',
  },

  userName: {
    fontSize: normalizeFont(18),
    lineHeight: normalizeFont(22),
    fontWeight: '700',
    color: '#111111',
  },
});

export default DashboardHeader;
