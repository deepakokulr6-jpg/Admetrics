import {
  scale,
  verticalScale,
  moderateScale,
  normalizeFont,
  wp,
  hp,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  BASE_WIDTH,
  BASE_HEIGHT,
} from '../src/utils/responsive';
import lockFontScaling from '../src/utils/lockFontScaling';
import { Text, TextInput } from 'react-native';

describe('responsive utilities', () => {
  it('exports valid base dimensions and screen measurements', () => {
    // Figma frames are 360x800.
    expect(BASE_WIDTH).toBe(360);
    expect(BASE_HEIGHT).toBe(800);
    expect(SCREEN_WIDTH).toBeGreaterThan(0);
    expect(SCREEN_HEIGHT).toBeGreaterThan(0);
  });

  it('calculates scale proportionally to SCREEN_WIDTH', () => {
    const expected = (SCREEN_WIDTH / 360) * 100;
    expect(scale(100)).toBeCloseTo(expected, 4);
  });

  it('calculates verticalScale from SCREEN_HEIGHT, clamped to 0.85–1.12', () => {
    const ratio = Math.min(Math.max(SCREEN_HEIGHT / 800, 0.85), 1.12);
    expect(verticalScale(100)).toBeCloseTo(ratio * 100, 4);
    expect(verticalScale(100)).toBeGreaterThanOrEqual(85);
    expect(verticalScale(100)).toBeLessThanOrEqual(112.0001);
  });

  it('calculates moderateScale with default and custom factor', () => {
    const scaled = scale(100);
    const expectedDefault = 100 + (scaled - 100) * 0.5;
    expect(moderateScale(100)).toBeCloseTo(expectedDefault, 4);

    const expectedCustom = 100 + (scaled - 100) * 0.25;
    expect(moderateScale(100, 0.25)).toBeCloseTo(expectedCustom, 4);
  });

  it('normalizes font sizes to integer pixel boundaries', () => {
    const font = normalizeFont(16);
    expect(Number.isInteger(font)).toBe(true);
    expect(font).toBeGreaterThan(0);
  });

  it('calculates wp and hp percentages correctly', () => {
    expect(wp(50)).toBe(Math.round((SCREEN_WIDTH * 50) / 100));
    expect(wp(100)).toBe(Math.round(SCREEN_WIDTH));
    expect(hp(50)).toBe(Math.round((SCREEN_HEIGHT * 50) / 100));
    expect(hp(100)).toBe(Math.round(SCREEN_HEIGHT));
  });

  it('disables system font scaling on Text and TextInput via lockFontScaling', () => {
    lockFontScaling();
    expect((Text as any).defaultProps?.allowFontScaling).toBe(false);
    expect((TextInput as any).defaultProps?.allowFontScaling).toBe(false);
  });
});

