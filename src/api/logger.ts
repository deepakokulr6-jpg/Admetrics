/**
 * Development request log. Never prints secrets: tokens, passwords, codes,
 * keys and links are replaced by their length. Off in release builds.
 */

const SECRET_KEY = /token|secret|password|otp|code|key|otpauth|uri|url/i;

export const redact = (value: unknown): unknown => {
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

export const logResponse = (
  method: string,
  path: string,
  status: number,
  durationMs: number,
  body: unknown,
) => {
  if (!__DEV__) {
    return;
  }
  console.log(
    `[api] ${method} ${path} → ${status || 'no response'} (${durationMs} ms)`,
    body === undefined ? '' : JSON.stringify(redact(body)),
  );
};
