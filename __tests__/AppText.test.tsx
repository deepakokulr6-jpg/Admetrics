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
  it('always renders Inter', () => {
    expect(styleOf(<AppText>Hi</AppText>).fontFamily).toBe('Inter');
    expect(
      styleOf(<AppText style={{ fontFamily: 'Other' }}>Hi</AppText>).fontFamily,
    ).toBe('Inter');
  });

  it('applies a variant', () => {
    const style = styleOf(<AppText variant="label">Hi</AppText>);
    expect(style.fontWeight).toBe('400');
    expect(style.color).toBe('#221E25');
  });

  it('lets weight, colour token and size override the variant', () => {
    const style = styleOf(
      <AppText variant="label" weight="semibold" color="red" size={20}>
        Hi
      </AppText>,
    );
    expect(style.fontWeight).toBe('600');
    expect(style.color).toBe('#FF2A2A');
    expect(style.fontSize).toBeGreaterThan(12);
  });

  it('has weight shorthands', () => {
    expect(styleOf(<MediumText>Hi</MediumText>).fontWeight).toBe('500');
    expect(styleOf(<BoldText>Hi</BoldText>).fontWeight).toBe('700');
  });
});
