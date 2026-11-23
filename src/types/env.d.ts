/** Values from the root .env (react-native-dotenv). Read via src/config/env. */
declare module '@env' {
  export const APP_ENV: string | undefined;
  export const API_BASE_URL: string | undefined;
  export const API_TIMEOUT_MS: string | undefined;
  export const MAP_STYLE_URL: string | undefined;
  export const DOCUSEAL_API_URL: string | undefined;
  export const DOCUSEAL_FORM_URL: string | undefined;
  export const DOCUSEAL_FORM_SCRIPT: string | undefined;
  export const DOCUSEAL_API_KEY: string | undefined;
  export const DOCUSEAL_TEMPLATE_ID: string | undefined;
  export const DOCUSEAL_SIGNATURE_FIELD: string | undefined;
}
