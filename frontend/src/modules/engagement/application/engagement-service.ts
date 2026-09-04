import { safeStorage } from 'shared/storage';
import { getAuthSession, ensureAuthSession, subscribeAuthSession } from 'modules/auth/application';

import { createEngagementStore } from './engagement-store';
import { createEngagementRepository } from '../data-access';

export const engagementStore = createEngagementStore({
  storage: safeStorage,
  repository: createEngagementRepository,
  getSession: getAuthSession,
  ensureSession: ensureAuthSession,
  subscribeSession: (listener) => subscribeAuthSession(listener),
  eventTarget: typeof window === 'undefined' ? undefined : window,
});
