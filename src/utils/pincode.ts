/**
 * Indian pincode → district and state, fully offline.
 *
 * Data: India Post "All India Pincode Directory" (data.gov.in, Government
 * Open Data Licence – India), reduced to src/data/pincodes.json with
 * current state / UT names (Telangana, Odisha, Ladakh, …).
 * To refresh it, re-run the build script on a newer directory export.
 */
type PincodeData = {
  states: string[];
  districts: string[];
  /** pincode → [district index, state index] */
  pincodes: Record<string, [number, number]>;
};

export type PincodeInfo = {
  district: string;
  state: string;
};

let data: PincodeData | null = null;

// Loaded on first use so the ~350 KB table isn't parsed at app start.
const load = (): PincodeData => {
  if (!data) {
    data = require('../data/pincodes.json') as PincodeData;
  }
  return data;
};

/** District + state for a 6-digit pincode, or null if it isn't known. */
export const lookupPincode = (pincode: string): PincodeInfo | null => {
  if (!/^[1-9]\d{5}$/.test(pincode)) {
    return null;
  }
  const { pincodes, districts, states } = load();
  const entry = pincodes[pincode];
  return entry
    ? { district: districts[entry[0]], state: states[entry[1]] }
    : null;
};

export type CityOption = PincodeInfo;

let cities: CityOption[] | null = null;

/** Every district with its state, A–Z (built once from the pincode table). */
const allCities = (): CityOption[] => {
  if (!cities) {
    const { pincodes, districts, states } = load();
    const seen = new Map<string, CityOption>();
    Object.values(pincodes).forEach(([d, s]) => {
      seen.set(districts[d], { district: districts[d], state: states[s] });
    });
    cities = [...seen.values()].sort((a, b) =>
      a.district.localeCompare(b.district),
    );
  }
  return cities;
};

/**
 * The directory uses the older official names for some districts; these
 * let users find them by today's name.
 */
const ALIASES: Record<string, string> = {
  bengaluru: 'Bangalore',
  gurugram: 'Gurgaon',
  mysuru: 'Mysore',
  prayagraj: 'Allahabad',
  belagavi: 'Belgaum',
  kalaburagi: 'Gulbarga',
  vijayapura: 'Bijapur',
  ballari: 'Bellary',
  shivamogga: 'Shimoga',
  tumakuru: 'Tumkur',
  mangaluru: 'Dakshina Kannada',
  mangalore: 'Dakshina Kannada',
  bombay: 'Mumbai',
  calcutta: 'Kolkata',
  madras: 'Chennai',
  baroda: 'Vadodara',
};

/** Cities (districts) matching what's typed: prefix matches first. */
export const searchCities = (query: string, limit = 5): CityOption[] => {
  const q = query.trim().toLowerCase();
  if (q.length < 2) {
    return [];
  }
  const list = allCities();
  const alias = Object.entries(ALIASES)
    .filter(([name]) => name.startsWith(q))
    .map(([, district]) => list.find(c => c.district === district))
    .filter((c): c is CityOption => Boolean(c));
  const starts = list.filter(c => c.district.toLowerCase().startsWith(q));
  const contains = list.filter(
    c =>
      !c.district.toLowerCase().startsWith(q) &&
      c.district.toLowerCase().includes(q),
  );
  const unique = new Map<string, CityOption>();
  [...alias, ...starts, ...contains].forEach(c => unique.set(c.district, c));
  return [...unique.values()].slice(0, limit);
};

/** State for a city name (exact, case-insensitive, aliases included). */
export const stateForCity = (city: string): string | null => {
  const q = city.trim().toLowerCase();
  const name = ALIASES[q]?.toLowerCase() ?? q;
  return (
    allCities().find(c => c.district.toLowerCase() === name)?.state ?? null
  );
};

/** All 36 states and union territories, A–Z. */
export const allStates = (): string[] =>
  [...load().states].sort((a, b) => a.localeCompare(b));
