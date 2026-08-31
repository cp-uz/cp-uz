import type {
  AuthSession,
  GuestUpgradeInput,
  AccountDeleteInput,
  GuestUpgradeResult,
} from '../entities';

export interface AuthRepository {
  login(username: string, password: string): Promise<AuthSession>;
  continueAsGuest(): Promise<AuthSession>;
  startNewGuest(): Promise<AuthSession>;
  ensureSession(): Promise<AuthSession>;
  upgradeGuest(input: GuestUpgradeInput): Promise<GuestUpgradeResult>;
  deleteAccount(input: AccountDeleteInput): Promise<void>;
  getSession(): AuthSession | null;
  clearSession(): void;
  hasSavedGuestSession(): boolean;
  subscribeSession(listener: (session: AuthSession | null) => void): () => void;
}
