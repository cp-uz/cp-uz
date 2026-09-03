import type { LearningArticle } from '../entities';

import { appRoutes } from 'shared/config';

export function getArticlePath(
  article: Pick<LearningArticle, 'categoryId' | 'slug'> & Partial<Pick<LearningArticle, 'route'>>
) {
  const route = article.route
    ?.replace(/^https?:\/\/[^/]+/i, '')
    .replace(/^\/+|\/+$/g, '')
    .replace(/^(?:algoritmlar|algo)\//, '')
    .replace(/\.html$/i, '');
  if (route?.includes('/')) {
    const separator = route.indexOf('/');
    return appRoutes.algorithm(route.slice(0, separator), route.slice(separator + 1));
  }
  return appRoutes.algorithm(article.categoryId, article.slug);
}

export function normalizeLegacySlug(value: string) {
  return value.replace(/\.html$/i, '').replace(/^\/+|\/+$/g, '');
}
