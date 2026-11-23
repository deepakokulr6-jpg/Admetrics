import { http } from './client';
import { ENDPOINTS } from './endpoints';

/**
 * MOU signing, handled entirely by the backend (no third-party service):
 *
 *   1. GET  /clinics/{id}/mou            → MOU PDF link + version + status
 *   2. app shows the PDF, the user draws a signature
 *   3. POST /clinics/{id}/mou/sign       → backend stamps the PNG onto the
 *                                          PDF, stores it, returns its link
 *   4. app shows the signed PDF
 *   GET  /clinics/{id}/mou/document      → fresh link to the signed PDF
 *
 * Paths and field names follow the contract proposed to the backend;
 * confirm against their Postman collection.
 */

export type MouStatus = 'unsigned' | 'signed';

export type Mou = {
  /** Unsigned MOU PDF to show before signing. */
  pdfUrl: string;
  version: string;
  status: MouStatus;
  /** Signed PDF (short-lived link) once signed. */
  signedPdfUrl: string | null;
};

export type SignedMou = {
  mouId: string;
  signedAt: string;
  signedPdfUrl: string;
};

type Json = Record<string, unknown>;
const str = (body: Json, ...keys: string[]) => {
  for (const key of keys) {
    if (typeof body[key] === 'string' && body[key]) {
      return body[key] as string;
    }
  }
  return '';
};

export const getMou = async (clinicId: string): Promise<Mou> => {
  const body =
    (await http.get<Json>(ENDPOINTS.mou.get(clinicId), {
      auth: true,
    })) ?? {};
  const signedPdfUrl = str(body, 'signedPdfUrl', 'documentUrl') || null;
  return {
    pdfUrl: str(body, 'pdfUrl', 'url', 'content'),
    version: str(body, 'mouVersion', 'version') || 'v1',
    status: body.status === 'signed' || signedPdfUrl ? 'signed' : 'unsigned',
    signedPdfUrl,
  };
};

/**
 * Sends the drawn signature; the backend adds it to the PDF.
 * @param signaturePng base64 PNG without the data: prefix.
 */
export const signMou = async (
  clinicId: string,
  {
    signaturePng,
    signerName,
    signerEmail,
    mouVersion,
  }: {
    signaturePng: string;
    signerName: string;
    signerEmail: string;
    mouVersion: string;
  },
): Promise<SignedMou> => {
  const body =
    (await http.post<Json>(ENDPOINTS.mou.sign(clinicId), {
      auth: true,
      body: {
        signature: `data:image/png;base64,${signaturePng}`,
        signerName,
        signerEmail,
        mouVersion,
      },
    })) ?? {};
  return {
    mouId: str(body, 'mouId', 'id'),
    signedAt: str(body, 'signedAt') || new Date().toISOString(),
    signedPdfUrl: str(body, 'signedPdfUrl', 'documentUrl'),
  };
};

/** A fresh (short-lived) link to view the signed MOU later. */
export const getSignedMouLink = async (clinicId: string): Promise<string> => {
  const body =
    (await http.get<Json>(ENDPOINTS.mou.document(clinicId), {
      auth: true,
    })) ?? {};
  return str(body, 'signedPdfUrl', 'documentUrl', 'url');
};
