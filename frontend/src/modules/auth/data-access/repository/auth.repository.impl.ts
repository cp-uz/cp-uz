import type { AuthRepository } from '../../domain';

import { safeStorage } from 'shared/storage';
import { ApiError, requestJson } from 'shared/api/http';

import { authenticatedRequest } from '../authenticated-request';
import {
  type AuthPayload,
  mapGuestUpgradeInput,
  mapGuestUpgradePayload,
  mapAuthPayloadToSession,
  type GuestUpgradePayload,
} from '../mappers';
import {
  getSession,
  clearSession,
  persistSession,
  GUEST_TOKEN_KEY,
  sessionRevision,
  subscribeSession,
  withSessionSignal,
  beginSessionChange,
  assertSessionRevision,
} from '../session-store';

export { authenticatedRequest } from '../authenticated-request';

function post(path: string, body: unknown, expected: number) {
  return withSessionSignal(expected, (signal) =>
    requestJson<AuthPayload>(path, {
      method: 'POST',
      body: JSON.stringify(body),
      signal,
    })
  );
}

async function requestGuest(expected: number, savedToken?: string) {
  return mapAuthPayloadToSession(
    await post('/api/v1/auth/guest/', savedToken ? { session_token: savedToken } : {}, expected)
  );
}

export const authRepository: AuthRepository = {
  async login(username, password) {
    const expected = beginSessionChange();
    const session = mapAuthPayloadToSession(
      await post('/api/v1/auth/login/', { username, password }, expected)
    );
    assertSessionRevision(expected);
    persistSession(session);
    return session;
  },
  async continueAsGuest() {
    const expected = beginSessionChange();
    const session = await requestGuest(expected, safeStorage.getItem(GUEST_TOKEN_KEY) ?? undefined);
    assertSessionRevision(expected);
    persistSession(session);
    return session;
  },
  async startNewGuest() {
    const expected = beginSessionChange();
    const session = await requestGuest(expected);
    assertSessionRevision(expected);
    persistSession(session);
    return session;
  },
  async ensureSession() {
    const current = getSession();
    if (current) return current;
    const expected = sessionRevision();
    const savedToken = safeStorage.getItem(GUEST_TOKEN_KEY);
    let session;
    if (savedToken) {
      try {
        session = await requestGuest(expected, savedToken);
      } catch (error) {
        const established = getSession();
        if (established) return established;
        assertSessionRevision(expected);
        if (!(error instanceof ApiError) || ![400, 401, 403, 404].includes(error.status))
          throw error;
        safeStorage.removeItem(GUEST_TOKEN_KEY);
      }
    }
    session ??= await requestGuest(expected);
    assertSessionRevision(expected);
    persistSession(session);
    return session;
  },
  async upgradeGuest(input) {
    const expected = sessionRevision();
    const result = mapGuestUpgradePayload(
      await authenticatedRequest<GuestUpgradePayload>('/api/v1/auth/guest/upgrade/', {
        method: 'POST',
        body: JSON.stringify(mapGuestUpgradeInput(input)),
      })
    );
    assertSessionRevision(expected);
    safeStorage.removeItem(GUEST_TOKEN_KEY);
    persistSession(result.session);
    return result;
  },
  async deleteAccount(input) {
    const expected = sessionRevision();
    await authenticatedRequest<void>('/api/v1/auth/account/', {
      method: 'DELETE',
      body: JSON.stringify({
        confirmation: input.confirmation,
        ...(input.password ? { password: input.password } : {}),
      }),
    });
    assertSessionRevision(expected);
    clearSession(true);
  },
  getSession,
  clearSession: () => clearSession(),
  hasSavedGuestSession: () => Boolean(safeStorage.getItem(GUEST_TOKEN_KEY)),
  subscribeSession,
};
