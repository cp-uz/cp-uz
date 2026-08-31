import type { AuthSession, GuestUpgradeInput, GuestUpgradeResult } from '../entities';

export interface AuthRepository {
  login(username: string, password: string): Promise<AuthSession>;
  continueAsGuest(): Promise<AuthSession>;
  startNewGuest(): Promise<AuthSession>;
  upgradeGuest(input: GuestUpgradeInput): Promise<GuestUpgradeResult>;
  getSession(): AuthSession | null;
  clearSession(): void;
  hasSavedGuestSession(): boolean;
}
