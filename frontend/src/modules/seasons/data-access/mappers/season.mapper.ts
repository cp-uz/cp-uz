import type { ApiSchema } from 'shared/api/generated';
import type {
  SeasonEvent,
  SeasonDetail,
  SeasonResult,
  SeasonSource,
  SeasonSummary,
  SeasonRelation,
  SeasonResource,
  SeasonParticipant,
  SeasonRouteMembership,
} from '../../domain';

function scoreText(value: string | null | undefined, label?: string): string | undefined {
  return (value ?? label)?.replace(/(\.\d*?[1-9])0+$|\.0+$/, '$1') || undefined;
}

export function normalizeSeasonSummary(
  dto: ApiSchema<'SeasonList'> | ApiSchema<'SeasonGraph'>
): SeasonSummary {
  return {
    id: dto.id,
    slug: dto.slug,
    title: dto.title,
    summary: dto.summary ?? '',
    startsOn: dto.start_date,
    endsOn: dto.end_date,
    // These read-only endpoints expose published seasons only.
    status: 'published',
    verificationStatus: dto.verification_status ?? 'unverified',
    verifiedAt: dto.verified_at || undefined,
    featured: dto.is_featured ?? false,
    eventCount: 'event_count' in dto ? dto.event_count : dto.events.length,
  };
}

function normalizeRouteMembership(dto: ApiSchema<'EventRoute'>): SeasonRouteMembership {
  return {
    routeCode: dto.route_code,
    order: dto.order ?? 0,
    nodeStyle: dto.node_style ?? 'default',
    label: dto.label || undefined,
  };
}

const resourceTypes: Record<ApiSchema<'SeasonResourceTypeEnum'>, SeasonResource['type']> = {
  official_page: 'official',
  announcement: 'announcement',
  schedule: 'schedule',
  rules: 'rules',
  registration: 'registration',
  platform: 'platform',
  participants: 'participants',
  tasks: 'problems',
  editorial: 'editorial',
  scoreboard: 'scoreboard',
  results: 'results',
  photos: 'photos',
  videos: 'video',
  mirror: 'other',
  other: 'other',
};

function normalizeResource(dto: ApiSchema<'EventResource'>): SeasonResource {
  return {
    id: dto.id,
    type: resourceTypes[dto.type],
    title: dto.title,
    url: dto.url,
    official: dto.is_official ?? false,
    order: dto.order ?? 0,
  };
}

function normalizeSource(
  dto: ApiSchema<'EventSource'> | ApiSchema<'EventSourceDetail'>
): SeasonSource {
  return {
    id: dto.id,
    type: dto.type,
    title: dto.title,
    url: dto.url,
    publisher: dto.publisher || undefined,
    accessedOn: dto.accessed_on || undefined,
    primary: dto.is_primary ?? false,
    notes: 'notes' in dto ? dto.notes || undefined : undefined,
  };
}

function normalizeResult(dto: ApiSchema<'ResultEntry'>): SeasonResult {
  const participant = dto.participant;
  const team = dto.team;
  const award = dto.award_title || dto.medal;
  return {
    id: dto.id,
    participantId: participant?.id,
    participantSlug: participant?.slug,
    participantName: participant?.full_name ?? '',
    teamName: team?.name,
    teamMembers: team?.members.map((member) => member.participant.full_name) ?? [],
    countryCode: participant?.country_code || team?.country_code || undefined,
    school: participant?.school || team?.school || undefined,
    region: participant?.region || undefined,
    rank: dto.rank == null ? undefined : String(dto.rank),
    score: scoreText(dto.score, dto.score_label),
    award: award === 'none' ? undefined : award,
    category: dto.category || undefined,
    local: dto.is_local ?? true,
    sourceUrl: dto.result_url || undefined,
  };
}

