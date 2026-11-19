/**
 * Copy this file to `esign.local.ts` (same folder) and fill in your values.
 * `esign.local.ts` is git-ignored, so the API key never gets committed.
 *
 * DEV ONLY: a key inside the app can be extracted from a release build.
 * Before release, move the DocuSeal API call to the backend.
 */

/** DocuSeal → Settings → API → copy the key. */
export const DOCUSEAL_API_KEY = '';

/** DocuSeal → Templates → open the MOU → the number in the URL. */
export const DOCUSEAL_TEMPLATE_ID = '';

/** Name of the signature field placed on the MOU template. */
export const DOCUSEAL_SIGNATURE_FIELD = 'Signature';
