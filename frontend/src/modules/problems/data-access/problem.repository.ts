import type {
  ProblemSet,
  ProblemEvent,
  ProblemDetail,
  ProblemSeason,
  ProblemCatalog,
  ProblemSummary,
  ProblemEventDetail,
  ProblemTranslationStatus,
} from '../domain';

import { apiUrl, resolveApiAssetUrl } from 'shared/api/http';

type JsonRecord = Record<string, unknown>;

function record(value: unknown): JsonRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as JsonRecord) : {};
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function number(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function list(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function mapSeason(value: unknown): ProblemSeason {
  const dto = record(value);
  return {
    title: text(dto.title),
    slug: text(dto.slug),
    startDate: text(dto.start_date) || undefined,
    endDate: text(dto.end_date) || undefined,
  };
}

function mapEvent(value: unknown): ProblemEvent {
  const dto = record(value);
  return {
    code: text(dto.code),
    slug: text(dto.slug),
    title: text(dto.title),
    shortTitle: text(dto.short_title) || undefined,
    summary: text(dto.summary) || undefined,
    description: text(dto.description) || undefined,
    status: text(dto.event_status) || undefined,
    startDate: text(dto.start_date) || undefined,
    endDate: text(dto.end_date) || undefined,
    dateLabel: text(dto.date_label) || undefined,
    location: text(dto.location) || undefined,
    venue: text(dto.venue) || undefined,
    mode: text(dto.mode) || undefined,
    organizer: text(dto.organizer) || undefined,
  };
}

function mapProblemSummary(value: unknown): ProblemSummary {
  const dto = record(value);
  return {
    id: text(dto.id),
    slug: text(dto.slug),
    code: text(dto.code),
    title: text(dto.title),
    originalTitle: text(dto.original_title) || undefined,
    translationStatus: (text(dto.translation_status) || 'ai_translation') as ProblemTranslationStatus,
    translationStatusLabel: text(dto.translation_status_label),
    problemType: text(dto.problem_type),
    problemTypeLabel: text(dto.problem_type_label),
    rating: number(dto.rating),
    difficultyLabel: text(dto.difficulty_label) || undefined,
    order: number(dto.order) ?? 0,
  };
}

function mapSet(value: unknown): ProblemSet {
  const dto = record(value);
  return {
    id: text(dto.id),
    slug: text(dto.slug),
    title: text(dto.title),
    description: text(dto.description) || undefined,
    dateLabel: text(dto.date_label) || undefined,
    order: number(dto.order) ?? 0,
    problems: list(dto.problems).map(mapProblemSummary),
  };
}

async function requestJson(path: string): Promise<unknown | null> {
  const response = await fetch(apiUrl(path), {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Masalalar API xatosi: ${response.status}`);
  return response.json() as Promise<unknown>;
}

export const problemRepository = {
  async catalog(seasonSlug?: string): Promise<ProblemCatalog> {
    const suffix = seasonSlug ? `?season=${encodeURIComponent(seasonSlug)}` : '';
    const dto = record(await requestJson(`/api/v1/problems/${suffix}`));
    return {
      seasons: list(dto.seasons).map(mapSeason),
      events: list(dto.events).map((value) => {
        const item = record(value);
        return {
          season: mapSeason(item.season),
          event: mapEvent(item.event),
          sets: list(item.sets).map(mapSet),
          problemCount: number(item.problem_count) ?? 0,
        };
      }),
    };
  },

  async event(seasonSlug: string, eventSlug: string): Promise<ProblemEventDetail | null> {
    const payload = await requestJson(
      `/api/v1/problems/${encodeURIComponent(seasonSlug)}/${encodeURIComponent(eventSlug)}/`
    );
    if (!payload) return null;
    const dto = record(payload);
    return {
      season: mapSeason(dto.season),
      event: mapEvent(dto.event),
      sets: list(dto.sets).map(mapSet),
    };
  },

  async detail(
    seasonSlug: string,
    eventSlug: string,
    problemSlug: string
  ): Promise<ProblemDetail | null> {
    const payload = await requestJson(
      `/api/v1/problems/${encodeURIComponent(seasonSlug)}/${encodeURIComponent(eventSlug)}/${encodeURIComponent(problemSlug)}/`
    );
    if (!payload) return null;
    const dto = record(payload);
    const summary = mapProblemSummary(dto);
    const setDto = record(dto.problem_set);
    const statementPdfDto = record(dto.statement_pdf);
    return {
      ...summary,
      statementMarkdown: text(dto.statement_markdown),
      sourcePath: text(dto.source_path),
      statementPdf: text(statementPdfDto.url)
        ? {
            url: resolveApiAssetUrl(text(statementPdfDto.url)),
            sha256: text(statementPdfDto.sha256),
            sizeBytes: number(statementPdfDto.size_bytes),
            pageCount: number(statementPdfDto.page_count),
            language: (text(statementPdfDto.language) || undefined) as
              | 'uz'
              | 'en'
              | undefined,
            provenance: (text(statementPdfDto.provenance) || undefined) as
              | 'official'
              | 'generated'
              | undefined,
            provenanceLabel: text(statementPdfDto.provenance_label) || undefined,
          }
        : undefined,
      timeLimitMs: number(dto.time_limit_ms),
      memoryLimitMb: number(dto.memory_limit_mb),
      maxScore: dto.max_score == null ? undefined : text(dto.max_score),
      tags: list(dto.tags).map(text).filter(Boolean),
      lastVerifiedOn: text(dto.last_verified_on) || undefined,
      links: list(dto.links).map((value) => {
        const item = record(value);
        return {
          id: text(item.id),
          kind: text(item.kind) as ProblemDetail['links'][number]['kind'],
          kindLabel: text(item.kind_label),
          title: text(item.title),
          url: text(item.url),
          platform: text(item.platform) || undefined,
          official: Boolean(item.is_official),
          primary: Boolean(item.is_primary),
          order: number(item.order) ?? 0,
        };
      }),
      attachments: list(dto.attachments).map((value) => {
        const item = record(value);
        return {
          id: text(item.id),
          title: text(item.title),
          url: text(item.url),
          contentType: text(item.content_type) || undefined,
          sizeBytes: number(item.size_bytes),
          order: number(item.order) ?? 0,
        };
      }),
      problemSet: {
        slug: text(setDto.slug),
        title: text(setDto.title),
        dateLabel: text(setDto.date_label) || undefined,
        order: number(setDto.order) ?? 0,
      },
      season: mapSeason(dto.season),
      event: mapEvent(dto.event),
      sets: list(dto.sets).map(mapSet),
    };
  },
};
