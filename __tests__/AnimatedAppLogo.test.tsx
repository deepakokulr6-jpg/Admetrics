import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import AnimatedAppLogo from '../src/components/shared/AnimatedAppLogo';
import AppLogo from '../src/components/shared/AppLogo';

describe('AnimatedAppLogo', () => {
  it('renders correctly with default props', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<AnimatedAppLogo />);
    });
    expect(renderer).toBeDefined();
    expect(renderer?.toJSON()).toBeTruthy();
  });

  it('renders with gradient color scheme', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <AnimatedAppLogo colorScheme="gradient" width={180} />,
      );
    });
    expect(renderer).toBeDefined();
  });

  it('supports animated prop on AppLogo wrapper', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<AppLogo animated width={160} />);
    });
    expect(renderer).toBeDefined();
  });
});

