import type { TimeSlot, WorkingHour } from '../types/clinic';
import { toMinutes } from './time';
import strings from '../constants/strings';

/** All slots of a day in order (first + extras). */
export const slotsOf = (hour: WorkingHour): TimeSlot[] => [
  { startTime: hour.startTime, endTime: hour.endTime },
  ...(hour.extraSlots ?? []),
];

/**
 * First problem with the open days' times, or null: each slot must close
 * after it opens, and a second slot must start after the first ends.
 */
export const validateWorkingHours = (
  hours: WorkingHour[],
): { index: number; message: string } | null => {
  for (let index = 0; index < hours.length; index += 1) {
    const hour = hours[index];
    if (!hour.enabled) {
      continue;
    }
    let previousEnd = -1;
    for (const slot of slotsOf(hour)) {
      const start = toMinutes(slot.startTime);
      const end = toMinutes(slot.endTime);
      if (start === null || end === null || end <= start) {
        return {
          index,
          message: strings.workingHours.endBeforeStart(hour.day),
        };
      }
      if (start < previousEnd) {
        return { index, message: strings.workingHours.overlap(hour.day) };
      }
      previousEnd = end;
    }
  }
  return null;
};
