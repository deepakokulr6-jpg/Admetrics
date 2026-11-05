import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';

interface ScreenHeaderProps {
  title?: string;
  onBackPress?: () => void;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title = 'Register Your Clinic',
  onBackPress,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, verticalScale(8)),
        },
      ]}
    >
      <View style={styles.row}>
        <Pressable
          onPress={onBackPress}
          style={styles.backButton}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={scale(22)} color="#221E25" />
        </Pressable>

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: scale(12),
    paddingBottom: verticalScale(12),

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: verticalScale(32),
  },
  backButton: {
    width: scale(24),
    height: verticalScale(32),
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginRight: scale(8),
  },
  title: {
    flex: 1,
    color: '#221E25',
    fontSize: normalizeFont(14),
    fontWeight: '700',
  },
});

export default ScreenHeader;
