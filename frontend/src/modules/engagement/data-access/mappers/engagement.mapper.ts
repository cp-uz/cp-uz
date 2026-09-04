import type { NoteEntry, BookmarkEntry, ProgressEntry } from '../../domain';

export function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function rows(payload: unknown) {
  if (Array.isArray(payload)) return payload;
  const results = record(payload).results;
  return Array.isArray(results) ? results : [];
}

function articleSlug(value: unknown) {
  const article = record(record(value).article);
  return typeof article.slug === 'string' ? article.slug : '';
}

function id(value: unknown) {
  const candidate = record(value).id;
  return typeof candidate === 'number' || typeof candidate === 'string' ? candidate : '';
}

export function mapBookmark(value: unknown, fallbackSlug = ''): BookmarkEntry {
  return { id: id(value), articleSlug: articleSlug(value) || fallbackSlug };
}

export function mapProgress(value: unknown, fallbackSlug = '', fallbackPercent = 0): ProgressEntry {
  const dto = record(value);
  const percent = typeof dto.percent === 'number' ? dto.percent : fallbackPercent;
  return {
    id: id(value),
    articleSlug: articleSlug(value) || fallbackSlug,
    percent,
    status:
      typeof dto.status === 'string' ? dto.status : percent >= 100 ? 'completed' : 'in_progress',
  };
}

export function mapNote(value: unknown, fallbackSlug = '', fallbackBody = ''): NoteEntry {
  const dto = record(value);
  return {
    id: id(value),
    articleSlug: articleSlug(value) || fallbackSlug,
    body: typeof dto.body === 'string' ? dto.body : fallbackBody,
    anchor: typeof dto.anchor === 'string' ? dto.anchor : '',
  };
}
