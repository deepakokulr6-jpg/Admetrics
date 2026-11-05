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
    expect(BASE_WIDTH).toBe(375);
    expect(BASE_HEIGHT).toBe(812);
    expect(SCREEN_WIDTH).toBeGreaterThan(0);
    expect(SCREEN_HEIGHT).toBeGreaterThan(0);
  });

  it('calculates scale proportionally to SCREEN_WIDTH', () => {
    const expected = (SCREEN_WIDTH / 375) * 100;
    expect(scale(100)).toBeCloseTo(expected, 4);
  });

  it('calculates verticalScale proportionally to SCREEN_HEIGHT', () => {
    const expected = (SCREEN_HEIGHT / 812) * 100;
    expect(verticalScale(100)).toBeCloseTo(expected, 4);
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

