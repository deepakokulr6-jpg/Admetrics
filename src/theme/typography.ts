import { moderateScale } from '../utils/responsive';

export const typography = {
  heading: {
    fontSize: moderateScale(22),
    fontWeight: '700' as const,
    color: '#221E25',
  },
  subheading: {
    fontSize: moderateScale(16),
    fontWeight: '600' as const,
    color: '#221E25',
  },
  body: {
    fontSize: moderateScale(14),
    color: '#221E25',
  },
  caption: {
    fontSize: moderateScale(12),
    color: '#777777',
  },
};

export default typography;
