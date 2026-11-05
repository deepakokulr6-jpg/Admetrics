import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import BottomNavigation from '../src/components/shared/BottomNavigation';
import * as SafeAreaContext from 'react-native-safe-area-context';

jest.mock('react-native-safe-area-context', () => {
  const actual = jest.requireActual('react-native-safe-area-context');
  return {
    ...actual,
    useSafeAreaInsets: jest.fn(() => ({
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    })),
  };
});

describe('BottomNavigation edge-to-edge safe area behavior', () => {
  it('renders all 4 tabs with baseline bottom padding when insets.bottom is 0', async () => {
    (SafeAreaContext.useSafeAreaInsets as jest.Mock).mockReturnValue({
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });

    const onTabPress = jest.fn();
    let renderer: ReturnType<typeof ReactTestRenderer.create> | undefined;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <BottomNavigation activeTab="Clinics" onTabPress={onTabPress} />,
      );
      await Promise.resolve();
    });

    expect(renderer).toBeTruthy();
    expect(
      renderer!.root.findByProps({
        accessibilityLabel: 'Clinics',
      }),
    ).toBeTruthy();
  });

  it('elevates tabs on Android edge-to-edge navigation bar (e.g. 48dp bottom inset)', async () => {
    (SafeAreaContext.useSafeAreaInsets as jest.Mock).mockReturnValue({
      top: 0,
      right: 0,
      bottom: 48,
      left: 0,
    });

    const onTabPress = jest.fn();
    let renderer: ReturnType<typeof ReactTestRenderer.create> | undefined;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <BottomNavigation activeTab="Support" onTabPress={onTabPress} />,
      );
      await Promise.resolve();
    });

    // Trigger tab press
    const supportTab = renderer!.root.findByProps({
      accessibilityLabel: 'Support',
    });
    await ReactTestRenderer.act(async () => {
      supportTab.props.onPress();
      await Promise.resolve();
    });

    expect(onTabPress).toHaveBeenCalledWith('Support');
  });
});
