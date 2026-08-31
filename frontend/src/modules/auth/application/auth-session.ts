import type { GuestUpgradeInput, AccountDeleteInput } from '../domain';

import { createAuthSessionEnsurer } from './auth-session-ensurer';
import { authRepository, authenticatedRequest as requestWithSession } from '../data-access';

const ensureSession = createAuthSessionEnsurer(authRepository);

export const authApi = {
  login: (username: string, password: string) => authRepository.login(username, password),
  continueAsGuest: () => authRepository.continueAsGuest(),
  startNewGuest: () => authRepository.startNewGuest(),
  ensureSession,
  upgradeGuest: (input: GuestUpgradeInput) => authRepository.upgradeGuest(input),
  deleteAccount: (input: AccountDeleteInput) => authRepository.deleteAccount(input),
};

export const getAuthSession = () => authRepository.getSession();
export const clearAuthSession = () => authRepository.clearSession();
export const logoutAuthSession = clearAuthSession;
export const hasSavedGuestSession = () => authRepository.hasSavedGuestSession();
export const subscribeAuthSession = (
  listener: (session: ReturnType<typeof getAuthSession>) => void
) => authRepository.subscribeSession(listener);
export const ensureAuthSession = ensureSession;
export const ensureGuestSession = ensureSession;
export const authenticatedRequest = <T>(path: string, init?: RequestInit) =>
  requestWithSession<T>(path, init);
