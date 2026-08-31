import type { AuthSession, AuthRepository } from '../../domain';

import { apiUrl } from 'shared/api/http';

import {
  record,
  type AuthPayload,
  mapGuestUpgradeInput,
  mapGuestUpgradePayload,
  mapAuthPayloadToSession,
  type GuestUpgradePayload,
} from '../mappers';

const AUTH_STORAGE_KEY = 'cpuz:auth-session';
const GUEST_TOKEN_KEY = 'cpuz:guest-session-token';
const AUTH_SESSION_CHANGE_EVENT = 'cpuz:auth-session-change';
const AUTH_GET_CACHE_TTL_MS = 15_000;
const authenticatedGetCache = new Map<string, { expiresAt: number; value: unknown }>();
const authenticatedGetInFlight = new Map<string, Promise<unknown>>();
let authenticatedDataRevision = 0;
let volatileSession: AuthSession | null = null;
let cachedSessionRaw: string | null | undefined;
let cachedSession: AuthSession | null = null;

function clearAuthenticatedRequestCache() {
  authenticatedDataRevision += 1;
  authenticatedGetCache.clear();
  authenticatedGetInFlight.clear();
}

function storageGet(key: string) {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key: string, value: string) {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
  } catch {
    // The in-memory session keeps authentication usable when storage is unavailable.
  }
}

function storageRemove(key: string) {
  try {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
  } catch {
    // Storage can be blocked by browser privacy settings.
  }
}

function isAuthSession(value: unknown): value is AuthSession {
  const session = record(value);
  const user = record(session.user);
  return (
    typeof session.access === 'string' &&
    session.access.length > 0 &&
    typeof session.refresh === 'string' &&
    session.refresh.length > 0 &&
    (typeof user.id === 'string' || typeof user.id === 'number') &&
    typeof user.username === 'string' &&
    user.username.length > 0 &&
    typeof user.isGuest === 'boolean'
  );
}

function notifySessionChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_SESSION_CHANGE_EVENT));
  }
}

function persistSession(session: AuthSession) {
  const serialized = JSON.stringify(session);
  volatileSession = session;
  cachedSessionRaw = serialized;
  cachedSession = session;
  storageSet(AUTH_STORAGE_KEY, serialized);
  if (session.sessionToken) storageSet(GUEST_TOKEN_KEY, session.sessionToken);
  clearAuthenticatedRequestCache();
  notifySessionChanged();
}

function clearPersistedSession(clearGuestCredential = false) {
  storageRemove(AUTH_STORAGE_KEY);
  if (clearGuestCredential) storageRemove(GUEST_TOKEN_KEY);
  volatileSession = null;
  cachedSessionRaw = null;
  cachedSession = null;
  clearAuthenticatedRequestCache();
  notifySessionChanged();
}

function findErrorMessage(payload: unknown): string | undefined {
  if (typeof payload === 'string') return payload;
  if (Array.isArray(payload)) {
    for (const value of payload) {
      const message = findErrorMessage(value);
      if (message) return message;
    }
    return undefined;
  }

  const data = record(payload);
  if (typeof data.detail === 'string') return data.detail;
  if (data.detail) {
    const detail = findErrorMessage(data.detail);
    if (detail) return detail;
  }
  for (const value of Object.values(data)) {
    const message = findErrorMessage(value);
    if (message) return message;
  }
  return undefined;
}

function errorMessage(payload: unknown, fallback: string) {
  return findErrorMessage(payload) ?? fallback;
}

function getSession(): AuthSession | null {
  const value = storageGet(AUTH_STORAGE_KEY);
  if (value === null && volatileSession) return volatileSession;
  if (value === cachedSessionRaw) return cachedSession;

  try {
    const parsed: unknown = value ? JSON.parse(value) : null;
    if (parsed !== null && !isAuthSession(parsed)) throw new Error('Invalid stored session');
    cachedSessionRaw = value;
    cachedSession = parsed;
    volatileSession = parsed;
    return parsed;
  } catch {
    storageRemove(AUTH_STORAGE_KEY);
    cachedSessionRaw = null;
    cachedSession = null;
    volatileSession = null;
    return null;
  }
}

class AuthRequestError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = 'AuthRequestError';
  }
}

