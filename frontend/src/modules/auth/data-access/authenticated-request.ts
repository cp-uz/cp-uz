import type { AuthSession } from '../domain';

import {
  ApiError,
  requestJson,
  createRequestCache,
  InvalidApiResponseError,
} from 'shared/api/http';

import {
  clearSession,
  persistSession,
  sessionRevision,
  withSessionSignal,
  onSessionInvalidated,
  assertSessionRevision,
} from './session-store';

export type AuthenticatedRequestOptions = { expectedUserId?: number | string };
const cache = createRequestCache();
let refreshInFlight: { revision: number; promise: Promise<AuthSession> } | undefined;
onSessionInvalidated(() => {
  cache.invalidate();
  refreshInFlight = undefined;
});

function refreshSession(original: AuthSession, expected: number): Promise<AuthSession> {
  const current = assertSessionRevision(expected, original.user.id);
  if (current && current.access !== original.access) return Promise.resolve(current);
  if (refreshInFlight?.revision === expected) return refreshInFlight.promise;

  const promise = withSessionSignal(expected, (signal) =>
    requestJson<{ access: string; refresh?: string }>('/api/v1/auth/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: original.refresh }),
      signal,
    })
  )
    .then((payload) => {
      const latest = assertSessionRevision(expected, original.user.id);
      // Another tab can rotate the same session without changing its identity revision.
      if (latest && latest.access !== original.access) return latest;
      if (
        !payload ||
        typeof payload.access !== 'string' ||
        !payload.access ||
        (payload.refresh !== undefined && (typeof payload.refresh !== 'string' || !payload.refresh))
      )
        throw new InvalidApiResponseError();
      const refreshed = {
        ...original,
        access: payload.access,
        refresh: payload.refresh ?? original.refresh,
      };
      persistSession(refreshed, true);
      return refreshed;
    })
    .catch((error: unknown) => {
      if (
        error instanceof ApiError &&
        [400, 401, 403].includes(error.status) &&
        sessionRevision() === expected
      ) {
        const latest = assertSessionRevision(expected, original.user.id);
        if (latest && latest.access !== original.access) return latest;
        clearSession();
      }
      throw error;
    })
    .finally(() => {
      if (refreshInFlight?.promise === promise) refreshInFlight = undefined;
    });
  refreshInFlight = { revision: expected, promise };
  return promise;
}

async function perform<T>(
  path: string,
  init: RequestInit,
  expected: number,
  owner: number | string
) {
  const session = assertSessionRevision(expected, owner);
  if (!session) throw new Error('Bu amal uchun avval kirish kerak.');
  const send = (access: string) =>
    withSessionSignal(
      expected,
      (signal) => {
        const headers = new Headers(init.headers);
        headers.set('Authorization', `Bearer ${access}`);
        return requestJson<T>(path, { ...init, headers, signal });
      },
      init.signal
    );
  try {
    return await send(session.access);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) throw error;
    const refreshed = await refreshSession(session, expected);
    assertSessionRevision(expected, owner);
    return send(refreshed.access);
  }
}

export function authenticatedRequest<T>(
  path: string,
  init: RequestInit = {},
  options: AuthenticatedRequestOptions = {}
): Promise<T> {
  const expected = sessionRevision();
  let session;
  try {
    session = assertSessionRevision(expected, options.expectedUserId);
  } catch (error) {
    return Promise.reject(error);
  }
  if (!session) return Promise.reject(new Error('Bu amal uchun avval kirish kerak.'));
  const owner = session.user.id;
  const load = () => perform<T>(path, init, expected, owner);
  if ((init.method ?? 'GET').toUpperCase() !== 'GET') {
    cache.invalidate();
    return load().finally(() => cache.invalidate());
  }
  if (init.signal || init.headers) return load();
  return cache.get(`${expected}:${String(owner)}:${path}`, load, 15_000);
}
