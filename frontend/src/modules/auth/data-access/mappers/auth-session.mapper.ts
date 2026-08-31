import type { AuthSession, GuestUpgradeInput, GuestUpgradeResult } from '../../domain';

export type AuthPayload = {
  access?: unknown;
  refresh?: unknown;
  session_token?: unknown;
  created?: unknown;
  user?: unknown;
};

export type GuestUpgradePayload = AuthPayload & {
  username?: unknown;
  one_time_password?: unknown;
};

export type GuestUpgradeRequestPayload = {
  username: string;
  first_name?: string;
  last_name?: string;
};

export function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function mapAuthPayloadToSession(payload: AuthPayload): AuthSession {
  const user = record(payload.user);
  const access = typeof payload.access === 'string' ? payload.access : '';
  const refresh = typeof payload.refresh === 'string' ? payload.refresh : '';

  if (!access || !refresh || !user.username) {
    throw new Error('Server kirish uchun yaroqsiz javob qaytardi.');
  }

  return {
    access,
    refresh,
    sessionToken: typeof payload.session_token === 'string' ? payload.session_token : undefined,
    created: typeof payload.created === 'boolean' ? payload.created : undefined,
    user: {
      id:
        typeof user.id === 'string' || typeof user.id === 'number'
          ? user.id
          : String(user.username),
      username: String(user.username),
      firstName: typeof user.first_name === 'string' ? user.first_name : undefined,
      lastName: typeof user.last_name === 'string' ? user.last_name : undefined,
      displayName:
        typeof user.display_name === 'string'
          ? user.display_name
          : typeof user.name === 'string'
            ? user.name
            : undefined,
      isGuest: Boolean(user.is_guest),
    },
  };
}

export function mapGuestUpgradeInput(input: GuestUpgradeInput): GuestUpgradeRequestPayload {
  const payload: GuestUpgradeRequestPayload = {
    username: input.username.trim().toLowerCase(),
  };

  if (input.firstName !== undefined) payload.first_name = input.firstName.trim();
  if (input.lastName !== undefined) payload.last_name = input.lastName.trim();

  return payload;
}

export function mapGuestUpgradePayload(payload: GuestUpgradePayload): GuestUpgradeResult {
  const session = mapAuthPayloadToSession(payload);
  const username = typeof payload.username === 'string' ? payload.username : '';
  const oneTimePassword =
    typeof payload.one_time_password === 'string' ? payload.one_time_password : '';

  if (
    !username ||
    !oneTimePassword ||
    session.user.isGuest ||
    session.sessionToken ||
    session.user.username !== username
  ) {
    throw new Error('Server akkauntni saqlash uchun yaroqsiz javob qaytardi.');
  }

  return { session, username, oneTimePassword };
}
