import { ensureAuthSession } from 'modules/auth/application';

import { engagementRepository } from '../data-access';
import { migrateLocalEngagement } from './migrate-local-engagement';

async function mutateWithSession<T>(operation: () => Promise<T>) {
  const session = await ensureAuthSession();
  const result = await operation();
  try {
    await migrateLocalEngagement(session);
  } catch {
    // The primary mutation is already durable. Remaining local data will be
    // retried on the next stateful action because the migration marker is absent.
  }
  return result;
}

export const engagementApi = {
  listBookmarks: () => engagementRepository.listBookmarks(),
  addBookmark: (articleSlug: string) =>
    mutateWithSession(() => engagementRepository.addBookmark(articleSlug)),
  removeBookmark: (id: number | string) =>
    mutateWithSession(() => engagementRepository.removeBookmark(id)),
  listProgress: () => engagementRepository.listProgress(),
  setProgress: (articleSlug: string, percent: number) =>
    mutateWithSession(() => engagementRepository.setProgress(articleSlug, percent)),
  removeProgress: (id: number | string) =>
    mutateWithSession(() => engagementRepository.removeProgress(id)),
  listNotes: () => engagementRepository.listNotes(),
  saveNote: (articleSlug: string, body: string, existingId?: number | string) =>
    mutateWithSession(() => engagementRepository.saveNote(articleSlug, body, existingId)),
  removeNote: (id: number | string) => mutateWithSession(() => engagementRepository.removeNote(id)),
};
