import { Dimensions, PixelRatio } from 'react-native';

// Figma frames are "Android Large" 360x800, so sizes copied from the design
// come out exactly 1:1 on a 360-wide phone and scale from there.
export const BASE_WIDTH = 360;
export const BASE_HEIGHT = 800;

let { width, height } = Dimensions.get('window');

// Keep values current on foldables / split screen. Styles built with
// StyleSheet.create at import time keep their first value; anything computed
// during render (inline styles, hooks) picks up the new size.
export let SCREEN_WIDTH = width;
export let SCREEN_HEIGHT = height;
Dimensions.addEventListener(
  'change',
  ({ window }: { window: { width: number; height: number } }) => {
    width = window.width;
    height = window.height;
    SCREEN_WIDTH = window.width;
    SCREEN_HEIGHT = window.height;
  },
);

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const scale = (size: number) => (width / BASE_WIDTH) * size;

// Vertical gaps follow screen height, but are clamped so very short phones
// (iPhone SE) don't get cramped and very tall ones (20:9 Android) don't get
// stretched far beyond the design.
export const verticalScale = (size: number) =>
  clamp(height / BASE_HEIGHT, 0.85, 1.12) * size;

export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// System font scaling is switched off app-wide (utils/lockFontScaling), so
// sizes depend on screen width only.
export const normalizeFont = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(moderateScale(size)));

export const wp = (percent: number) => Math.round((width * percent) / 100);

export const hp = (percent: number) => Math.round((height * percent) / 100);

export const hitSlop = (margin: number) => ({
  top: margin,
  bottom: margin,
  left: margin,
  right: margin,
});

export default {
  scale,
  verticalScale,
  moderateScale,
  normalizeFont,
  wp,
  hp,
  hitSlop,
  get SCREEN_WIDTH() {
    return width;
  },
  get SCREEN_HEIGHT() {
    return height;
  },
  BASE_WIDTH,
  BASE_HEIGHT,
};
