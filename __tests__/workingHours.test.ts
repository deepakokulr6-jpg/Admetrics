import { formatTime, parseTime, toMinutes } from '../src/utils/time';
import { validateWorkingHours } from '../src/utils/workingHours';
import { createDefaultWorkingHours } from '../src/types/clinic';

describe('time helpers', () => {
  it('parses and formats clinic times', () => {
    expect(parseTime('9:30 pm')).toEqual({ hour: 9, minute: 30, period: 'PM' });
    expect(formatTime({ hour: 5, minute: 0, period: 'AM' })).toBe('05:00AM');
    expect(toMinutes('12:00AM')).toBe(0);
    expect(toMinutes('12:30PM')).toBe(12 * 60 + 30);
    expect(parseTime('25:00AM')).toBeNull();
  });
});

describe('validateWorkingHours', () => {
  it('accepts the default week', () => {
    expect(validateWorkingHours(createDefaultWorkingHours())).toBeNull();
  });

  it('rejects a slot that closes before it opens', () => {
    const hours = createDefaultWorkingHours();
    hours[1] = { ...hours[1], startTime: '09:30PM', endTime: '09:30AM' };
    expect(validateWorkingHours(hours)?.index).toBe(1);
  });

  it('rejects a second slot that overlaps the first', () => {
    const hours = createDefaultWorkingHours();
    hours[0] = {
      ...hours[0],
      startTime: '09:30AM',
      endTime: '12:30PM',
      extraSlots: [{ startTime: '12:00PM', endTime: '09:30PM' }],
    };
    expect(validateWorkingHours(hours)?.index).toBe(0);

    hours[0].extraSlots = [{ startTime: '05:30PM', endTime: '09:30PM' }];
    expect(validateWorkingHours(hours)).toBeNull();
  });

  it('ignores closed days', () => {
    const hours = createDefaultWorkingHours();
    hours[6] = { ...hours[6], enabled: false, startTime: '', endTime: '' };
    expect(validateWorkingHours(hours)).toBeNull();
  });
});
