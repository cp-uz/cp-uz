import type { LearningArticle } from '../entities';

export function getArticlePath(
  article: Pick<LearningArticle, 'categoryId' | 'slug'> & Partial<Pick<LearningArticle, 'route'>>
) {
  const route = article.route
    ?.replace(/^https?:\/\/[^/]+/i, '')
    .replace(/^\/+|\/+$/g, '')
    .replace(/^(?:algoritmlar|algo)\//, '')
    .replace(/\.html$/i, '');
  if (route?.includes('/')) return `/algoritmlar/${route}`;
  return `/algoritmlar/${article.categoryId}/${article.slug}`;
}

export function normalizeLegacySlug(value: string) {
  return value.replace(/\.html$/i, '').replace(/^\/+|\/+$/g, '');
}
