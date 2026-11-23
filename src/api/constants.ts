/** HTTP vocabulary shared by the API client and modules. */

export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

export type HttpMethod = (typeof HTTP_METHOD)[keyof typeof HTTP_METHOD];

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  GONE: 410,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
} as const;

/** Status used by ApiError when no response arrived (offline / timeout). */
export const NO_RESPONSE = 0;

export const HEADER = {
  ACCEPT: 'Accept',
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  /** Backend echoes this on every response; quote it in bug reports. */
  REQUEST_ID: 'X-Request-Id',
} as const;

export const CONTENT_TYPE = {
  JSON: 'application/json',
} as const;

/** Error codes the backend sends in `{error: {code}}`. */
export const API_ERROR_CODE = {
  VALIDATION: 'VALIDATION_ERROR',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
} as const;
