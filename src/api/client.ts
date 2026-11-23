import { ENV } from '../config/env';
import {
  CONTENT_TYPE,
  HEADER,
  HTTP_METHOD,
  HTTP_STATUS,
  type HttpMethod,
  NO_RESPONSE,
} from './constants';
import { ApiError, messageFromBody } from './errors';
import { logResponse } from './logger';
import type { QueryParams } from './types';

export { ApiError } from './errors';

export type RequestOptions = {
  /** JSON-serialisable body, or FormData for file uploads. */
  body?: unknown;
  /** Appended as ?a=1&b=2 (undefined / null values are skipped). */
  query?: QueryParams;
  /**
   * Signed-in call: attach the current access token, and on 401 refresh it
   * (once, shared by concurrent calls) and retry. Needs `configureAuth`.
   */
  auth?: boolean;
  /** Explicit bearer token (e.g. logout with the token being ended). */
  token?: string;
  headers?: Record<string, string>;
  /** Cancel from the caller (e.g. screen unmounted). */
  signal?: AbortSignal;
  /** Override ENV.api.timeoutMs for slow calls (uploads). */
  timeoutMs?: number;
};

// ----------------------------------------------------------- auth hooks

type AuthHooks = {
  /** Current valid access token (refreshing if expired), or null. */
  getAccessToken: () => Promise<string | null>;
  /** Force a refresh after a 401; resolves the new token or null. */
  refreshAccessToken: () => Promise<string | null>;
  /** Session is gone (refresh failed): sign the user out. */
  onSessionExpired: () => void;
};

let authHooks: AuthHooks | null = null;

/**
 * Registered once by authService, so the client can sign requests without
 * importing it (avoids an import cycle).
 */
export const configureAuth = (hooks: AuthHooks) => {
  authHooks = hooks;
};

/**
 * One refresh at a time: when several signed-in calls get 401 together,
 * they all wait for the same refresh instead of each spending the
 * (single-use) refresh token.
 */
let refreshing: Promise<string | null> | null = null;
const refreshOnce = () => {
  if (!refreshing && authHooks) {
    refreshing = authHooks.refreshAccessToken().finally(() => {
      refreshing = null;
    });
  }
  return refreshing ?? Promise.resolve(null);
};

// ------------------------------------------------------------- helpers

const buildUrl = (path: string, query?: QueryParams) => {
  const url = `${ENV.api.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  const params = Object.entries(query ?? {})
    .filter(([, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    );
  return params.length ? `${url}?${params.join('&')}` : url;
};

const isFormData = (body: unknown): body is FormData =>
  typeof FormData !== 'undefined' && body instanceof FormData;

const parseBody = (text: string): unknown => {
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

// ---------------------------------------------------------------- core

/** One HTTP round trip: timeout, cancel, parse, log, error mapping. */
const send = async <T>(
  method: HttpMethod,
  path: string,
  {
    body,
    query,
    token,
    headers,
    signal,
    timeoutMs = ENV.api.timeoutMs,
  }: RequestOptions,
): Promise<T> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const onCallerAbort = () => controller.abort();
  signal?.addEventListener('abort', onCallerAbort);
  const started = Date.now();

  const form = isFormData(body);
  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers: {
        [HEADER.ACCEPT]: CONTENT_TYPE.JSON,
        // FormData sets its own multipart boundary header.
        ...(body !== undefined && !form
          ? { [HEADER.CONTENT_TYPE]: CONTENT_TYPE.JSON }
          : {}),
        ...(token ? { [HEADER.AUTHORIZATION]: `Bearer ${token}` } : {}),
        ...headers,
      },
      body:
        body === undefined
          ? undefined
          : form
          ? (body as FormData)
          : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    const aborted = (error as Error)?.name === 'AbortError';
    const reason =
      aborted && signal?.aborted
        ? 'cancelled'
        : aborted
        ? 'timeout'
        : 'network';
    logResponse(method, path, NO_RESPONSE, Date.now() - started, reason);
    throw new ApiError(NO_RESPONSE, reason);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onCallerAbort);
  }

  const parsed = parseBody(await response.text());
  logResponse(method, path, response.status, Date.now() - started, parsed);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      messageFromBody(parsed) ?? `HTTP ${response.status}`,
      parsed,
      response.headers?.get?.(HEADER.REQUEST_ID) ?? undefined,
    );
  }
  return parsed as T;
};

/** Signed-in round trip: token, single shared refresh on 401, one retry. */
const sendAuthed = async <T>(
  method: HttpMethod,
  path: string,
  options: RequestOptions,
): Promise<T> => {
  if (!authHooks) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'not signed in');
  }
  const token = await authHooks.getAccessToken();
  if (!token) {
    authHooks.onSessionExpired();
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'not signed in');
  }
  try {
    return await send<T>(method, path, { ...options, token });
  } catch (error) {
    if (!(error instanceof ApiError) || !error.isUnauthorized) {
      throw error;
    }
    // Token rejected (revoked / clock skew): refresh once and retry.
    const fresh = await refreshOnce();
    if (!fresh) {
      authHooks.onSessionExpired();
      throw error;
    }
    return send<T>(method, path, { ...options, token: fresh });
  }
};

const request = <T>(
  method: HttpMethod,
  path: string,
  options: RequestOptions = {},
): Promise<T> =>
  options.auth
    ? sendAuthed<T>(method, path, options)
    : send<T>(method, path, options);

/**
 * The Admetrics API client. Paths come from ENDPOINTS; bodies are JSON
 * unless FormData. Resolves with the parsed body (null when empty) and
 * throws ApiError on HTTP errors, timeouts and network failures.
 *
 *   http.get<Clinic[]>(ENDPOINTS.clinics.list, { auth: true, query: { take: 20 } })
 *   http.post(ENDPOINTS.auth.login, { body: { email, password } })
 */
export const http = {
  get: <T = unknown>(path: string, options?: Omit<RequestOptions, 'body'>) =>
    request<T>(HTTP_METHOD.GET, path, options),
  post: <T = unknown>(path: string, options?: RequestOptions) =>
    request<T>(HTTP_METHOD.POST, path, options),
  put: <T = unknown>(path: string, options?: RequestOptions) =>
    request<T>(HTTP_METHOD.PUT, path, options),
  patch: <T = unknown>(path: string, options?: RequestOptions) =>
    request<T>(HTTP_METHOD.PATCH, path, options),
  delete: <T = unknown>(path: string, options?: RequestOptions) =>
    request<T>(HTTP_METHOD.DELETE, path, options),
  /** Multipart upload (photos, documents) with a longer timeout. */
  upload: <T = unknown>(
    path: string,
    form: FormData,
    options?: Omit<RequestOptions, 'body'>,
  ) =>
    request<T>(HTTP_METHOD.POST, path, {
      timeoutMs: ENV.api.timeoutMs * 4,
      ...options,
      body: form,
    }),
};

/** @deprecated Use `http.post` / `http.get`. Kept for older call sites. */
export const apiRequest = <T = unknown>(
  path: string,
  {
    method = HTTP_METHOD.POST,
    ...options
  }: RequestOptions & {
    method?: HttpMethod;
  } = {},
) => request<T>(method, path, options);
