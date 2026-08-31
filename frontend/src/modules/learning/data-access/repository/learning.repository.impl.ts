import type { LearningArticle, LearningRepository } from '../../domain';

import { apiUrl } from 'shared/api/http';

import {
  record,
  unwrapResults,
  normalizeStats,
  normalizeArticle,
  normalizeCategory,
  normalizeGlossaryTerm,
} from '../mappers/learning.mapper';

const PUBLIC_CACHE_TTL_MS = 5 * 60 * 1000;
const publicResponseCache = new Map<string, { expiresAt: number; value: unknown }>();
const publicInFlight = new Map<string, Promise<unknown>>();

function requestJson(path: string): Promise<unknown> {
  const cached = publicResponseCache.get(path);
  if (cached && cached.expiresAt > Date.now()) return Promise.resolve(cached.value);
  if (cached) publicResponseCache.delete(path);

  const pending = publicInFlight.get(path);
  if (pending) return pending;

  const request = fetch(apiUrl(path), {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  })
    .then(async (response) => {
      if (!response.ok) throw new Error(`API ${response.status}`);
      return response.json() as Promise<unknown>;
    })
    .then((value) => {
      publicResponseCache.set(path, {
        value,
        expiresAt: Date.now() + PUBLIC_CACHE_TTL_MS,
      });
      return value;
    })
    .finally(() => publicInFlight.delete(path));

  publicInFlight.set(path, request);
  return request;
}

async function listArticles(): Promise<LearningArticle[]> {
  return unwrapResults(await requestJson('/api/v1/articles/all/')).map(normalizeArticle);
}

function normalizedArticleKey(value: string) {
  return value.trim().toLocaleLowerCase('uz').replace(/\.html$/i, '').replace(/_/g, '-');
}

export const learningRepository: LearningRepository = {
  listArticles,

  async getArticle(slug, categoryId) {
    if (categoryId) {
      return normalizeArticle(
        await requestJson(
          `/api/v1/articles/by-path/${encodeURIComponent(categoryId)}/${encodeURIComponent(slug)}/`
        )
      );
    }

    const requestedKey = normalizedArticleKey(slug);
    const match = (await listArticles()).find((article) => {
      const sourceParts = article.sourceId?.split('--') ?? [];
      const routeParts = article.route?.split('/').filter(Boolean) ?? [];
      const sourceLeaf = sourceParts[sourceParts.length - 1] ?? '';
      const routeLeaf = routeParts[routeParts.length - 1] ?? '';
      return [article.slug, article.sourceId ?? '', sourceLeaf, routeLeaf]
        .map(normalizedArticleKey)
        .includes(requestedKey);
    });
    if (!match) return null;

    const sourceId = match.sourceId ?? String(match.id);
    return normalizeArticle(await requestJson(`/api/v1/articles/${encodeURIComponent(sourceId)}/`));
  },

  async listCategories() {
    return unwrapResults(await requestJson('/api/v1/categories/'))
      .filter((item) => {
        const dto = record(item);
        return !dto.parent_slug && !dto.parent;
      })
      .map(normalizeCategory);
  },

  async getGlossary() {
    return unwrapResults(await requestJson('/api/v1/glossary/all/')).map(normalizeGlossaryTerm);
  },

  async getStats() {
    return normalizeStats(await requestJson('/api/v1/stats/'));
  },
};
