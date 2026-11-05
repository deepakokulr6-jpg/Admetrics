import { normalizeFont } from '../utils/responsive';

export const typography = {
  heading: { fontSize: normalizeFont(22), fontWeight: '700' as const, color: '#221E25' },
  subheading: { fontSize: normalizeFont(16), fontWeight: '600' as const, color: '#221E25' },
  body: { fontSize: normalizeFont(14), color: '#221E25' },
  caption: { fontSize: normalizeFont(12), color: '#777777' },
};

export default typography;
