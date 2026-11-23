import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import ProfileAvatar from '../shared/ProfileAvatar';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';
import { APP_VERSION, COMPANY_NAME } from '../../config/app';
import { themedStyles } from '../../theme/themedStyles';

type Props = {
  visible: boolean;
  name: string;
  onClose: () => void;
  onLogout: () => void;
  onMouAgreement?: () => void;
  onNotification?: () => void;
  onSettings?: () => void;
  onAddDevice?: () => void;
  onBankAccount?: () => void;
  /** Shows the green "Added" label on Bank Account. */
  bankAccountAdded?: boolean;
};

// Figma side menu: 280px wide on the 360px frame.
const DRAWER_WIDTH = scale(280);

const ICONS = {
  mou: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM8 17.5a.75.75 0 110-1.5.75.75 0 010 1.5zm0-3a.75.75 0 110-1.5.75.75 0 010 1.5zm0-3a.75.75 0 110-1.5.75.75 0 010 1.5zm8 5.75h-6v-1.5h6v1.5zm0-3h-6v-1.5h6v1.5zm0-3h-6v-1.5h6v1.5zM13 9V3.5L18.5 9H13z',
  notification:
    'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z',
  settings:
    'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.48.48 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1112 8.4a3.6 3.6 0 010 7.2z',
  // Filled TV with a stand dot (Figma "Add Device").
  addDevice:
    'M3.5 4.5h17a1.5 1.5 0 011.5 1.5v11a1.5 1.5 0 01-1.5 1.5h-6.2a2.4 2.4 0 00-4.6 0H3.5A1.5 1.5 0 012 17V6a1.5 1.5 0 011.5-1.5zM12 17.5a1.3 1.3 0 110 2.6 1.3 1.3 0 010-2.6z',
  // Filled bank: roof, four pillars, base.
  bank: 'M12 2.5l10 5v2H2v-2l10-5zM4 10.5h3v7H4v-7zm4.75 0h3v7h-3v-7zm4.5 0h3v7h-3v-7zM18 10.5h3v7h-3v-7zM2 19h20v2.5H2V19z',
  logoutDoor:
    'M3 5.2C3 4.1 3.8 3.2 4.9 3l7-1.2c.6-.1 1.1.4 1.1 1v18.4c0 .6-.5 1.1-1.1 1L4.9 21c-1.1-.2-1.9-1.1-1.9-2.2V5.2z',
  logoutArrow: 'M15 12h7m-2.5-2.75L22 12l-2.5 2.75M15 4.5h1.5v3M15 19.5h1.5v-3',
};

type ItemProps = {
  label: string;
  danger?: boolean;
  /** Optional pill on the right (e.g. "Added"). */
  badge?: string;
  onPress: () => void;
  icon: React.ReactNode;
};

const DrawerItem: React.FC<ItemProps> = ({
  label,
  danger,
  badge,
  onPress,
  icon,
}) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
  >
    <View style={styles.itemIcon}>{icon}</View>
    <Text style={[styles.itemLabel, danger && styles.itemLabelDanger]}>
      {label}
    </Text>
    {badge ? (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
    ) : null}
  </Pressable>
);

/**
 * Side menu opened from the avatar / name in the home header. Slides in from
 * the left over a dimmed backdrop; tap outside, swipe-back or Android back
 * closes it.
 */
