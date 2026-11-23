/** Values from the root .env (react-native-dotenv). Read via src/config/env. */
declare module '@env' {
  export const APP_ENV: string | undefined;
  export const API_BASE_URL: string | undefined;
  export const API_TIMEOUT_MS: string | undefined;
  export const MAP_STYLE_URL: string | undefined;
}
