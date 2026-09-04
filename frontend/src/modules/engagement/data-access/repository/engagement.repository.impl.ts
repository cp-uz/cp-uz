import type { EngagementRepository } from '../../domain';

import { authenticatedRequest } from 'modules/auth/application';

import { rows, mapNote, mapBookmark, mapProgress } from '../mappers';

export function createEngagementRepository(expectedUserId: number | string): EngagementRepository {
  const request = <T>(path: string, init?: RequestInit) =>
    authenticatedRequest<T>(path, init, { expectedUserId });
  return {
    async listBookmarks() {
      return rows(await request<unknown>('/api/v1/me/bookmarks/all/'))
        .map((item) => mapBookmark(item))
        .filter((item) => item.id !== '' && item.articleSlug);
    },
    async addBookmark(articleSlug) {
      const payload = await request<unknown>('/api/v1/me/bookmarks/', {
        method: 'POST',
        body: JSON.stringify({ article_slug: articleSlug }),
      });
      return mapBookmark(payload, articleSlug);
    },
    removeBookmark: (id) => request<void>(`/api/v1/me/bookmarks/${id}/`, { method: 'DELETE' }),
    async listProgress() {
      return rows(await request<unknown>('/api/v1/me/progress/all/'))
        .map((item) => mapProgress(item))
        .filter((item) => item.id !== '' && item.articleSlug);
    },
    async setProgress(articleSlug, percent) {
      const payload = await request<unknown>('/api/v1/me/progress/', {
        method: 'POST',
        body: JSON.stringify({ article_slug: articleSlug, percent }),
      });
      return mapProgress(payload, articleSlug, percent);
    },
    removeProgress: (id) => request<void>(`/api/v1/me/progress/${id}/`, { method: 'DELETE' }),
    async listNotes() {
      return rows(await request<unknown>('/api/v1/me/notes/all/'))
        .map((item) => mapNote(item))
        .filter((item) => item.id !== '' && item.articleSlug);
    },
    async saveNote(articleSlug, body, existingId) {
      const path = existingId ? `/api/v1/me/notes/${existingId}/` : '/api/v1/me/notes/';
      const payload = await request<unknown>(path, {
        method: existingId ? 'PATCH' : 'POST',
        body: JSON.stringify(existingId ? { body } : { article_slug: articleSlug, body }),
      });
      return mapNote(payload, articleSlug, body);
    },
    removeNote: (id) => request<void>(`/api/v1/me/notes/${id}/`, { method: 'DELETE' }),
  };
}
