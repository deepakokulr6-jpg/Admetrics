import * as Location from 'expo-location';

/**
 * Location + address lookup using only the phone (GPS and the geocoder
 * built into iOS / Android). Free, no API key, no server.
 */

export type Coords = { latitude: number; longitude: number };

/** What the map picker hands back to the clinic form. */
export type PickedLocation = Coords & {
  /** Street / area line (may be empty). */
  street: string;
  city: string;
  state: string;
  pincode: string;
  /** One-line summary shown under the map. */
  label: string;
};

/** India's rough centre, for when nothing else is known. */
export const INDIA_CENTER: Coords = { latitude: 22.59, longitude: 78.96 };

/** Asks for "while using the app" location; false if refused. */
export const requestLocationPermission = async () => {
  try {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    return granted;
  } catch {
    return false;
  }
};

/** Current position (last known first, so it's instant), or null. */
export const getCurrentCoords = async (): Promise<Coords | null> => {
  if (!(await requestLocationPermission())) {
    return null;
  }
  try {
    const last = await Location.getLastKnownPositionAsync({ maxAge: 60_000 });
    const position =
      last ??
      (await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }));
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  } catch {
    return null;
  }
};

/** Address text → coordinates (e.g. "380015, Ahmedabad, Gujarat"). */
export const geocodeAddress = async (query: string): Promise<Coords | null> => {
  if (!query.trim()) {
    return null;
  }
  try {
    const [first] = await Location.geocodeAsync(`${query}, India`);
    return first
      ? { latitude: first.latitude, longitude: first.longitude }
      : null;
  } catch {
    return null;
  }
};

const join = (parts: (string | null | undefined)[]) =>
  [...new Set(parts.map(p => p?.trim()).filter(Boolean))].join(', ');

/** Coordinates → address parts for the clinic form, or null. */
export const reverseGeocode = async (
  coords: Coords,
): Promise<PickedLocation | null> => {
  try {
    const [place] = await Location.reverseGeocodeAsync(coords);
    if (!place) {
      return null;
    }
    // iOS / Android fill these differently; take what each one gives.
    const street = join([
      place.streetNumber && place.street
        ? `${place.streetNumber} ${place.street}`
        : place.street,
      place.district,
    ]);
    const city = place.city ?? place.subregion ?? '';
    const state = place.region ?? '';
    const pincode = (place.postalCode ?? '').replace(/\s/g, '');
    return {
      ...coords,
      street,
      city,
      state,
      pincode: /^\d{6}$/.test(pincode) ? pincode : '',
      label:
        place.formattedAddress ??
        join([place.name, street, city, state, pincode]),
    };
  } catch {
    return null;
  }
};
