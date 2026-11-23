import { configureAuth, http } from '../src/api/client';
import { ApiError } from '../src/api/errors';

type FakeResponse = { status: number; body?: unknown };

/** fetch mock answering each call with the next response. */
const fetchSequence = (...responses: FakeResponse[]) => {
  const queue = [...responses];
  const mock = jest.fn().mockImplementation(() => {
    const next = queue.shift() ?? { status: 200 };
    return Promise.resolve({
      ok: next.status >= 200 && next.status < 300,
      status: next.status,
      headers: { get: () => null },
      text: () =>
        Promise.resolve(
          next.body === undefined ? '' : JSON.stringify(next.body),
        ),
    });
  });
  globalThis.fetch = mock as unknown as typeof fetch;
  return mock;
};

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

test('builds the URL with query params and skips empty ones', async () => {
  const mock = fetchSequence({ status: 200, body: [] });
  await http.get('/clinics', { query: { take: 20, skip: 0, q: undefined } });
  expect(mock.mock.calls[0][0]).toMatch(/\/clinics\?take=20&skip=0$/);
  expect(mock.mock.calls[0][1].method).toBe('GET');
});

test('parses the Admetrics validation error body', async () => {
  fetchSequence({
    status: 400,
    body: {
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Check the request fields.',
        fields: [{ path: 'password', message: 'Too short' }],
      },
      requestId: 'req-1',
    },
  });
  const error = (await http
    .post('/auth/register', { body: {} })
    .catch((e: unknown) => e)) as ApiError;
  expect(error).toBeInstanceOf(ApiError);
  expect(error.code).toBe('VALIDATION_ERROR');
  expect(error.fields).toEqual({ password: 'Too short' });
  expect(error.message).toBe('Too short');
  expect(error.requestId).toBe('req-1');
  expect(error.isValidation).toBe(true);
});

test('sends FormData as-is without a JSON content type', async () => {
  const mock = fetchSequence({ status: 201, body: { id: 'p1' } });
  const form = new FormData();
  form.append('caption', 'entrance');
  await http.upload('/clinics/1/photos', form);
  const init = mock.mock.calls[0][1];
  expect(init.body).toBe(form);
  expect(init.headers['Content-Type']).toBeUndefined();
});

test('signed-in calls refresh once on 401 and retry', async () => {
  const refresh = jest.fn().mockResolvedValue('fresh-token');
  const expired = jest.fn();
  configureAuth({
    getAccessToken: () => Promise.resolve('old-token'),
    refreshAccessToken: refresh,
    onSessionExpired: expired,
  });
  // Two parallel calls both get 401, then succeed after one refresh.
  const mock = fetchSequence(
    { status: 401 },
    { status: 401 },
    { status: 200, body: { ok: 1 } },
    { status: 200, body: { ok: 2 } },
  );

  await Promise.all([
    http.get('/me', { auth: true }),
    http.get('/me', { auth: true }),
  ]);

  expect(refresh).toHaveBeenCalledTimes(1);
  expect(expired).not.toHaveBeenCalled();
  expect(mock.mock.calls[2][1].headers.Authorization).toBe(
    'Bearer fresh-token',
  );
});

test('a failed refresh ends the session', async () => {
  const expired = jest.fn();
  configureAuth({
    getAccessToken: () => Promise.resolve('old-token'),
    refreshAccessToken: () => Promise.resolve(null),
    onSessionExpired: expired,
  });
  fetchSequence({ status: 401 });
  await expect(http.get('/me', { auth: true })).rejects.toMatchObject({
    status: 401,
  });
  expect(expired).toHaveBeenCalled();
});

test('no response becomes a network ApiError', async () => {
  globalThis.fetch = jest
    .fn()
    .mockRejectedValue(new TypeError('Network request failed'));
  const error = (await http.get('/x').catch((e: unknown) => e)) as ApiError;
  expect(error.isNetwork).toBe(true);
});
