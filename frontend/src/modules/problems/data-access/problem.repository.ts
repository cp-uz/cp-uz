import type { ApiSchema } from 'shared/api/generated';
import type {
  ProblemSet,
  ProblemEvent,
  ProblemDetail,
  ProblemSeason,
  ProblemCatalog,
  ProblemSummary,
  ProblemEventDetail,
} from '../domain';

import { publicRequest, resolveApiAssetUrl, optionalPublicRequest } from 'shared/api/http';

function mapSeason(dto: ApiSchema<'SeasonLink'>): ProblemSeason {
  return { title: dto.title, slug: dto.slug, startDate: dto.start_date, endDate: dto.end_date };
}

function mapEvent(
  dto: ApiSchema<'EventGraph'> | ApiSchema<'ProblemCatalogEventLink'>
): ProblemEvent {
  const graph = 'id' in dto ? dto : undefined;
  return {
    code: dto.code,
    slug: dto.slug,
    title: dto.title,
    shortTitle: dto.short_title || undefined,
    summary: dto.summary || undefined,
    description: graph?.description || undefined,
    status: dto.event_status || undefined,
    startDate: dto.start_date || undefined,
    endDate: dto.end_date || undefined,
    dateLabel: dto.date_label || undefined,
    location: graph?.location || undefined,
    venue: graph?.venue || undefined,
    mode: graph?.mode || undefined,
    organizer: graph?.organizer || undefined,
  };
}

export function mapProblemSummary(dto: ApiSchema<'ProblemSummary'>): ProblemSummary {
  return {
    id: dto.id,
    slug: dto.slug,
    code: dto.code,
    title: dto.title,
    originalTitle: dto.original_title || undefined,
    translationStatus: dto.translation_status ?? 'ai_translation',
    translationStatusLabel: dto.translation_status_label,
    problemType: dto.problem_type ?? 'standard',
    problemTypeLabel: dto.problem_type_label,
    rating: dto.rating ?? undefined,
    difficultyLabel: dto.difficulty_label || undefined,
    order: dto.order ?? 0,
  };
}

function mapSet(dto: ApiSchema<'ProblemSet'>): ProblemSet {
  return {
    id: dto.id,
    slug: dto.slug,
    title: dto.title,
    description: dto.description || undefined,
    dateLabel: dto.date_label || undefined,
    order: dto.order ?? 0,
    problems: dto.problems.map(mapProblemSummary),
  };
}

export function mapProblemDetail(dto: ApiSchema<'ProblemDetail'>): ProblemDetail {
  const pdf = dto.statement_pdf;
  return {
    ...mapProblemSummary(dto),
    statementMarkdown: dto.statement_markdown,
    sourcePath: dto.source_path,
    statementPdf: pdf
      ? {
          url: resolveApiAssetUrl(pdf.url),
          sha256: pdf.sha256,
          sizeBytes: pdf.size_bytes ?? undefined,
          pageCount: pdf.page_count ?? undefined,
          language: pdf.language === 'uz' || pdf.language === 'en' ? pdf.language : undefined,
          provenance: pdf.provenance || undefined,
          provenanceLabel: pdf.provenance_label || undefined,
        }
      : undefined,
    timeLimitMs: dto.time_limit_ms ?? undefined,
    memoryLimitMb: dto.memory_limit_mb ?? undefined,
    maxScore: dto.max_score ?? undefined,
    tags: dto.tags,
    lastVerifiedOn: dto.last_verified_on || undefined,
    links: dto.links.map((link) => ({
      id: link.id,
      kind: link.kind,
      kindLabel: link.kind_label,
      title: link.title,
      url: link.url,
      platform: link.platform || undefined,
      official: link.is_official ?? false,
      primary: link.is_primary ?? false,
      order: link.order ?? 0,
    })),
    attachments: dto.attachments.map((attachment) => ({
      id: attachment.id,
      title: attachment.title,
      url: attachment.url,
      contentType: attachment.content_type || undefined,
      sizeBytes: attachment.size_bytes ?? undefined,
      order: attachment.order ?? 0,
    })),
    problemSet: {
      slug: dto.problem_set.slug,
      title: dto.problem_set.title,
      dateLabel: dto.problem_set.date_label || undefined,
      order: dto.problem_set.order,
    },
    season: mapSeason(dto.season),
    event: mapEvent(dto.event),
    sets: dto.sets.map(mapSet),
  };
}

export const problemRepository = {
  async catalog(seasonSlug?: string): Promise<ProblemCatalog> {
    const suffix = seasonSlug ? '?season=' + encodeURIComponent(seasonSlug) : '';
    const dto = await publicRequest<ApiSchema<'ProblemCatalogResponse'>>(
      '/api/v1/problems/' + suffix
    );
    return {
      seasons: dto.seasons.map(mapSeason),
      events: dto.events.map((item) => ({
        season: mapSeason(item.season),
        event: mapEvent(item.event),
        sets: item.sets.map(mapSet),
        problemCount: item.problem_count,
      })),
    };
  },

  async event(seasonSlug: string, eventSlug: string): Promise<ProblemEventDetail | null> {
    const dto = await optionalPublicRequest<ApiSchema<'ProblemEventResponse'>>(
      '/api/v1/problems/' +
        encodeURIComponent(seasonSlug) +
        '/' +
        encodeURIComponent(eventSlug) +
        '/'
    );
    return dto
      ? { season: mapSeason(dto.season), event: mapEvent(dto.event), sets: dto.sets.map(mapSet) }
      : null;
  },

  async detail(
    seasonSlug: string,
    eventSlug: string,
    problemSlug: string
  ): Promise<ProblemDetail | null> {
    const dto = await optionalPublicRequest<ApiSchema<'ProblemDetail'>>(
      '/api/v1/problems/' +
        encodeURIComponent(seasonSlug) +
        '/' +
        encodeURIComponent(eventSlug) +
        '/' +
        encodeURIComponent(problemSlug) +
        '/'
    );
    return dto ? mapProblemDetail(dto) : null;
  },
};
