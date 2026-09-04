import type { ApiSchema } from 'shared/api/generated';
import type { LearningArticle, LearningRepository } from '../../domain';

import { publicRequest as requestJson } from 'shared/api/http';

import {
  normalizeStats,
  normalizeArticle,
  normalizeCategory,
  normalizeGlossaryTerm,
} from '../mappers/learning.mapper';

async function listArticles(): Promise<LearningArticle[]> {
  return (await requestJson<ApiSchema<'ArticleList'>[]>('/api/v1/articles/all/')).map(
    normalizeArticle
  );
}

function normalizedArticleKey(value: string) {
  return value
    .trim()
    .toLocaleLowerCase('uz')
    .replace(/\.html$/i, '')
    .replace(/_/g, '-');
}

export const learningRepository: LearningRepository = {
  listArticles,

  async getArticle(slug, categoryId) {
    if (categoryId) {
      return normalizeArticle(
        await requestJson<ApiSchema<'ArticleDetail'>>(
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
    return normalizeArticle(
      await requestJson<ApiSchema<'ArticleDetail'>>(
        `/api/v1/articles/${encodeURIComponent(sourceId)}/`
      )
    );
  },

  async listCategories() {
    return (await requestJson<ApiSchema<'Category'>[]>('/api/v1/categories/')).map(
      normalizeCategory
    );
  },

  async getGlossary() {
    return (await requestJson<ApiSchema<'GlossaryTermList'>[]>('/api/v1/glossary/all/')).map(
      normalizeGlossaryTerm
    );
  },

  async getStats() {
    return normalizeStats(await requestJson<ApiSchema<'PublicStats'>>('/api/v1/stats/'));
  },
};
