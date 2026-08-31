import { engagementRepository } from '../data-access';

export const engagementApi = {
  listBookmarks: () => engagementRepository.listBookmarks(),
  addBookmark: (articleSlug: string) => engagementRepository.addBookmark(articleSlug),
  removeBookmark: (id: number | string) => engagementRepository.removeBookmark(id),
  listProgress: () => engagementRepository.listProgress(),
  setProgress: (articleSlug: string, percent: number) => engagementRepository.setProgress(articleSlug, percent),
  removeProgress: (id: number | string) => engagementRepository.removeProgress(id),
  listNotes: () => engagementRepository.listNotes(),
  saveNote: (articleSlug: string, body: string, existingId?: number | string) =>
    engagementRepository.saveNote(articleSlug, body, existingId),
  removeNote: (id: number | string) => engagementRepository.removeNote(id),
};
