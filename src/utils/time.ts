/**
 * Clinic times are stored as text like "09:30AM" (the format the design
 * shows and existing drafts use).
 */
export type TimeParts = { hour: number; minute: number; period: 'AM' | 'PM' };

const TIME = /^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/i;

export const parseTime = (value: string): TimeParts | null => {
  const match = TIME.exec(value.trim());
  if (!match) {
    return null;
  }
  return {
    hour: Number(match[1]),
    minute: Number(match[2]),
    period: match[3].toUpperCase() as 'AM' | 'PM',
  };
};

export const formatTime = ({ hour, minute, period }: TimeParts) =>
  `${String(hour).padStart(2, '0')}:${String(minute).padStart(
    2,
    '0',
  )}${period}`;

/** Minutes since midnight, for comparing times; null if not a valid time. */
export const toMinutes = (value: string): number | null => {
  const parts = parseTime(value);
  if (!parts) {
    return null;
  }
  const hour24 = (parts.hour % 12) + (parts.period === 'PM' ? 12 : 0);
  return hour24 * 60 + parts.minute;
};
