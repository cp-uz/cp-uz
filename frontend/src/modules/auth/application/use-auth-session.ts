import { useSyncExternalStore } from 'react';

import { getAuthSession, subscribeAuthSession } from './auth-session';

const getServerSession = () => null;

export function useAuthSession() {
  return useSyncExternalStore(subscribeAuthSession, getAuthSession, getServerSession);
}
