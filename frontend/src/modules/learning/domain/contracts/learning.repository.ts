import type {
  GlossaryTerm,
  LearningStats,
  LearningArticle,
  LearningCategory,
} from '../entities';

export interface LearningRepository {
  listArticles(): Promise<LearningArticle[]>;
  getArticle(slug: string, categoryId?: string): Promise<LearningArticle | null>;
  listCategories(): Promise<LearningCategory[]>;
  getGlossary(): Promise<GlossaryTerm[]>;
  getStats(): Promise<LearningStats>;
}
