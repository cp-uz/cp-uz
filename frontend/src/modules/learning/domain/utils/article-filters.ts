import type { LearningArticle } from '../entities';

import { rankArticleSearchResults } from './article-search';
import { canonicalCategoryId } from './category-presentation';

export function filterArticles(
  source: LearningArticle[],
  query: string,
  categoryId = 'all',
  articleDifficulty = 'all'
) {
  const filtered = source.filter((article) => {
    const matchesCategory =
      categoryId === 'all' || canonicalCategoryId(article.categoryId) === canonicalCategoryId(categoryId);
    const matchesDifficulty = articleDifficulty === 'all' || article.difficulty === articleDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  return rankArticleSearchResults(filtered, query);
}
