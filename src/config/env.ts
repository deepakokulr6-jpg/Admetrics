// Named imports only: the dotenv babel plugin inlines each value.
import {
  API_BASE_URL,
  API_TIMEOUT_MS,
  APP_ENV as APP_ENV_RAW,
  MAP_STYLE_URL,
} from '@env';

/**
 * The app's configuration, from the root `.env` (copy `.env.example`).
 * Everything that differs between development / staging / production lives
 * there; the rest of the app imports from here, never from '@env'.
 *
 * Values are baked in at build time: restart Metro with `--reset-cache`
 * (and rebuild release apps) after editing `.env`.
 */

export type AppEnv = 'development' | 'staging' | 'production';

const read = (value: string | undefined, fallback: string) =>
  value && value.trim() ? value.trim() : fallback;

const withoutTrailingSlash = (url: string) => url.replace(/\/+$/, '');

export const APP_ENV = read(APP_ENV_RAW, 'development') as AppEnv;

export const ENV = {
  appEnv: APP_ENV,
  isProduction: APP_ENV === 'production',

  api: {
    baseUrl: withoutTrailingSlash(
      read(API_BASE_URL, 'http://192.168.0.165:3000/api'),
    ),
    timeoutMs: Number(read(API_TIMEOUT_MS, '15000')) || 15000,
  },

  maps: {
    styleUrl: read(
      MAP_STYLE_URL,
      'https://tiles.openfreemap.org/styles/liberty',
    ),
  },
} as const;

// A production build must never talk to a plain-HTTP API.
if (ENV.isProduction && !ENV.api.baseUrl.startsWith('https://')) {
  throw new Error(
    `API_BASE_URL must be https in production (${ENV.api.baseUrl})`,
  );
}
