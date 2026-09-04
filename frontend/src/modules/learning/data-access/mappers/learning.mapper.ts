import type { ApiSchema } from 'shared/api/generated';
import type {
  Difficulty,
  ArticleLink,
  Contributor,
  ReviewState,
  GlossaryTerm,
  LearningStats,
  LearningArticle,
  LearningCategory,
  PracticeReference,
} from '../../domain';

import { resolveApiAssetUrl } from 'shared/api/http';

import { rootCategoryTitle, canonicalCategoryId } from '../../domain';

type ArticleDto = ApiSchema<'ArticleList'> | ApiSchema<'ArticleDetail'>;

const difficultyLabels: Record<ApiSchema<'DifficultyEnum'>, Difficulty> = {
  beginner: 'Boshlang‘ich',
  intermediate: 'O‘rta',
  advanced: 'Yuqori',
};

function articleRoute(dto: ApiSchema<'ArticleLink'>) {
  const path = dto.canonical_path?.replace(/^\/+|\/+$/g, '').split('/') ?? [];
  return {
    slug: path[path.length - 1] || dto.slug.split('--').slice(1).join('--') || dto.slug,
    categoryId: canonicalCategoryId(dto.category.slug.split('--')[0]),
  };
}

function normalizeArticleLink(dto: ApiSchema<'ArticleLink'> | null): ArticleLink | null {
  return dto ? { ...articleRoute(dto), title: dto.title } : null;
}

function normalizeContributor(dto: ApiSchema<'Contributor'>): Contributor {
  return { name: dto.user.name, role: dto.role_label, avatarUrl: dto.user.avatar_url || undefined };
}

function normalizePractice(dto: ApiSchema<'PracticeReference'>): PracticeReference {
  return {
    platform: dto.platform_name,
    title: dto.title,
    url: dto.url,
    difficulty: dto.difficulty_label || dto.level_label,
    note: dto.note ?? '',
  };
}

function reviewStatus(
  dto: ApiSchema<'ArticleReviewState'> | undefined,
  stage: 'technical' | 'language'
): ReviewState['technical'] {
  const approved = stage === 'technical' ? dto?.technical_approved : dto?.language_approved;
  if (approved) return 'approved';
  return dto?.latest[stage]?.decision === 'changes_requested' ? 'changes_requested' : 'pending';
}

export function normalizeArticle(dto: ArticleDto): LearningArticle {
  const detail = 'content' in dto ? dto : undefined;
  const { slug, categoryId } = articleRoute(dto);
  return {
    id: dto.id,
    slug,
    categoryId,
    title: dto.title,
    summary: dto.summary,
    category: rootCategoryTitle(categoryId, dto.category.name),
    difficulty: difficultyLabels[dto.difficulty ?? 'beginner'],
    readTime: dto.estimated_reading_minutes ?? 5,
    updatedAt: dto.updated_at,
    tags: dto.tags.map((tag) => tag.name),
    prerequisites: detail?.prerequisites.map((link) => link.article.title) ?? [],
    editorialStatus:
      dto.status === 'published'
        ? 'published'
        : dto.status === 'in_review'
          ? 'technical_review'
          : 'draft',
    sourceId: dto.slug,
    route: dto.canonical_path || undefined,
    sourcePath: detail?.source_path || undefined,
    sourceUrl: detail?.source_url || undefined,
    russianSourceUrl: detail?.russian_source_url || undefined,
    content: detail?.content,
    assetBaseUrl: resolveApiAssetUrl(dto.asset_base_url) || undefined,
    practiceReferences: detail?.practice_references.map(normalizePractice) ?? [],
    reviewState: {
      technical: reviewStatus(detail?.review_state, 'technical'),
      language: reviewStatus(detail?.review_state, 'language'),
      isPublished: dto.status === 'published',
    },
    contributors: detail?.contributors.map(normalizeContributor) ?? [],
    revisions: [],
    previous: normalizeArticleLink(detail?.previous_article ?? null),
    next: normalizeArticleLink(detail?.next_article ?? null),
  };
}

export function normalizeCategory(dto: ApiSchema<'Category'>): LearningCategory {
  return {
    id: dto.slug,
    title: dto.name,
    description: dto.description ?? '',
    icon: dto.icon || 'solar:folder-with-files-linear',
    accent: dto.color || '#036FDC',
    articleCount: dto.article_count,
  };
}

export function normalizeGlossaryTerm(
  dto: ApiSchema<'GlossaryTermList'> | ApiSchema<'GlossaryTermDetail'>
): GlossaryTerm {
  return {
    term: dto.uzbek_term,
    english: dto.english_term,
    definition: dto.description,
    aliases: dto.aliases,
    related: 'related_articles' in dto ? dto.related_articles.map((article) => article.title) : [],
  };
}

export function normalizeStats(dto: ApiSchema<'PublicStats'>): LearningStats {
  return {
    articleCount: dto.articles,
    categoryCount: dto.categories,
    practiceReferenceCount: dto.practice_references,
    publishedCount: dto.editorial.published,
    draftCount: dto.editorial.draft,
    fullDraftCount: dto.full_translations,
    synopsisCount: dto.synopsis_drafts,
  };
}
