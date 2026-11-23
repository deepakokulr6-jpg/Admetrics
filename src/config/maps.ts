import { ENV } from './env';

/**
 * Map tiles: OpenFreeMap (https://openfreemap.org) – free, no API key,
 * no request limits, OpenStreetMap data; the map shows the required
 * "© OpenStreetMap" credit. Change MAP_STYLE_URL in .env to switch provider.
 */
export const MAP_STYLE_URL = ENV.maps.styleUrl;
