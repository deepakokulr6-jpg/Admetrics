import {
  applyMask,
  GST_MASK,
  IFSC_MASK,
  keyboardForMask,
  PAN_MASK,
} from '../src/utils/inputMask';

describe('applyMask', () => {
  it('formats a pasted PAN, upper-casing and dropping spaces', () => {
    expect(applyMask('abcde 1234 f', PAN_MASK)).toBe('ABCDE1234F');
  });

  it('rejects characters of the wrong kind for their position', () => {
    expect(applyMask('AB1', PAN_MASK)).toBe('AB');
    expect(applyMask('ABCDEX', PAN_MASK)).toBe('ABCDE');
  });

  it('stops at the mask length', () => {
    expect(applyMask('ABCDE1234FZZZ', PAN_MASK)).toBe('ABCDE1234F');
  });

  it('accepts a full GST number', () => {
    expect(applyMask('22abcde1234f1z5', GST_MASK)).toBe('22ABCDE1234F1Z5');
  });

  it('fills in the fixed Z when the next character is typed', () => {
    expect(applyMask('22ABCDE1234F15', GST_MASK)).toBe('22ABCDE1234F1Z5');
  });
});

describe('keyboardForMask', () => {
  it('shows numbers for digit positions', () => {
    expect(keyboardForMask('ABCDE', PAN_MASK)).toBe('number-pad');
    expect(keyboardForMask('', GST_MASK)).toBe('number-pad');
  });

  it('shows letters for letter positions', () => {
    expect(keyboardForMask('', PAN_MASK)).not.toBe('number-pad');
    expect(keyboardForMask('ABCDE1234', PAN_MASK)).not.toBe('number-pad');
  });
});

describe('IFSC', () => {
  it('fills the fixed 0 and keeps the branch code', () => {
    expect(applyMask('cnrb 000 3241', IFSC_MASK)).toBe('CNRB0003241');
    // 0 left out: it is filled in before the branch code.
    expect(applyMask('sbinA12345', IFSC_MASK)).toBe('SBIN0A12345');
    expect(applyMask('CNRB0003241', IFSC_MASK)).toBe('CNRB0003241');
  });

  it('shows numbers for the fixed 0', () => {
    expect(keyboardForMask('CNRB', IFSC_MASK)).toBe('number-pad');
  });
});
