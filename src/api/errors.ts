import { HTTP_STATUS, NO_RESPONSE } from './constants';

/** One invalid field from a validation error (`path` = body field name). */
export type ApiFieldError = { path: string; message: string };

type Json = Record<string, unknown>;

const isRecord = (value: unknown): value is Json =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

/**
 * A failed API call. Built from the Admetrics error body
 * `{error: {code, message, fields: [{path, message}]}, requestId}`.
 *
 * `status` 0 = no response (offline / timeout). `message` is the most
 * specific text the server sent (first field message, else the error
 * message), or `HTTP <status>` when the body was empty.
 */
export class ApiError extends Error {
  /** Server error code, e.g. VALIDATION_ERROR, INVALID_CREDENTIALS. */
  readonly code?: string;
  /** Per-field validation messages, keyed by body field name. */
  readonly fields: Record<string, string>;
  /** Backend request id (body or X-Request-Id header), for bug reports. */
  readonly requestId?: string;

  constructor(
    readonly status: number,
    message: string,
    readonly body?: unknown,
    requestId?: string,
  ) {
    super(message);
    this.name = 'ApiError';
    const error = isRecord(body) && isRecord(body.error) ? body.error : {};
    this.code = typeof error.code === 'string' ? error.code : undefined;
    this.fields = Object.fromEntries(
      (Array.isArray(error.fields) ? error.fields : [])
        .filter(isRecord)
        .filter(
          (field): field is ApiFieldError =>
            typeof field.path === 'string' && typeof field.message === 'string',
        )
        .map(field => [field.path, field.message]),
    );
    this.requestId =
      requestId ??
      (isRecord(body) && typeof body.requestId === 'string'
        ? body.requestId
        : undefined);
  }

  /** Offline, server down or unreachable. */
  get isNetwork() {
    return this.status === NO_RESPONSE && this.message === 'network';
  }

  /** Cancelled by the caller (AbortSignal): usually ignore. */
  get isCancelled() {
    return this.status === NO_RESPONSE && this.message === 'cancelled';
  }

  get isTimeout() {
    return this.status === NO_RESPONSE && this.message === 'timeout';
  }

  get isUnauthorized() {
    return this.status === HTTP_STATUS.UNAUTHORIZED;
  }

  get isValidation() {
    return (
      this.status === HTTP_STATUS.BAD_REQUEST ||
      this.status === HTTP_STATUS.UNPROCESSABLE
    );
  }

  get isServer() {
    return this.status >= HTTP_STATUS.SERVER_ERROR;
  }
}

/** Most specific message in an error body, if any. */
export const messageFromBody = (body: unknown): string | undefined => {
  if (!isRecord(body)) {
    return typeof body === 'string' && body ? body : undefined;
  }
  if (isRecord(body.error)) {
    const fields = Array.isArray(body.error.fields) ? body.error.fields : [];
    const first = fields.find(isRecord);
    if (first && typeof first.message === 'string') {
      return first.message;
    }
    if (typeof body.error.message === 'string') {
      return body.error.message;
    }
  }
  const candidate = body.message ?? body.error ?? body.detail;
  if (typeof candidate === 'string') {
    return candidate;
  }
  if (Array.isArray(candidate) && typeof candidate[0] === 'string') {
    return candidate[0];
  }
  return undefined;
};
