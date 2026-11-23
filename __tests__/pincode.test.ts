import { lookupPincode } from '../src/utils/pincode';

describe('lookupPincode', () => {
  it('finds district and state with current names', () => {
    expect(lookupPincode('500001')).toEqual({
      district: 'Hyderabad',
      state: 'Telangana',
    });
    expect(lookupPincode('194101')?.state).toBe('Ladakh');
    expect(lookupPincode('110001')?.state).toBe('Delhi');
  });

  it('returns null for malformed or unknown pincodes', () => {
    expect(lookupPincode('12345')).toBeNull();
    expect(lookupPincode('012345')).toBeNull();
    expect(lookupPincode('999999')).toBeNull();
  });
});

describe('city search', () => {
  const {
    searchCities,
    stateForCity,
    allStates,
  } = require('../src/utils/pincode');

  it('suggests cities with their state', () => {
    expect(searchCities('ahmed')).toContainEqual({
      district: 'Ahmedabad',
      state: 'Gujarat',
    });
    expect(searchCities('a')).toEqual([]);
  });

  it('finds renamed cities by their new name', () => {
    expect(searchCities('bengaluru')[0].district).toBe('Bangalore');
    expect(stateForCity('Gurugram')).toBe('Haryana');
  });

  it('maps an exact city to its state', () => {
    expect(stateForCity('ahmedabad')).toBe('Gujarat');
    expect(stateForCity('Nowhere')).toBeNull();
  });

  it('lists all 36 states and union territories', () => {
    expect(allStates()).toHaveLength(36);
  });
});
