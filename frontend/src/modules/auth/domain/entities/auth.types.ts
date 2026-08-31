export type AuthUser = {
  id: number | string;
  username: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  isGuest: boolean;
};

export type AuthSession = {
  access: string;
  refresh: string;
  sessionToken?: string;
  created?: boolean;
  user: AuthUser;
};

export type GuestUpgradeResult = {
  session: AuthSession;
  username: string;
  oneTimePassword: string;
};

export type GuestUpgradeInput = {
  username: string;
  firstName?: string;
  lastName?: string;
};