async function post(path: string, body: Record<string, unknown>) {
  const response = await fetch(apiUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  const payload = (await response.json().catch(() => ({}))) as AuthPayload;
  if (!response.ok) {
    throw new AuthRequestError(
      errorMessage(payload, 'Kirish amalga oshmadi. Qayta urinib ko‘ring.'),
      response.status
    );
  }
  return payload;
}

function isUnusableSavedGuestError(reason: unknown) {
  return reason instanceof AuthRequestError && [400, 401, 403, 404].includes(reason.status);
}

async function requestGuestSession(savedToken?: string) {
  return mapAuthPayloadToSession(
    await post('/api/v1/auth/guest/', savedToken ? { session_token: savedToken } : {})
  );
}

function persistGuestUnlessSessionWasEstablished(session: AuthSession) {
  const establishedSession = getSession();
  if (establishedSession) return establishedSession;
  persistSession(session);
  return session;
}

async function refreshSession(session: AuthSession) {
  const response = await fetch(apiUrl('/api/v1/auth/token/refresh/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ refresh: session.refresh }),
  });
  const payload = record(await response.json().catch(() => ({})));
  const access = typeof payload.access === 'string' ? payload.access : '';
  if (!response.ok || !access) {
    throw new Error(errorMessage(payload, 'Sessiya muddati tugagan. Qayta kiring.'));
  }
  const refreshed = {
    ...session,
    access,
    refresh: typeof payload.refresh === 'string' ? payload.refresh : session.refresh,
  };
  persistSession(refreshed);
  return refreshed;
}

async function performAuthenticatedRequest<T>(
  path: string,
  init: RequestInit = {},
  retry = true
): Promise<T> {
  const session = getSession();
  if (!session) throw new Error('Bu amal uchun avval kirish kerak.');
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  headers.set('Authorization', `Bearer ${session.access}`);
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  const response = await fetch(apiUrl(path), { ...init, headers });
  if (response.status === 401 && retry) {
    const refreshed = await refreshSession(session);
    headers.set('Authorization', `Bearer ${refreshed.access}`);
    return performAuthenticatedRequest<T>(path, { ...init, headers }, false);
  }
  const payload = response.status === 204 ? undefined : await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(errorMessage(payload, 'Ma’lumotni saqlab bo‘lmadi.'));
  }
  return payload as T;
}

export function authenticatedRequest<T>(
  path: string,
  init: RequestInit = {},
  retry = true
): Promise<T> {
  const session = getSession();
  if (!session) return Promise.reject(new Error('Bu amal uchun avval kirish kerak.'));

  const method = (init.method ?? 'GET').toUpperCase();
  if (method !== 'GET') {
    clearAuthenticatedRequestCache();
    return performAuthenticatedRequest<T>(path, init, retry);
  }

  const key = `${String(session.user.id)}:${authenticatedDataRevision}:${path}`;
  const cached = authenticatedGetCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return Promise.resolve(cached.value as T);
  if (cached) authenticatedGetCache.delete(key);

  const pending = authenticatedGetInFlight.get(key);
  if (pending) return pending as Promise<T>;

  const request = performAuthenticatedRequest<T>(path, init, retry)
    .then((value) => {
      authenticatedGetCache.set(key, {
        value,
        expiresAt: Date.now() + AUTH_GET_CACHE_TTL_MS,
      });
      return value;
    })
    .finally(() => authenticatedGetInFlight.delete(key));

  authenticatedGetInFlight.set(key, request);
  return request;
}

export const authRepository: AuthRepository = {
  async login(username, password) {
    const session = mapAuthPayloadToSession(
      await post('/api/v1/auth/login/', { username, password })
    );
    persistSession(session);
    return session;
  },
  async continueAsGuest() {
    const savedToken = storageGet(GUEST_TOKEN_KEY) ?? undefined;
    const session = await requestGuestSession(savedToken);
    persistSession(session);
    return session;
  },
  async startNewGuest() {
    const session = await requestGuestSession();
    persistSession(session);
    return session;
  },
  async ensureSession() {
    const existingSession = getSession();
    if (existingSession) return existingSession;

    const savedToken = storageGet(GUEST_TOKEN_KEY) ?? undefined;
    if (savedToken) {
      try {
        const resumedSession = await requestGuestSession(savedToken);
        return persistGuestUnlessSessionWasEstablished(resumedSession);
      } catch (reason) {
        const sessionEstablishedWhileResuming = getSession();
        if (sessionEstablishedWhileResuming) return sessionEstablishedWhileResuming;
        if (!isUnusableSavedGuestError(reason)) throw reason;
        storageRemove(GUEST_TOKEN_KEY);
      }
    }

    const sessionEstablishedBeforeCreation = getSession();
    if (sessionEstablishedBeforeCreation) return sessionEstablishedBeforeCreation;
    const createdSession = await requestGuestSession();
    return persistGuestUnlessSessionWasEstablished(createdSession);
  },
  async upgradeGuest(input) {
    const result = mapGuestUpgradePayload(
      await performAuthenticatedRequest<GuestUpgradePayload>('/api/v1/auth/guest/upgrade/', {
        method: 'POST',
        body: JSON.stringify(mapGuestUpgradeInput(input)),
      })
    );
    storageRemove(GUEST_TOKEN_KEY);
    persistSession(result.session);
    return result;
  },
  async deleteAccount(input) {
    await performAuthenticatedRequest<void>('/api/v1/auth/account/', {
      method: 'DELETE',
      body: JSON.stringify({
        confirmation: input.confirmation,
        ...(input.password ? { password: input.password } : {}),
      }),
    });
    clearPersistedSession(true);
  },
  getSession,
  clearSession: () => clearPersistedSession(),
  hasSavedGuestSession: () => Boolean(storageGet(GUEST_TOKEN_KEY)),
  subscribeSession: (listener) => {
    if (typeof window === 'undefined') return () => undefined;

    const onSessionChange = () => listener(getSession());
    const onStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== AUTH_STORAGE_KEY) return;
      volatileSession = null;
      cachedSessionRaw = undefined;
      cachedSession = null;
      listener(getSession());
    };

    window.addEventListener(AUTH_SESSION_CHANGE_EVENT, onSessionChange);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(AUTH_SESSION_CHANGE_EVENT, onSessionChange);
      window.removeEventListener('storage', onStorage);
    };
  },
};
