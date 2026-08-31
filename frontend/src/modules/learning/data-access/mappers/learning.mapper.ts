import type {
  Revision,
  Difficulty,
  ArticleLink,
  Contributor,
  GlossaryTerm,
  LearningStats,
  LearningArticle,
  LearningCategory,
  PracticeReference,
} from '../../domain';

import { resolveApiAssetUrl } from 'shared/api/http';

import { rootCategoryTitle, canonicalCategoryId } from '../../domain';

type JsonRecord = Record<string, unknown>;

export function record(value: unknown): JsonRecord {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as JsonRecord)
    : {};
}

function text(...values: unknown[]) {
  const value = values.find((item) => typeof item === 'string' && item.length > 0);
  return typeof value === 'string' ? value : '';
}

function list(value: unknown) {
  return Array.isArray(value) ? value : [];
}

export function unwrapResults(payload: unknown) {
  if (Array.isArray(payload)) return payload;
  return list(record(payload).results);
}

function difficulty(value: unknown): Difficulty {
  const normalized = text(value).toLocaleLowerCase('uz');
  if (['advanced', 'hard', 'yuqori'].includes(normalized)) return 'Yuqori';
  if (['intermediate', 'medium', 'o‘rta', "o'rta"].includes(normalized)) return 'O‘rta';
  return 'Boshlang‘ich';
}

function normalizePractice(value: unknown): PracticeReference {
  const dto = record(value);
  const platform = record(dto.platform);
  return {
    platform: text(platform.name, platform.title, dto.platform_name, dto.platform, 'Tashqi manba'),
    title: text(dto.title, dto.problem_name, dto.name, 'Mashq'),
    url: text(dto.url, dto.external_url, dto.href),
    difficulty: text(dto.difficulty, dto.rating, dto.level, '—'),
    note: text(dto.note, dto.description, dto.recommendation),
  };
}

function normalizeContributor(value: unknown): Contributor {
  const dto = record(value);
  const user = record(dto.user);
  const rawRole = text(dto.role, dto.contribution_type);
  const roleLabels: Record<string, string> = {
    author: 'Muallif',
    translator: 'Tarjimon',
    editor: 'Muharrir',
    technical_reviewer: 'Texnik tekshiruvchi',
    language_reviewer: 'Til tekshiruvchisi',
  };
  return {
    name: text(user.display_name, user.full_name, user.username, dto.name, 'Hissa qo‘shuvchi'),
    role: roleLabels[rawRole] ?? (text(dto.role_label) || undefined),
    avatarUrl: text(user.avatar_url, dto.avatar_url, dto.avatar) || undefined,
  };
}

function normalizeArticleLink(value: unknown): ArticleLink | null {
  const dto = record(value);
  if (!Object.keys(dto).length) return null;
  const category = record(dto.category);
  const path = text(dto.canonical_path, dto.route).replace(/^\/+|\/+$/g, '').split('/');
  const markerIndex = Math.max(path.indexOf('algoritmlar'), path.indexOf('algo'));
  return {
    slug: text(path[path.length - 1]?.replace(/\.html$/i, ''), dto.leaf_slug, dto.slug),
    categoryId: text(
      markerIndex >= 0 ? path[markerIndex + 1] : path.length > 1 ? path[0] : '',
      dto.category_slug,
      category.slug,
      category.key,
      'misc'
    ),
    title: text(dto.title, dto.name, 'Maqola'),
  };
}

function normalizeRevision(value: unknown): Revision {
  const dto = record(value);
  const author = record(dto.author);
  return {
    version: text(dto.version, dto.commit, '—'),
    date: text(dto.date, dto.created_at, dto.updated_at),
    author: text(author.name, dto.author_name, dto.author, 'cp.uz'),
    note: text(dto.note, dto.message, dto.summary),
  };
}

