import { useTween } from './useTween';

// "₹48,650" → prefix "₹", number 48650, suffix "" (also "12.8%", "₹7,561.60").
const NUMBER_PATTERN = /^(\D*)([\d,]+(?:\.(\d+))?)(\D*)$/;

// Indian digit grouping: 1,23,45,678
const groupIndian = (digits: string) => {
  const last3 = digits.slice(-3);
  const rest = digits.slice(0, -3);
  return rest
    ? `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')},${last3}`
    : last3;
};

/**
 * Counts a formatted amount up from 0, keeping its symbol, decimals and
 * comma style. Text that isn't a number is returned unchanged.
 */
export const useCountUp = (text: string, duration = 900) => {
  const progress = useTween(text, duration);
  const match = NUMBER_PATTERN.exec(text);

  if (!match) {
    return text;
  }

  const [, prefix, numberText, fraction = '', suffix] = match;
  const target = parseFloat(numberText.replace(/,/g, ''));
  const [whole, decimals] = (target * progress)
    .toFixed(fraction.length)
    .split('.');
  const grouped = numberText.includes(',') ? groupIndian(whole) : whole;

  return `${prefix}${grouped}${decimals ? `.${decimals}` : ''}${suffix}`;
};