const ProfileDrawer: React.FC<Props> = ({
  visible,
  name,
  onClose,
  onLogout,
  onMouAgreement,
  onNotification,
  onSettings,
  onAddDevice,
  onBankAccount,
  bankAccountAdded,
}) => {
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const progress = useRef(new Animated.Value(0)).current;
  const pendingActionRef = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(progress, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(progress, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setMounted(false);
          // Run the chosen item's action once the menu is fully gone, so the
          // next screen opens cleanly instead of behind the closing menu.
          const action = pendingActionRef.current;
          pendingActionRef.current = undefined;
          action?.();
        }
      });
    }
  }, [visible, progress]);

  // Close first, then run the action once the slide-out has started.
  const select = (action?: () => void) => () => {
    pendingActionRef.current = action;
    onClose();
  };

  const iconSize = scale(22);
  const icon = (d: string, color: string) => (
    <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24">
      <Path d={d} fill={color} />
    </Svg>
  );

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.backdrop, { opacity: progress }]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={strings.profileDrawer.closeMenu}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [
              {
                translateX: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-DRAWER_WIDTH, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <ProfileAvatar size={scale(40)} />
          <View style={styles.headerText}>
            <Text style={styles.greeting}>
              {strings.dashboardHeader.goodMorning}
            </Text>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
          </View>
        </View>

        <View style={styles.menu}>
          <DrawerItem
            label={strings.profileDrawer.mouAgreement}
            icon={icon(ICONS.mou, colors.bodyText)}
            onPress={select(onMouAgreement)}
          />
          <DrawerItem
            label={strings.profileDrawer.notification}
            icon={icon(ICONS.notification, colors.bodyText)}
            onPress={select(onNotification)}
          />
          <DrawerItem
            label={strings.profileDrawer.addDevice}
            icon={icon(ICONS.addDevice, colors.bodyText)}
            onPress={select(onAddDevice)}
          />
          <DrawerItem
            label={strings.profileDrawer.bankAccount}
            badge={bankAccountAdded ? strings.profileDrawer.added : undefined}
            icon={icon(ICONS.bank, colors.bodyText)}
            onPress={select(onBankAccount)}
          />
          <DrawerItem
            label={strings.profileDrawer.settings}
            icon={icon(ICONS.settings, colors.bodyText)}
            onPress={select(onSettings)}
          />
          <DrawerItem
            label={strings.profileDrawer.logOut}
            danger
            icon={
              <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24">
                <Path d={ICONS.logoutDoor} fill={colors.red} />
                <Path
                  d={ICONS.logoutArrow}
                  fill="none"
                  stroke={colors.red}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            }
            onPress={select(onLogout)}
          />
        </View>

        <View
          style={[
            styles.footer,
            { paddingBottom: insets.bottom + verticalScale(24) },
          ]}
        >
          <Text style={styles.footerText}>
            {strings.profileDrawer.version(APP_VERSION)}
          </Text>
          <Text style={styles.footerText}>
            {strings.profileDrawer.copyright(
              new Date().getFullYear(),
              COMPANY_NAME,
            )}
          </Text>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = themedStyles(() =>
  StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor: colors.backdrop,
    },
    drawer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: DRAWER_WIDTH,
      backgroundColor: colors.white,
    },
    // Figma: grey block 124px tall, avatar 40px at 16px from the left.
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      paddingHorizontal: scale(16),
      paddingBottom: verticalScale(20),
      minHeight: verticalScale(124),
    },
    headerText: {
      flex: 1,
      marginLeft: scale(16),
    },
    greeting: {
      fontSize: normalizeFont(12),
      lineHeight: normalizeFont(16),
      fontFamily: fonts.medium,
      color: colors.textStrong,
    },
    name: {
      fontSize: normalizeFont(18),
      lineHeight: normalizeFont(22),
      fontFamily: fonts.bold,
      color: colors.textStrong,
    },
    menu: {
      paddingTop: verticalScale(20),
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      height: verticalScale(52),
      paddingHorizontal: scale(25),
    },
    itemPressed: {
      backgroundColor: colors.background,
    },
    itemIcon: {
      width: scale(22),
      alignItems: 'center',
    },
    itemLabel: {
      marginLeft: scale(14),
      fontSize: normalizeFont(14),
      fontFamily: fonts.medium,
      color: colors.bodyText,
    },
    badge: {
      marginLeft: 'auto',
      paddingHorizontal: scale(10),
      paddingVertical: verticalScale(4),
      borderRadius: scale(14),
      backgroundColor: colors.successBackground,
    },
    badgeText: {
      fontSize: normalizeFont(12),
      fontFamily: fonts.semibold,
      color: colors.success,
    },
    // Version + copyright pinned to the bottom of the menu.
    footer: {
      marginTop: 'auto',
      paddingHorizontal: scale(24),
      gap: verticalScale(6),
    },
    footerText: {
      fontSize: normalizeFont(10),
      fontFamily: fonts.regular,
      color: colors.bodyText,
    },
    itemLabelDanger: {
      color: colors.red,
    },
  }),
);

export default ProfileDrawer;
