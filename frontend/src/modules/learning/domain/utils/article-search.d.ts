import type { LearningArticle } from '../entities';

export function normalizeSearchText(value: unknown): string;
export function scoreArticleSearch(article: LearningArticle, query: string): number;
export function rankArticleSearchResults(
  articles: LearningArticle[],
  query: string
): LearningArticle[];
export function matchesArticleSearch(article: LearningArticle, query: string): boolean;
