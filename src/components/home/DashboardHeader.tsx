import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import ProfileAvatar from '../shared/ProfileAvatar';
import AppLogo from '../shared/AppLogo';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';
import { useLogout } from '../../hooks/useLogout';
import { useAuth } from '../../contexts/AuthContext';
import ProfileDrawer from './ProfileDrawer';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';

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
  const confirmLogout = useLogout();
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  // Default: avatar / name opens the side menu on every tab.
  const handleProfilePress = onProfilePress ?? (() => setDrawerOpen(true));
  const displayName = userName ?? name ?? user?.name ?? '';
  const logoSize = scale(40);
  const logo = <AppLogo width={logoSize} height={logoSize} />;

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.profileSection}
        onPress={handleProfilePress}
        accessibilityRole="button"
        accessibilityLabel={strings.dashboardHeader.openProfile}
      >
        <ProfileAvatar size={logoSize} />

        <View style={styles.textContainer}>
          <Text style={styles.greeting}>
            {strings.dashboardHeader.goodMorning}
          </Text>
          <Text style={styles.userName} numberOfLines={1}>
            {displayName}
          </Text>
        </View>
      </Pressable>

      {onLogoPress ? (
        <Pressable
          onPress={onLogoPress}
          accessibilityRole="button"
          accessibilityLabel={strings.dashboardHeader.admetricsHome}
          hitSlop={8}
        >
          {logo}
        </Pressable>
      ) : (
        <View
          accessible
          accessibilityLabel={strings.dashboardHeader.admetricsLogo}
        >
          {logo}
        </View>
      )}

      <ProfileDrawer
        visible={drawerOpen}
        name={displayName}
        onClose={() => setDrawerOpen(false)}
        onLogout={confirmLogout}
        onMouAgreement={() => navigation.navigate('MouAgreement')}
      />
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
    backgroundColor: colors.white,
    // Figma: soft shadow instead of a divider line.
    shadowColor: colors.black,
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
    fontFamily: fonts.medium,
    color: colors.textStrong,
  },

  userName: {
    fontSize: normalizeFont(18),
    lineHeight: normalizeFont(22),
    fontFamily: fonts.bold,
    color: colors.textStrong,
  },
});

export default DashboardHeader;
