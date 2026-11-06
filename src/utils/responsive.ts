import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

export const BASE_WIDTH = 375;
export const BASE_HEIGHT = 812;

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

export const scale = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;

export const verticalScale = (size: number) =>
  (SCREEN_HEIGHT / BASE_HEIGHT) * size;

export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// System font scaling is switched off app-wide (utils/lockFontScaling), so
// sizes depend on screen width only.
export const normalizeFont = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(moderateScale(size)));

export const wp = (percent: number) =>
  Math.round((SCREEN_WIDTH * percent) / 100);

export const hp = (percent: number) =>
  Math.round((SCREEN_HEIGHT * percent) / 100);

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
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  BASE_WIDTH,
  BASE_HEIGHT,
};