export function normalizeArticle(value: unknown): LearningArticle {
  const dto = record(value);
  const category = record(dto.category);
  const review = record(dto.review_state);
  const routeValue = text(dto.canonical_path, dto.route, dto.public_path);
  const routeParts = routeValue.replace(/^\/+|\/+$/g, '').split('/');
  const canonicalIndex = Math.max(routeParts.indexOf('algoritmlar'), routeParts.indexOf('algo'));
  const inferredCategory = canonicalIndex >= 0 ? routeParts[canonicalIndex + 1] : routeParts.length > 1 ? routeParts[0] : '';
  const inferredSlug = routeParts[routeParts.length - 1]?.replace(/\.html$/i, '');
  const id = typeof dto.id === 'number' || typeof dto.id === 'string' ? dto.id : text(dto.source_id);
  const nestedCategoryRoot = text(category.root_slug, category.slug).split('--')[0];
  const categoryId = canonicalCategoryId(
    text(
      dto.category_root_slug,
      nestedCategoryRoot,
      dto.category_id,
      category.key,
      inferredCategory,
      'miscellaneous'
    )
  );
  const slug = text(inferredSlug, dto.leaf_slug, String(id).split('--').slice(1).join('--'), dto.slug);
  const tags = list(dto.tags)
    .map((item) => {
      const tag = record(item);
      return text(tag.name, tag.title, tag.slug, item);
    })
    .filter(Boolean);
  const prerequisites = list(dto.prerequisites)
    .map((item) => {
      const prerequisite = record(item);
      const prerequisiteArticle = record(prerequisite.article);
      return text(
        prerequisiteArticle.title,
        prerequisiteArticle.name,
        prerequisiteArticle.slug,
        prerequisite.title,
        prerequisite.name,
        item
      );
    })
    .filter(Boolean);
  const technical = text(review.technical, review.technical_status, dto.technical_review_status, 'pending');
  const language = text(review.language, review.language_status, dto.language_review_status, 'pending');
  const rawEditorialStatus = text(dto.status, dto.editorial_status).toLocaleLowerCase('uz');
  const isPublished = rawEditorialStatus === 'published' || Boolean(review.is_published ?? dto.is_published ?? dto.published);
  const editorialStatus = isPublished
    ? 'published'
    : rawEditorialStatus === 'in_review' || rawEditorialStatus === 'technical_review'
      ? 'technical_review'
      : rawEditorialStatus === 'language_review'
        ? 'language_review'
        : 'draft';

  return {
    id: id || `${categoryId}--${slug}`,
    slug,
    title: text(dto.title, dto.name, slug),
    summary: text(dto.summary, dto.description, dto.excerpt),
    categoryId,
    category: rootCategoryTitle(categoryId, text(category.title, category.name, dto.category_name, categoryId)),
    difficulty: difficulty(dto.difficulty ?? dto.level),
    readTime: Number(dto.estimated_reading_minutes ?? dto.read_time ?? 10),
    updatedAt: text(dto.updated_at, dto.modified_at, dto.date),
    tags,
    prerequisites,
    editorialStatus,
    sourceId: text(dto.source_id, dto.slug, dto.id),
    publicPath: text(dto.public_path, dto.legacy_path) || undefined,
    route: text(dto.route, dto.canonical_path) || undefined,
    sourcePath: text(dto.source_path, dto.content_path) || undefined,
    content: text(dto.content, dto.markdown, dto.body) || undefined,
    assetBaseUrl: resolveApiAssetUrl(text(dto.asset_base_url, dto.media_base_url)) || undefined,
    practiceReferences: list(dto.practice_references).map(normalizePractice),
    reviewState: {
      technical:
        technical === 'approved'
          ? 'approved'
          : technical === 'changes_requested'
            ? 'changes_requested'
            : 'pending',
      language:
        language === 'approved'
          ? 'approved'
          : language === 'changes_requested'
            ? 'changes_requested'
            : 'pending',
      isPublished,
    },
    contributors: list(dto.contributors).map(normalizeContributor),
    revisions: list(dto.revisions).map(normalizeRevision),
    previous: normalizeArticleLink(dto.previous_article ?? dto.previous),
    next: normalizeArticleLink(dto.next_article ?? dto.next),
  };
}

export function normalizeCategory(value: unknown): LearningCategory {
  const dto = record(value);
  return {
    id: text(dto.slug, dto.key, dto.id),
    title: text(dto.title, dto.name, dto.slug),
    description: text(dto.description, dto.summary),
    icon: text(dto.icon, 'solar:folder-with-files-linear'),
    accent: text(dto.accent, dto.color, '#036FDC'),
    articleCount: Number(dto.descendant_article_count ?? dto.article_count ?? dto.count ?? 0),
  };
}

export function normalizeGlossaryTerm(value: unknown): GlossaryTerm {
  const dto = record(value);
  const aliases = list(dto.aliases).map((item) => text(item)).filter(Boolean);
  return {
    term: text(dto.uzbek_term, dto.term, dto.title, dto.name),
    english: text(dto.english_term, dto.english, dto.original, list(dto.aliases)[0]),
    definition: text(dto.description, dto.short_definition, dto.definition),
    aliases,
    related: list(dto.related_articles ?? dto.related)
      .map((item) => text(record(item).term, record(item).title, item))
      .filter(Boolean),
  };
}

export function normalizeStats(value: unknown): LearningStats {
  const dto = record(value);
  const editorial = record(dto.editorial);
  return {
    articleCount: Number(dto.articles ?? dto.article_count ?? dto.total_articles ?? 0),
    categoryCount: Number(dto.categories ?? dto.category_count ?? dto.root_category_count ?? 0),
    practiceReferenceCount: Number(
      dto.practice_references ?? dto.practice_reference_count ?? dto.external_reference_count ?? 0
    ),
    publishedCount: Number(editorial.published ?? dto.published_count ?? 0),
    draftCount: Number(editorial.draft ?? dto.draft_count ?? 0),
    fullDraftCount: Number(dto.full_translations ?? dto.full_draft_count ?? 0),
    synopsisCount: Number(dto.synopsis_drafts ?? dto.synopsis_count ?? 0),
    articlesWithPracticeCount: Number(dto.articles_with_practice_count ?? 0),
  };
}
