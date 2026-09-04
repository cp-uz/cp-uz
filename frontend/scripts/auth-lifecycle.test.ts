import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  authenticatedRequest,
  authRepository,
} from '../src/modules/auth/data-access/repository/auth.repository.impl';
import { createRequestCache, InvalidApiResponseError, requestJson } from '../src/shared/api/http';

const response = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status });
const account = (id: number) => ({
  access: `expired-${id}`,
  refresh: `refresh-${id}`,
  sessionKey: `session-${id}`,
  user: { id, username: `user-${id}`, isGuest: false },
});
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
function seed(id = 1) {
  authRepository.clearSession();
  localStorage.setItem('cpuz:auth-session', JSON.stringify(account(id)));
  authRepository.getSession();
}

beforeEach(() => {
  localStorage.clear();
  seed();
});
afterEach(() => {
  authRepository.clearSession();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('authentication request ownership', () => {
  it('shares one token rotation across distinct parallel 401 responses', async () => {
    const refresh = deferred<Response>();
    const fetch = vi.fn(async (url: string, init: RequestInit) => {
      if (url.includes('/token/refresh/')) return refresh.promise;
      return new Headers(init.headers).get('Authorization') === 'Bearer expired-1'
        ? response({}, 401)
        : response({ saved: true });
    });
    vi.stubGlobal('fetch', fetch);
    const first = authenticatedRequest('/bookmarks');
    const second = authenticatedRequest('/progress');
    await vi.waitFor(() =>
      expect(fetch.mock.calls.filter(([url]) => url.includes('/token/refresh/'))).toHaveLength(1)
    );
    refresh.resolve(response({ access: 'fresh', refresh: 'rotated' }));
    await expect(Promise.all([first, second])).resolves.toEqual([{ saved: true }, { saved: true }]);
    expect(fetch.mock.calls.filter(([url]) => url.includes('/token/refresh/'))).toHaveLength(1);
  });

  it.each(['logout', 'switch'] as const)(
    'discards a refresh completing after %s even when fetch ignores abort',
    async (action) => {
      const refresh = deferred<Response>();
      const fetch = vi.fn(async (url: string) =>
        url.includes('/token/refresh/') ? refresh.promise : response({}, 401)
      );
      vi.stubGlobal('fetch', fetch);
      const pending = authenticatedRequest('/private');
      const rejected = expect(pending).rejects.toThrow('Sessiya o‘zgardi');
      await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
      if (action === 'logout') authRepository.clearSession();
      else seed(2);
      refresh.resolve(response({ access: 'old-user-fresh', refresh: 'old-rotated' }));
      await rejected;
      expect(authRepository.getSession()?.user.id ?? null).toBe(action === 'logout' ? null : 2);
      expect(fetch).toHaveBeenCalledTimes(2);
    }
  );

  it.each([200, 401])(
    'keeps newer tokens from another tab when an older refresh completes with %s',
    async (status) => {
      const refresh = deferred<Response>();
      const fetch = vi.fn(async (url: string, init: RequestInit) => {
        if (url.includes('/token/refresh/')) return refresh.promise;
        return new Headers(init.headers).get('Authorization') === 'Bearer other-tab-access'
          ? response({ saved: true })
          : response({}, 401);
      });
      vi.stubGlobal('fetch', fetch);
      const pending = authenticatedRequest('/cross-tab-refresh');
      await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
      localStorage.setItem(
        'cpuz:auth-session',
        JSON.stringify({
          ...account(1),
          access: 'other-tab-access',
          refresh: 'other-tab-refresh',
        })
      );
      window.dispatchEvent(new StorageEvent('storage', { key: 'cpuz:auth-session' }));
      refresh.resolve(response({ access: 'older-access', refresh: 'older-refresh' }, status));
      await expect(pending).resolves.toEqual({ saved: true });
      expect(authRepository.getSession()).toMatchObject({
        access: 'other-tab-access',
        refresh: 'other-tab-refresh',
      });
    }
  );

  it('does not return another identity’s late private response', async () => {
    const network = deferred<Response>();
    vi.stubGlobal(
      'fetch',
      vi.fn(() => network.promise)
    );
    const pending = authenticatedRequest('/notes');
    const rejected = expect(pending).rejects.toThrow('Sessiya o‘zgardi');
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledOnce());
    seed(2);
    network.resolve(response({ private: 'user one note' }));
    await rejected;
  });

  it('rejects an outbox write created for a different user before sending', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    await expect(
      authenticatedRequest('/notes', { method: 'POST', body: '{}' }, { expectedUserId: 2 })
    ).rejects.toThrow('Sessiya o‘zgardi');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('invalidates GETs loaded during a pending mutation after the write finishes', async () => {
    let value = 'before';
    const write = deferred<Response>();
    const fetch = vi.fn(async (_url: string, init: RequestInit) =>
      init.method === 'POST' ? write.promise : response({ value })
    );
    vi.stubGlobal('fetch', fetch);
    const mutation = authenticatedRequest('/item', { method: 'POST', body: '{}' });
    await expect(authenticatedRequest('/item')).resolves.toEqual({ value: 'before' });
    value = 'after';
    write.resolve(response({ ok: true }));
    await mutation;
    await expect(authenticatedRequest('/item')).resolves.toEqual({ value: 'after' });
  });

  it('cancels a delayed guest creation after logout', async () => {
    authRepository.clearSession();
    const network = deferred<Response>();
    vi.stubGlobal(
      'fetch',
      vi.fn(() => network.promise)
    );
    const pending = authRepository.ensureSession();
    const rejected = expect(pending).rejects.toThrow('Sessiya o‘zgardi');
    authRepository.clearSession();
    network.resolve(
      response({ ...account(3), user: { id: 3, username: 'guest3', is_guest: true } })
    );
    await rejected;
    expect(authRepository.getSession()).toBeNull();
  });

  it('invalidates pending data after logout in another tab', async () => {
    const network = deferred<Response>();
    vi.stubGlobal(
      'fetch',
      vi.fn(() => network.promise)
    );
    const pending = authenticatedRequest('/notes');
    const rejected = expect(pending).rejects.toThrow('Sessiya o‘zgardi');
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledOnce());
    localStorage.removeItem('cpuz:auth-session');
    window.dispatchEvent(new StorageEvent('storage', { key: 'cpuz:auth-session' }));
    network.resolve(response({ private: true }));
    await rejected;
    expect(authRepository.getSession()).toBeNull();
  });
});

describe('shared request cache and transport', () => {
  it('does not let invalidated in-flight requests poison a new cached value', async () => {
    const cache = createRequestCache();
    const old = deferred<string>();
    const first = cache.get('item', () => old.promise, 1000);
    cache.invalidate();
    await expect(cache.get('item', async () => 'new', 1000)).resolves.toBe('new');
    old.resolve('old');
    await first;
    await expect(cache.get('item', async () => 'unexpected', 1000)).resolves.toBe('new');
  });

  it('rejects a successful response with invalid JSON instead of returning empty data', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('<html>proxy</html>'))
    );
    await expect(requestJson('/data')).rejects.toBeInstanceOf(InvalidApiResponseError);
  });
});
