import type { AuthSession, AuthRepository } from '../domain';

type SessionRepository = Pick<AuthRepository, 'ensureSession' | 'getSession'>;

export function createAuthSessionEnsurer(repository: SessionRepository) {
  let inFlight: Promise<AuthSession> | null = null;

  return function ensureAuthSession(): Promise<AuthSession> {
    const existingSession = repository.getSession();
    if (existingSession) return Promise.resolve(existingSession);
    if (inFlight) return inFlight;

    const request = Promise.resolve()
      .then(() => repository.getSession() ?? repository.ensureSession())
      .finally(() => {
        if (inFlight === request) inFlight = null;
      });

    inFlight = request;
    return request;
  };
}
