import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

import {
  mapGuestUpgradeInput,
  mapGuestUpgradePayload,
} from '../src/modules/auth/data-access/mappers/auth-session.mapper.ts';

const validPayload = {
  access: 'fresh-access',
  refresh: 'fresh-refresh',
  username: 'saved_learner',
  one_time_password: 'Strong-One-Time-Pass-2026!',
  user: {
    id: 17,
    username: 'saved_learner',
    first_name: 'Diyor',
    last_name: 'Karimov',
    name: 'saved_learner',
    is_guest: false,
  },
};

test('maps a guest upgrade response into a real persisted session', () => {
  const result = mapGuestUpgradePayload(validPayload);

  assert.equal(result.username, 'saved_learner');
  assert.equal(result.oneTimePassword, 'Strong-One-Time-Pass-2026!');
  assert.equal(result.session.user.id, 17);
  assert.equal(result.session.user.firstName, 'Diyor');
  assert.equal(result.session.user.lastName, 'Karimov');
  assert.equal(result.session.user.isGuest, false);
  assert.equal(result.session.sessionToken, undefined);
});

test('maps and trims optional profile names for the guest upgrade request', () => {
  assert.deepEqual(
    mapGuestUpgradeInput({
      username: '  Saved_Learner  ',
      firstName: '  Diyor  ',
      lastName: '  Karimov  ',
    }),
    {
      username: 'saved_learner',
      first_name: 'Diyor',
      last_name: 'Karimov',
    }
  );

  assert.deepEqual(mapGuestUpgradeInput({ username: 'learner', firstName: '   ', lastName: '' }), {
    username: 'learner',
    first_name: '',
    last_name: '',
  });
  assert.deepEqual(mapGuestUpgradeInput({ username: 'learner' }), { username: 'learner' });
});

test('rejects upgrade responses that omit the one-time password or remain guest', () => {
  assert.throws(
    () => mapGuestUpgradePayload({ ...validPayload, one_time_password: undefined }),
    /yaroqsiz javob/
  );
  assert.throws(
    () =>
      mapGuestUpgradePayload({
        ...validPayload,
        user: { ...validPayload.user, is_guest: true },
      }),
    /yaroqsiz javob/
  );
});

class MemoryStorage {
  values = new Map();

  getItem(key) {
    return this.values.get(key) ?? null;
  }

  setItem(key, value) {
    this.values.set(key, String(value));
  }

  removeItem(key) {
    this.values.delete(key);
  }

  clear() {
    this.values.clear();
  }
}

const authSession = (id = 17, guest = true) => ({
  access: `access-${id}`,
  refresh: `refresh-${id}`,
  ...(guest ? { sessionToken: `guest-token-${id}` } : {}),
  user: {
    id,
    username: guest ? `guest_${id}` : `learner_${id}`,
    isGuest: guest,
  },
});

const guestResponse = (id, sessionToken = `guest-token-${id}`, created = true) => ({
  access: `access-${id}`,
  refresh: `refresh-${id}`,
  session_token: sessionToken,
  created,
  user: { id, username: `guest_${id}`, is_guest: true },
});

