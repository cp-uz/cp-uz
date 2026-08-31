export type Difficulty = 'Boshlang‘ich' | 'O‘rta' | 'Yuqori';

export type ArticleStatus = 'Yangi' | 'Yangilangan' | 'Mashhur';

export type EditorialStatus = 'draft' | 'technical_review' | 'language_review' | 'published';

export type LearningCategory = {
  id: string;
  title: string;
  description: string;
  icon: string;
  accent: string;
  articleCount: number;
};

export type LearningArticle = {
  id: number | string;
  slug: string;
  title: string;
  summary: string;
  categoryId: string;
  category: string;
  difficulty: Difficulty;
  readTime: number;
  updatedAt: string;
  tags: string[];
  prerequisites: string[];
  status?: ArticleStatus;
  featured?: boolean;
  progress?: number;
  editorialStatus?: EditorialStatus;
  sourceId?: string;
  publicPath?: string;
  route?: string;
  sourcePath?: string;
  sourceUrl?: string;
  russianSourceUrl?: string;
  content?: string;
  assetBaseUrl?: string;
  practiceReferences?: PracticeReference[];
  reviewState?: ReviewState;
  contributors?: Contributor[];
  revisions?: Revision[];
  previous?: ArticleLink | null;
  next?: ArticleLink | null;
};

export type ReviewState = {
  technical: 'pending' | 'approved' | 'changes_requested';
  language: 'pending' | 'approved' | 'changes_requested';
  isPublished: boolean;
};

export type Contributor = {
  name: string;
  role?: string;
  avatarUrl?: string;
};

export type ArticleLink = {
  slug: string;
  categoryId: string;
  title: string;
};

export type LearningStats = {
  articleCount: number;
  categoryCount: number;
  practiceReferenceCount: number;
  publishedCount: number;
  draftCount: number;
  fullDraftCount?: number;
  synopsisCount?: number;
  articlesWithPracticeCount?: number;
};

export type RoadmapStage = {
  id: string;
  order: number;
  eyebrow: string;
  title: string;
  description: string;
  objective: string;
  duration: string;
  prerequisiteStageIds: string[];
  articleSlugs: string[];
  color: string;
};

export type GlossaryTerm = {
  term: string;
  english: string;
  definition: string;
  aliases?: string[];
  related: string[];
};

export type PracticeReference = {
  platform: string;
  title: string;
  url: string;
  difficulty: string;
  note: string;
};

export type Revision = {
  version: string;
  date: string;
  author: string;
  note: string;
};
