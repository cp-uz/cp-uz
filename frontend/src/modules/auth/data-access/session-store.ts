import type { AuthSession } from '../domain';

import { safeStorage } from 'shared/storage';

export const AUTH_STORAGE_KEY = 'cpuz:auth-session';
export const GUEST_TOKEN_KEY = 'cpuz:guest-session-token';
const CHANGE_EVENT = 'cpuz:auth-session-change';
const pendingControllers = new Set<AbortController>();
const invalidationListeners = new Set<() => void>();
let revision = 0;
let cachedRaw: string | null | undefined;
let session: AuthSession | null = null;
let observedWindow: Window | undefined;

export class SessionChangedError extends Error {
  constructor() {
    super('Sessiya o‘zgardi. Amalni joriy akkauntda qayta bajaring.');
    this.name = 'SessionChangedError';
  }
}

function validSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<AuthSession>;
  return Boolean(
    typeof candidate.access === 'string' &&
    candidate.access &&
    typeof candidate.refresh === 'string' &&
    candidate.refresh &&
    candidate.user &&
    ['string', 'number'].includes(typeof candidate.user.id) &&
    typeof candidate.user.username === 'string' &&
    candidate.user.username &&
    typeof candidate.user.isGuest === 'boolean'
  );
}

function invalidate() {
  revision += 1;
  pendingControllers.forEach((controller) => controller.abort(new SessionChangedError()));
  pendingControllers.clear();
  invalidationListeners.forEach((listener) => listener());
}

function notify() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(CHANGE_EVENT));
}

function observeStorage() {
  if (typeof window === 'undefined' || observedWindow === window) return;
  observedWindow = window;
  window.addEventListener('storage', (event) => {
    if (event.key !== null && event.key !== AUTH_STORAGE_KEY) return;
    getSession();
    notify();
  });
}

export function getSession(): AuthSession | null {
  observeStorage();
  const raw = safeStorage.getItem(AUTH_STORAGE_KEY);
  if (raw === cachedRaw) return session;
  const previousRaw = cachedRaw;
  const previousSessionKey = session?.sessionKey;
  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (parsed !== null && !validSession(parsed)) throw new Error('Invalid stored session');
    session = parsed;
  } catch {
    safeStorage.removeItem(AUTH_STORAGE_KEY);
    cachedRaw = null;
    session = null;
  }
  if (
    previousRaw !== undefined &&
    (!previousSessionKey || previousSessionKey !== session?.sessionKey)
  )
    invalidate();
  return session;
}

export function sessionRevision() {
  getSession();
  return revision;
}

export function assertSessionRevision(expected: number, expectedUserId?: number | string) {
  const current = getSession();
  if (
    revision !== expected ||
    (expectedUserId !== undefined && String(current?.user.id) !== String(expectedUserId))
  ) {
    throw new SessionChangedError();
  }
  return current;
}

export function beginSessionChange() {
  getSession();
  invalidate();
  return revision;
}

export function persistSession(value: AuthSession, keepRevision = false) {
  if (!keepRevision) invalidate();
  session = keepRevision ? value : { ...value, sessionKey: crypto.randomUUID() };
  cachedRaw = JSON.stringify(session);
  safeStorage.setItem(AUTH_STORAGE_KEY, cachedRaw);
  if (value.sessionToken) safeStorage.setItem(GUEST_TOKEN_KEY, value.sessionToken);
  notify();
}

export function clearSession(clearGuest = false) {
  invalidate();
  safeStorage.removeItem(AUTH_STORAGE_KEY);
  if (clearGuest) safeStorage.removeItem(GUEST_TOKEN_KEY);
  cachedRaw = null;
  session = null;
  notify();
}

export function subscribeSession(listener: (value: AuthSession | null) => void) {
  observeStorage();
  if (typeof window === 'undefined') return () => undefined;
  const onChange = () => listener(getSession());
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

export function onSessionInvalidated(listener: () => void) {
  invalidationListeners.add(listener);
  return () => invalidationListeners.delete(listener);
}

export async function withSessionSignal<T>(
  expected: number,
  operation: (signal: AbortSignal) => Promise<T>,
  signal?: AbortSignal | null
): Promise<T> {
  assertSessionRevision(expected);
  const controller = new AbortController();
  const abort = () => controller.abort(signal?.reason);
  if (signal?.aborted) abort();
  else signal?.addEventListener('abort', abort, { once: true });
  pendingControllers.add(controller);
  try {
    const result = await operation(controller.signal);
    assertSessionRevision(expected);
    return result;
  } finally {
    pendingControllers.delete(controller);
    signal?.removeEventListener('abort', abort);
  }
}