test('lazy auth session orchestration', async (suite) => {
  const originalFetch = globalThis.fetch;
  const originalLocalStorage = globalThis.localStorage;
  const originalWindow = globalThis.window;
  const storage = new MemoryStorage();
  const browserWindow = new EventTarget();
  globalThis.localStorage = storage;
  globalThis.window = browserWindow;

  let fetchCalls = [];
  globalThis.fetch = async (input, init = {}) => {
    fetchCalls.push({ input: String(input), init });
    return new Response(JSON.stringify(guestResponse(1)), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  const server = await createServer({
    root: process.cwd(),
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });

  try {
    const auth = await server.ssrLoadModule(
      '/src/modules/auth/application/auth-session.ts?lazy-auth-tests'
    );

    await suite.test('does not create a guest merely by loading the auth module', () => {
      assert.equal(fetchCalls.length, 0);
      assert.equal(storage.getItem('cpuz:auth-session'), null);
    });

    await suite.test('returns an existing real or guest session without a request', async () => {
      auth.logoutAuthSession();
      storage.clear();
      const existing = authSession(22, false);
      storage.setItem('cpuz:auth-session', JSON.stringify(existing));
      fetchCalls = [];

      assert.deepEqual(await auth.ensureAuthSession(), existing);
      assert.equal(fetchCalls.length, 0);
    });

    await suite.test('deduplicates simultaneous guest creation callers', async () => {
      auth.logoutAuthSession();
      storage.clear();
      fetchCalls = [];
      let releaseResponse;
      globalThis.fetch = (input, init = {}) => {
        fetchCalls.push({ input: String(input), init });
        return new Promise((resolve) => {
          releaseResponse = () =>
            resolve(
              new Response(JSON.stringify(guestResponse(31)), {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
              })
            );
        });
      };

      const first = auth.ensureAuthSession();
      const second = auth.ensureGuestSession();
      assert.equal(first, second);
      await new Promise((resolve) => setImmediate(resolve));
      assert.equal(fetchCalls.length, 1);
      releaseResponse();
      assert.deepEqual(await first, await second);
      assert.equal(fetchCalls.length, 1);
    });

    await suite.test('resumes a saved guest credential before creating anything', async () => {
      auth.logoutAuthSession();
      storage.clear();
      storage.setItem('cpuz:guest-session-token', 'saved-token');
      fetchCalls = [];
      globalThis.fetch = async (input, init = {}) => {
        fetchCalls.push({ input: String(input), init });
        return new Response(JSON.stringify(guestResponse(41, 'saved-token', false)), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      };

      const session = await auth.ensureAuthSession();
      assert.equal(session.user.id, 41);
      assert.equal(fetchCalls.length, 1);
      assert.deepEqual(JSON.parse(fetchCalls[0].init.body), { session_token: 'saved-token' });
    });

    await suite.test('replaces only a definitively invalid saved guest credential', async () => {
      auth.logoutAuthSession();
      storage.clear();
      storage.setItem('cpuz:guest-session-token', 'invalid-token');
      fetchCalls = [];
      globalThis.fetch = async (input, init = {}) => {
        fetchCalls.push({ input: String(input), init });
        if (fetchCalls.length === 1) {
          return new Response(JSON.stringify({ detail: 'Guest sessiya tokeni yaroqsiz.' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        return new Response(JSON.stringify(guestResponse(51, 'replacement-token')), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
      };

      const session = await auth.ensureAuthSession();
      assert.equal(session.user.id, 51);
      assert.equal(fetchCalls.length, 2);
      assert.deepEqual(JSON.parse(fetchCalls[1].init.body), {});
      assert.equal(storage.getItem('cpuz:guest-session-token'), 'replacement-token');
    });

    await suite.test('does not create a second identity after a network failure', async () => {
      auth.logoutAuthSession();
      storage.clear();
      storage.setItem('cpuz:guest-session-token', 'still-usable-token');
      fetchCalls = [];
      globalThis.fetch = async (input, init = {}) => {
        fetchCalls.push({ input: String(input), init });
        throw new TypeError('network unavailable');
      };

      await assert.rejects(auth.ensureAuthSession(), /network unavailable/);
      assert.equal(fetchCalls.length, 1);
      assert.equal(storage.getItem('cpuz:guest-session-token'), 'still-usable-token');
    });

    await suite.test('notifies subscribers on persistence and logout', async () => {
      auth.logoutAuthSession();
      storage.clear();
      fetchCalls = [];
      globalThis.fetch = async (input, init = {}) => {
        fetchCalls.push({ input: String(input), init });
        return new Response(JSON.stringify(guestResponse(61)), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
      };
      const updates = [];
      const unsubscribe = auth.subscribeAuthSession((session) => updates.push(session));

      await auth.ensureAuthSession();
      auth.logoutAuthSession();
      unsubscribe();

      assert.equal(updates.length, 2);
      assert.equal(updates[0].user.id, 61);
      assert.equal(updates[1], null);
      assert.equal(storage.getItem('cpuz:guest-session-token'), 'guest-token-61');
    });

    await suite.test('publishes auth changes received from another browser tab', () => {
      auth.logoutAuthSession();
      storage.clear();
      const updates = [];
      const unsubscribe = auth.subscribeAuthSession((session) => updates.push(session));
      const remoteSession = authSession(65, false);
      storage.setItem('cpuz:auth-session', JSON.stringify(remoteSession));
      const storageEvent = new Event('storage');
      Object.defineProperty(storageEvent, 'key', { value: 'cpuz:auth-session' });

      browserWindow.dispatchEvent(storageEvent);
      unsubscribe();

      assert.deepEqual(updates, [remoteSession]);
    });

    await suite.test(
      'hard-deletes the account then clears session and guest credential',
      async () => {
        auth.logoutAuthSession();
        storage.clear();
        storage.setItem('cpuz:auth-session', JSON.stringify(authSession(71)));
        storage.setItem('cpuz:guest-session-token', 'guest-token-71');
        fetchCalls = [];
        globalThis.fetch = async (input, init = {}) => {
          fetchCalls.push({ input: String(input), init });
          return new Response(null, { status: 204 });
        };
        const updates = [];
        const unsubscribe = auth.subscribeAuthSession((session) => updates.push(session));

        await auth.authApi.deleteAccount({ confirmation: 'O‘CHIRISH' });
        unsubscribe();

        assert.equal(fetchCalls.length, 1);
        assert.match(fetchCalls[0].input, /\/api\/v1\/auth\/account\/$/);
        assert.equal(fetchCalls[0].init.method, 'DELETE');
        assert.match(new Headers(fetchCalls[0].init.headers).get('Authorization'), /^Bearer /);
        assert.deepEqual(JSON.parse(fetchCalls[0].init.body), { confirmation: 'O‘CHIRISH' });
        assert.equal(storage.getItem('cpuz:auth-session'), null);
        assert.equal(storage.getItem('cpuz:guest-session-token'), null);
        assert.deepEqual(updates, [null]);
      }
    );

    await suite.test('keeps local credentials when hard-delete fails', async () => {
      auth.logoutAuthSession();
      storage.clear();
      storage.setItem('cpuz:auth-session', JSON.stringify(authSession(81, false)));
      storage.setItem('cpuz:guest-session-token', 'preserved-token');
      fetchCalls = [];
      globalThis.fetch = async (input, init = {}) => {
        fetchCalls.push({ input: String(input), init });
        return new Response(JSON.stringify({ detail: 'Deletion rejected.' }), {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        });
      };

      await assert.rejects(
        auth.authApi.deleteAccount({ confirmation: 'O‘CHIRISH', password: 'current-secret' }),
        /Deletion rejected/
      );
      assert.deepEqual(JSON.parse(fetchCalls[0].init.body), {
        confirmation: 'O‘CHIRISH',
        password: 'current-secret',
      });
      assert.notEqual(storage.getItem('cpuz:auth-session'), null);
      assert.equal(storage.getItem('cpuz:guest-session-token'), 'preserved-token');
    });
  } finally {
    await server.close();
    globalThis.fetch = originalFetch;
    if (originalLocalStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = originalLocalStorage;
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
  }
});
