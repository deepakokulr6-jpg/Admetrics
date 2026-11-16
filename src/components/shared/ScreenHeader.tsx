import React, { ReactNode } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import AppText from './AppText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackIcon from '../../../assets/images/figma/back.svg';
import { scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import strings from '../../constants/strings';

interface ScreenHeaderProps {
  title?: string;
  onBackPress?: () => void;
  rightElement?: ReactNode;
}

// Figma: white 94px bar (status bar included), 24px back icon at x16,
// title 14px bold #111 at x56, soft bottom shadow.
const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title = strings.common.registerYourClinic,
  onBackPress,
  rightElement,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top, verticalScale(8)) },
      ]}
    >
      <View style={styles.row}>
        <Pressable
          onPress={onBackPress}
          style={styles.backButton}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={strings.screenHeader.goBack}
        >
          <BackIcon width={scale(24)} height={scale(24)} />
        </Pressable>

        <AppText variant="headerTitle" style={styles.title} numberOfLines={1}>
          {title}
        </AppText>

        {rightElement ? <View>{rightElement}</View> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(20),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scale(24),
  },
  backButton: {
    width: scale(24),
    height: scale(24),
    marginRight: scale(16),
  },
  title: {
    flex: 1,
  },
});

export default ScreenHeader;
