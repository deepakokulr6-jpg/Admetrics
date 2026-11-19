import {
  DOCUSEAL_API_KEY,
  DOCUSEAL_API_URL,
  DOCUSEAL_SIGNATURE_FIELD,
  DOCUSEAL_TEMPLATE_ID,
} from '../config/esign';

/**
 * Signs the MOU on DocuSeal straight from the app: the signature drawn in
 * the app is placed on every "Signature" field of the template, the
 * submission is marked completed (no emails), and DocuSeal returns the
 * signed PDF with its audit trail.
 *
 * DEV ONLY: the API key ships inside the app. Before release this call
 * must move to the backend (app sends the signature, server signs).
 */

/** The DocuSeal template's single signer role. */
const SIGNER_ROLE = 'First Party';
const POLL_TRIES = 6;
const POLL_DELAY_MS = 1500;

export type SignedMou = {
  submissionId: number;
  /** Signed PDF (DocuSeal-hosted link). */
  documentUrl: string;
};

export const isESignConfigured = () =>
  Boolean(DOCUSEAL_API_KEY && DOCUSEAL_TEMPLATE_ID);

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${DOCUSEAL_API_URL}${path}`, {
    ...init,
    headers: {
      'X-Auth-Token': DOCUSEAL_API_KEY,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`DocuSeal ${path} failed (${response.status})`);
  }
  return response.json() as Promise<T>;
};

const wait = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(() => resolve(), ms);
  });

/**
 * @param signaturePng base64 PNG (no data: prefix) of the drawn signature.
 */
export const signMou = async ({
  signaturePng,
  email,
  name,
}: {
  signaturePng: string;
  email: string;
  name: string;
}): Promise<SignedMou> => {
  const [submitter] = await request<{ submission_id: number }[]>(
    '/submissions',
    {
      method: 'POST',
      body: JSON.stringify({
        template_id: Number(DOCUSEAL_TEMPLATE_ID),
        send_email: false,
        submitters: [
          {
            role: SIGNER_ROLE,
            email,
            name,
            completed: true,
            values: {
              [DOCUSEAL_SIGNATURE_FIELD]: `data:image/png;base64,${signaturePng}`,
            },
          },
        ],
      }),
    },
  );

  // The PDF is usually ready at once; give DocuSeal a few seconds if not.
  for (let attempt = 0; attempt < POLL_TRIES; attempt += 1) {
    const { documents } = await request<{
      documents?: { url: string }[];
    }>(`/submissions/${submitter.submission_id}/documents`);
    if (documents?.length) {
      return {
        submissionId: submitter.submission_id,
        documentUrl: documents[0].url,
      };
    }
    await wait(POLL_DELAY_MS);
  }
  throw new Error('DocuSeal did not return the signed document in time');
};
