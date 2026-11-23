import { ENV } from './env';

/**
 * MOU e-signature (DocuSeal), from .env.
 *
 * DEV ONLY: DOCUSEAL_API_KEY ships inside the app. Before release, signing
 * moves to the backend (app sends the signature PNG, server builds the PDF)
 * and the key is removed from .env.
 */
export const DOCUSEAL_API_URL = ENV.docuseal.apiUrl;
export const DOCUSEAL_FORM_URL = ENV.docuseal.formUrl;
export const DOCUSEAL_FORM_SCRIPT = ENV.docuseal.formScript;
export const DOCUSEAL_API_KEY = ENV.docuseal.apiKey;
export const DOCUSEAL_TEMPLATE_ID = ENV.docuseal.templateId;
export const DOCUSEAL_SIGNATURE_FIELD = ENV.docuseal.signatureField;
