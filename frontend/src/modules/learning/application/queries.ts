import { roadmapStages } from '../domain';
import { learningRepository } from '../data-access';

export const learningQueries = {
  listArticles: () => learningRepository.listArticles(),
  getArticle: (slug: string, categoryId?: string) => learningRepository.getArticle(slug, categoryId),
  listCategories: () => learningRepository.listCategories(),
  getGlossary: () => learningRepository.getGlossary(),
  getStats: () => learningRepository.getStats(),
  getRoadmap: () => Promise.resolve(roadmapStages),
};
