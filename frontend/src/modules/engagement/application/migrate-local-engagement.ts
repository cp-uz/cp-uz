import type { AuthSession } from 'modules/auth/domain';

import { engagementStore } from './engagement-service';

/** Guest sign-in may transfer only the known anonymous v2 scope, never unowned legacy data. */
export async function migrateLocalEngagement(session: AuthSession) {
  engagementStore.migrateAnonymous(session);
  await engagementStore.sync();
}
