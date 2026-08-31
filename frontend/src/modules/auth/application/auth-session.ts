import type { GuestUpgradeInput } from '../domain';

import { authRepository, authenticatedRequest as requestWithSession } from '../data-access';

export const authApi = {
  login: (username: string, password: string) => authRepository.login(username, password),
  continueAsGuest: () => authRepository.continueAsGuest(),
  startNewGuest: () => authRepository.startNewGuest(),
  upgradeGuest: (input: GuestUpgradeInput) => authRepository.upgradeGuest(input),
};

export const getAuthSession = () => authRepository.getSession();
export const clearAuthSession = () => authRepository.clearSession();
export const hasSavedGuestSession = () => authRepository.hasSavedGuestSession();
export const authenticatedRequest = <T>(path: string, init?: RequestInit) =>
  requestWithSession<T>(path, init);
