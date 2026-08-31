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
const AUTH_GET_CACHE_TTL_MS = 15_000;
const authenticatedGetCache = new Map<string, { expiresAt: number; value: unknown }>();
const authenticatedGetInFlight = new Map<string, Promise<unknown>>();
let authenticatedDataRevision = 0;

function clearAuthenticatedRequestCache() {
  authenticatedDataRevision += 1;
  authenticatedGetCache.clear();
  authenticatedGetInFlight.clear();
}

function persistSession(session: AuthSession) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  if (session.sessionToken) localStorage.setItem(GUEST_TOKEN_KEY, session.sessionToken);
  clearAuthenticatedRequestCache();
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
  try {
    const value = localStorage.getItem(AUTH_STORAGE_KEY);
    return value ? (JSON.parse(value) as AuthSession) : null;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
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
    throw new Error(errorMessage(payload, 'Kirish amalga oshmadi. Qayta urinib ko‘ring.'));
  }
  return payload;
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
    const savedToken = localStorage.getItem(GUEST_TOKEN_KEY);
    const session = mapAuthPayloadToSession(
      await post('/api/v1/auth/guest/', savedToken ? { session_token: savedToken } : {})
    );
    persistSession(session);
    return session;
  },
  async startNewGuest() {
    const session = mapAuthPayloadToSession(await post('/api/v1/auth/guest/', {}));
    persistSession(session);
    return session;
  },
  async upgradeGuest(input) {
    const result = mapGuestUpgradePayload(
      await performAuthenticatedRequest<GuestUpgradePayload>('/api/v1/auth/guest/upgrade/', {
        method: 'POST',
        body: JSON.stringify(mapGuestUpgradeInput(input)),
      })
    );
    localStorage.removeItem(GUEST_TOKEN_KEY);
    persistSession(result.session);
    return result;
  },
  getSession,
  clearSession: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    clearAuthenticatedRequestCache();
  },
  hasSavedGuestSession: () => Boolean(localStorage.getItem(GUEST_TOKEN_KEY)),
};
