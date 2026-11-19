/**
 * MOU e-signature (DocuSeal).
 *
 * To test without a backend:
 *   1. Create a free account at https://docuseal.com
 *   2. Templates → New → upload the MOU PDF, place a Signature field
 *      (optionally Name / Date) for the signer.
 *   3. Open the template → "Copy share link" → paste it below
 *      (looks like https://docuseal.com/d/AbC123xYz).
 *
 * Leave empty to use the built-in finger signature pad instead.
 *
 * Only ever put the public share link here – never a DocuSeal API key.
 * In production the backend should create a per-clinic submission and
 * return its signing link instead of this shared template link.
 */
export const DOCUSEAL_FORM_URL = 'https://docuseal.com/d/jxecS12SMPrUd5';

/** Script that renders the embedded DocuSeal signing form. */
export const DOCUSEAL_FORM_SCRIPT = 'https://cdn.docuseal.com/js/form.js';

/**
 * DocuSeal API settings for signing from the app (no backend yet).
 * Values live in the git-ignored `esign.local.ts`; copy
 * `esign.local.example.ts` to create it.
 */
export {
  DOCUSEAL_API_KEY,
  DOCUSEAL_TEMPLATE_ID,
  DOCUSEAL_SIGNATURE_FIELD,
} from './esign.local';

export const DOCUSEAL_API_URL = 'https://api.docuseal.com';
