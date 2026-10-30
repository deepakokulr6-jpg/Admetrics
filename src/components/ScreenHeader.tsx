import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ScreenHeaderProps {
  title?: string;
  onBackPress?: () => void;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title = 'Register Your Clinic',
  onBackPress,
}) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          width,
          paddingTop: Math.max(insets.top, 8),
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
          <Ionicons name="chevron-back" size={22} color="#221E25" />
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
    height: 94,
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingBottom: 14,

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
    height: 32,
  },
  backButton: {
    width: 24,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginRight: 8,
  },
  title: {
    flex: 1,
    color: '#221E25',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ScreenHeader;