export function normalizeSeasonParticipant(dto: ApiSchema<'ParticipantDetail'>): SeasonParticipant {
  return {
    id: dto.id,
    slug: dto.slug,
    fullName: dto.full_name,
    aliases: dto.aliases,
    countryCode: dto.country_code || undefined,
    region: dto.region || undefined,
    school: dto.school || undefined,
    bio: dto.bio || undefined,
    photoUrl: dto.photo_url || undefined,
    platformAccounts: dto.platform_accounts
      .map((account) => ({
        id: account.id,
        platform: account.platform,
        platformLabel: account.platform_label,
        handle: account.handle,
        url: account.url,
        title: account.title || undefined,
        verified: account.is_verified ?? false,
        order: account.order ?? 0,
      }))
      .sort((left, right) => left.order - right.order),
    results: dto.season_results.map((result) => {
      const award = result.award_title || result.medal;
      return {
        id: result.id,
        eventSlug: result.event_slug,
        eventTitle: result.event_title,
        eventShortTitle: result.event_short_title || undefined,
        eventStartDate: result.event_start_date || undefined,
        eventEndDate: result.event_end_date || undefined,
        rank: result.rank == null ? undefined : String(result.rank),
        score: scoreText(result.score, result.score_label),
        award: award === 'none' ? undefined : award,
        category: result.category || undefined,
        sourceUrl: result.result_url || undefined,
      };
    }),
  };
}

export function normalizeSeasonEvent(
  dto: ApiSchema<'EventGraph'> | ApiSchema<'EventDetail'>
): SeasonEvent {
  const startDate = dto.start_date || undefined;
  return {
    id: dto.id,
    slug: dto.slug,
    code: dto.code,
    title: dto.title,
    shortTitle: dto.short_title || dto.title,
    summary: dto.summary ?? '',
    description: dto.description ?? '',
    type: dto.type,
    status: dto.event_status ?? 'tba',
    datePrecision: dto.date_precision ?? 'tba',
    startDate,
    endDate: dto.end_date || undefined,
    dateLabel: dto.date_label ?? '',
    timezone: dto.timezone || undefined,
    monthKey: startDate?.slice(0, 7),
    location: dto.location || undefined,
    venue: dto.venue || undefined,
    mode: dto.mode || undefined,
    platform: dto.platform || undefined,
    organizer: dto.organizer || undefined,
    eligibility: dto.eligibility || undefined,
    gradeMin: dto.grade_min ?? undefined,
    gradeMax: dto.grade_max ?? undefined,
    verificationStatus: dto.verification_status ?? 'unverified',
    verifiedAt: dto.verified_at || undefined,
    order: dto.order ?? 0,
    routeMemberships: dto.route_memberships.map(normalizeRouteMembership),
    resources: dto.resources.map(normalizeResource),
    sources: dto.sources.map(normalizeSource),
    results: dto.results.map(normalizeResult),
  };
}

function normalizeRelation(dto: ApiSchema<'EventEdge'>): SeasonRelation {
  return {
    id: dto.id,
    fromEventCode: dto.from_event_code,
    toEventCode: dto.to_event_code,
    relationType: dto.relation_type,
    routeCode: dto.route_code || undefined,
    lineStyle: dto.line_style ?? 'solid',
    label: dto.label || undefined,
  };
}

export function normalizeSeasonDetail(dto: ApiSchema<'SeasonGraph'>): SeasonDetail {
  return {
    ...normalizeSeasonSummary(dto),
    routes: dto.routes
      .map((route) => ({
        id: route.id,
        code: route.code,
        title: route.title,
        description: route.description ?? '',
        kind: route.kind,
        color: route.color ?? 'neutral',
        lineStyle: route.line_style ?? 'solid',
        icon: route.icon || undefined,
        order: route.order ?? 0,
      }))
      .sort((left, right) => left.order - right.order),
    events: dto.events.map(normalizeSeasonEvent),
    relations: dto.edges.map(normalizeRelation),
    lastVerifiedAt: dto.verified_at || undefined,
  };
}
