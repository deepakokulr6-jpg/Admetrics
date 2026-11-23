import { ENV } from '../config/env';

/** A failed API call: HTTP status (0 = network / timeout) and a message. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type Options = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** Bearer access token, for calls made with a specific token. */
  token?: string;
  /**
   * Signed-in call: attach the current access token automatically and, on
   * 401, refresh it once and retry. Needs `configureAuth` (authService).
   */
  auth?: boolean;
};

// ------------------------------------------------- signed-in token hooks

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
 * Called once by authService, so the client can sign requests without
 * importing it (avoids an import cycle).
 */
export const configureAuth = (hooks: AuthHooks) => {
  authHooks = hooks;
};

/** Keys whose values never go to the console (tokens, codes, secrets). */
const SECRET_KEY = /token|secret|password|otp|code|otpauth|uri|url/i;

/** Response shape for dev logs, with sensitive values masked. */
const redact = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(redact);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        SECRET_KEY.test(key) && typeof item === 'string'
          ? `<${item.length} chars>`
          : redact(item),
      ]),
    );
  }
  return value;
};

/**
 * Server message if the body has one. Admetrics sends
 * `{error: {code, message, fields: [{path, message}]}}`; a field message is
 * the most specific, so it wins.
 */
const messageFrom = (body: unknown): string | undefined => {
  if (!body || typeof body !== 'object') {
    return undefined;
  }
  const record = body as Record<string, unknown>;
  const nested = record.error;
  if (nested && typeof nested === 'object') {
    const error = nested as Record<string, unknown>;
    const fields = Array.isArray(error.fields) ? error.fields : [];
    const field = fields[0] as { message?: unknown } | undefined;
    if (typeof field?.message === 'string') {
      return field.message;
    }
    if (typeof error.message === 'string') {
      return error.message;
    }
  }
  const candidate = record.message ?? record.error ?? record.detail;
  if (typeof candidate === 'string') {
    return candidate;
  }
  if (Array.isArray(candidate) && typeof candidate[0] === 'string') {
    return candidate[0];
  }
  return undefined;
};

/**
 * JSON request to the Admetrics API (`auth: true` for signed-in calls).
 * Resolves with the parsed body (or null
 * for an empty one); throws ApiError on HTTP errors, timeouts and network
 * failures. In development the redacted response is logged so its shape can
 * be checked against the screens.
 */
export const apiRequest = async <T = unknown>(
  path: string,
  options: Options = {},
): Promise<T> => {
  if (!options.auth) {
    return send<T>(path, options);
  }
  if (!authHooks) {
    throw new ApiError(401, 'not signed in');
  }
  const token = await authHooks.getAccessToken();
  if (!token) {
    authHooks.onSessionExpired();
    throw new ApiError(401, 'not signed in');
  }
  try {
    return await send<T>(path, { ...options, token });
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) {
      throw error;
    }
    // Token rejected (revoked / clock skew): refresh once and retry.
    const fresh = await authHooks.refreshAccessToken();
    if (!fresh) {
      authHooks.onSessionExpired();
      throw error;
    }
    return send<T>(path, { ...options, token: fresh });
  }
};

/** One HTTP round trip (no auth handling). */
const send = async <T>(
  path: string,
  { method = 'POST', body, token }: Options,
): Promise<T> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ENV.api.timeoutMs);

  let response: Response;
  try {
    response = await fetch(`${ENV.api.baseUrl}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (error) {
    const timedOut = (error as Error)?.name === 'AbortError';
    throw new ApiError(0, timedOut ? 'timeout' : 'network');
  } finally {
    clearTimeout(timer);
  }

  const text = await response.text();
  let parsed: unknown = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }

  if (__DEV__) {
    console.log(
      `[api] ${method} ${path} → ${response.status}`,
      JSON.stringify(redact(parsed)),
    );
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      messageFrom(parsed) ?? `HTTP ${response.status}`,
      parsed,
    );
  }
  return parsed as T;
};
