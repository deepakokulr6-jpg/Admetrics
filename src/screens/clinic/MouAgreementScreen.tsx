import React, { useRef, useState } from 'react';
import {
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../../components/shared/ScreenHeader';
import MouDocument from '../../components/clinic/MouDocument';
import type { AppScreenProps } from '../../navigation/types';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';

/**
 * Pages of the agreement: each entry lists the strings.mouDocument sections
 * printed on that page. Add pages here as the real MOU text grows.
 */
const MOU_PAGES: number[][] = [strings.mouDocument.map((_, index) => index)];

/**
 * Full-page MOU, opened from "MOU Agreement" in the side menu. Looks like a
 * document viewer: white pages separated by dark bars, with a page counter
 * (Figma "1/23") that follows the scroll position.
 */
const MouAgreementScreen: React.FC<AppScreenProps<'MouAgreement'>> = ({
  navigation,
}) => {
  const pageTops = useRef<number[]>([]);
  const [page, setPage] = useState(1);

  const onPageLayout = (index: number) => (event: LayoutChangeEvent) => {
    pageTops.current[index] = event.nativeEvent.layout.y;
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    // The page that covers the middle of the screen is the current one.
    const middle = contentOffset.y + layoutMeasurement.height / 2;
    let current = 1;
    pageTops.current.forEach((top, index) => {
      if (top <= middle) {
        current = index + 1;
      }
    });
    setPage(previous => (previous === current ? previous : current));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScreenHeader
        title={strings.mou.memorandumOfUnderstanding}
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.flex}>
        <ScrollView
          style={styles.flex}
          onScroll={onScroll}
          scrollEventThrottle={64}
          showsVerticalScrollIndicator={false}
        >
          {MOU_PAGES.map((sections, index) => (
            <View
              key={index}
              onLayout={onPageLayout(index)}
              style={[styles.page, index > 0 && styles.pageBreak]}
            >
              <MouDocument sections={sections} />
            </View>
          ))}
        </ScrollView>

        <View style={styles.pageBadge} pointerEvents="none">
          <Text style={styles.pageBadgeText}>
            {strings.mou.pageCount(page, MOU_PAGES.length)}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex: {
    flex: 1,
  },
  page: {
    backgroundColor: colors.white,
    paddingHorizontal: scale(28),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(40),
  },
  // Figma: thick dark bar between pages.
  pageBreak: {
    borderTopWidth: scale(4),
    borderTopColor: colors.textStrong,
  },
  pageBadge: {
    position: 'absolute',
    top: verticalScale(20),
    right: scale(16),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: scale(14),
    backgroundColor: colors.mutedText,
  },
  pageBadgeText: {
    fontSize: normalizeFont(12),
    fontFamily: fonts.medium,
    color: colors.white,
  },
});

export default MouAgreementScreen;
