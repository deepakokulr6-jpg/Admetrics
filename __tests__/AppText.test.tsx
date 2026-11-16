import React from 'react';
import { StyleSheet } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import AppText, {
  BoldText,
  MediumText,
} from '../src/components/shared/AppText';

const styleOf = (element: React.ReactElement) => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(element);
  });
  return StyleSheet.flatten(
    renderer.root.findByType('Text' as any).props.style,
  );
};

describe('AppText', () => {
  it('renders Inter-Regular by default', () => {
    expect(styleOf(<AppText>Hi</AppText>).fontFamily).toBe('Inter-Regular');
  });

  it('applies a variant', () => {
    const style = styleOf(<AppText variant="label">Hi</AppText>);
    expect(style.fontFamily).toBe('Inter-Regular');
    expect(style.color).toBe('#221E25');
    expect(style.fontWeight).toBeUndefined();
  });

  it('lets weight, colour token and size override the variant', () => {
    const style = styleOf(
      <AppText variant="label" weight="semibold" color="red" size={20}>
        Hi
      </AppText>,
    );
    expect(style.fontFamily).toBe('Inter-SemiBold');
    expect(style.color).toBe('#FF2A2A');
    expect(style.fontSize).toBeGreaterThan(12);
  });

  it('has weight shorthands that pick the font file', () => {
    expect(styleOf(<MediumText>Hi</MediumText>).fontFamily).toBe(
      'Inter-Medium',
    );
    expect(styleOf(<BoldText>Hi</BoldText>).fontFamily).toBe('Inter-Bold');
  });
});
