/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('react-native-safe-area-context', () => {
  const actual = jest.requireActual('react-native-safe-area-context');

  return {
    ...actual,
    initialWindowMetrics: {
      frame: { x: 0, y: 0, width: 360, height: 740 },
      insets: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../src/navigation/RootNavigator', () => {
  const ReactModule = require('react');
  const { View } = require('react-native');

  return {
    __esModule: true,
    default: () =>
      ReactModule.createElement(View, { testID: 'root-navigator' }),
  };
});

test('renders correctly', async () => {
  let renderer: ReturnType<typeof ReactTestRenderer.create> | undefined;

  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
    await Promise.resolve();
  });

  expect(renderer).toBeTruthy();
  expect(
    renderer!.root.findByProps({ testID: 'root-navigator' }),
  ).toBeTruthy();
});
