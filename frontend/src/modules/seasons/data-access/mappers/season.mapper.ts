import type {
  SeasonEvent,
  SeasonDetail,
  SeasonResult,
  SeasonSource,
  SeasonSummary,
  SeasonRelation,
  SeasonResource,
  SeasonRouteColor,
  SeasonParticipant,
  SeasonRouteMembership,
} from '../../domain';

type JsonRecord = Record<string, unknown>;

function record(value: unknown): JsonRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as JsonRecord) : {};
}

function list(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function text(...values: unknown[]) {
  const value = values.find((item) => typeof item === 'string' && item.trim().length > 0);
  return typeof value === 'string' ? value.trim() : '';
}

function scalarText(...values: unknown[]) {
  const value = values.find(
    (item) =>
      (typeof item === 'string' && item.trim().length > 0) ||
      typeof item === 'number' ||
      typeof item === 'bigint'
  );
  return value === undefined ? '' : String(value).trim();
}

function scoreText(...values: unknown[]) {
  const value = scalarText(...values);
  if (!/^-?\d+\.\d+$/.test(value)) return value;
  return value.replace(/(\.\d*?[1-9])0+$|\.0+$/, '$1');
}

function number(value: unknown, fallback = 0) {
  const normalized = Number(value);
  return Number.isFinite(normalized) ? normalized : fallback;
}

function identifier(dto: JsonRecord, fallback: string) {
  return typeof dto.id === 'number' || typeof dto.id === 'string' ? dto.id : fallback;
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  const normalized = text(value).toLocaleLowerCase('en');
  return allowed.includes(normalized as T) ? (normalized as T) : fallback;
}

export function unwrapSeasonResults(payload: unknown) {
  if (Array.isArray(payload)) return payload;
  return list(record(payload).results);
}

export function normalizeSeasonSummary(value: unknown): SeasonSummary {
  const dto = record(value);
  const slug = text(dto.slug, dto.key, dto.id);
  return {
    id: identifier(dto, slug),
    slug,
    title: text(dto.title, dto.name, slug),
    summary: text(dto.summary, dto.description),
    startsOn: text(dto.starts_on, dto.start_date) || undefined,
    endsOn: text(dto.ends_on, dto.end_date) || undefined,
    status: oneOf(
      dto.publication_status ?? dto.status,
      ['draft', 'published', 'archived'] as const,
      'published'
    ),
    verificationStatus: oneOf(
      dto.verification_status,
      ['pending', 'verified', 'unverified', 'disputed'] as const,
      'pending'
    ),
    verifiedAt: text(dto.verified_at) || undefined,
    featured: Boolean(dto.is_featured ?? dto.featured ?? dto.is_current),
    eventCount: number(dto.event_count ?? dto.events_count ?? list(dto.events).length),
  };
}

function normalizeRouteMembership(value: unknown): SeasonRouteMembership {
  const dto = record(value);
  const route = record(dto.route);
  return {
    routeCode: text(dto.route_code, route.code, dto.code),
    order: number(dto.order ?? dto.node_order),
    nodeStyle: oneOf(dto.node_style, ['default', 'final', 'training'] as const, 'default'),
    label: text(dto.label) || undefined,
  };
}

function normalizeResource(value: unknown, index: number): SeasonResource {
  const dto = record(value);
  const rawType = text(dto.resource_type, dto.type);
  const typeAliases: Record<string, SeasonResource['type']> = {
    official_page: 'official',
    tasks: 'problems',
    videos: 'video',
    mirror: 'other',
  };
  const type =
    typeAliases[rawType] ??
    oneOf(
      rawType,
      [
        'official',
        'announcement',
        'schedule',
        'rules',
        'registration',
        'platform',
        'participants',
        'problems',
        'editorial',
        'scoreboard',
        'results',
        'video',
        'photos',
        'other',
      ] as const,
      'other'
    );
  const url = text(dto.url, dto.href, dto.external_url);
  return {
    id: identifier(dto, `${type}-${index}-${url}`),
    type,
    title: text(dto.title, dto.label, dto.name),
    url,
    official: Boolean(dto.is_official ?? dto.official),
    order: number(dto.order ?? dto.sort_order, index),
  };
}

function normalizeSource(value: unknown, index: number): SeasonSource {
  const dto = record(value);
  const url = text(dto.url, dto.href);
  return {
    id: identifier(dto, `source-${index}-${url}`),
    type: text(dto.source_type, dto.type, 'other'),
    title: text(dto.title, dto.publisher, 'Manba'),
    url,
    publisher: text(dto.publisher) || undefined,
    accessedOn: text(dto.accessed_on) || undefined,
    primary: Boolean(dto.is_primary ?? dto.primary),
    notes: text(dto.notes) || undefined,
  };
}

function normalizeResult(value: unknown, index: number): SeasonResult {
  const dto = record(value);
  const participant = record(dto.participant);
  const team = record(dto.team);
  const medal = record(dto.medal);
  const rawAward = text(dto.award_title, dto.award, dto.medal, medal.label, medal.name);
  return {
    id: identifier(dto, `result-${index}`),
    participantId:
      typeof participant.id === 'number' || typeof participant.id === 'string'
        ? participant.id
        : undefined,
    participantSlug: text(participant.slug) || undefined,
    participantName: text(
      dto.participant_name,
      dto.full_name,
      participant.full_name,
      participant.name,
      dto.name
    ),
    teamName: text(dto.team_name, team.name) || undefined,
    teamMembers: list(team.members)
      .map((item) => {
        const member = record(item);
        const person = record(member.participant);
        return text(person.full_name, person.name, member.name);
      })
      .filter(Boolean),
    countryCode: text(dto.country_code, participant.country_code, team.country_code) || undefined,
    school: text(dto.school, participant.school) || undefined,
    region: text(dto.region, participant.region) || undefined,
    rank: scalarText(dto.rank, dto.place) || undefined,
    score: scoreText(dto.score, dto.points, dto.score_label) || undefined,
    award: rawAward && rawAward.toLocaleLowerCase('en') !== 'none' ? rawAward : undefined,
    category: text(dto.category, dto.division) || undefined,
    local: Boolean(dto.is_local ?? dto.local ?? dto.country_code === 'UZB'),
    sourceUrl: text(dto.source_url, dto.result_url) || undefined,
  };
}

export function normalizeSeasonParticipant(payload: unknown): SeasonParticipant {
  const dto = record(payload);
  return {
    id: identifier(dto, text(dto.slug, dto.full_name)),
    slug: text(dto.slug),
    fullName: text(dto.full_name, dto.name),
    aliases: list(dto.aliases)
      .map((alias) => text(alias))
      .filter(Boolean),
    countryCode: text(dto.country_code) || undefined,
    region: text(dto.region) || undefined,
    school: text(dto.school) || undefined,
    bio: text(dto.bio) || undefined,
    photoUrl: text(dto.photo_url) || undefined,
    platformAccounts: list(dto.platform_accounts)
      .map((accountValue, index) => {
        const account = record(accountValue);
        return {
          id: identifier(account, `account-${index}`),
          platform: text(account.platform, 'other'),
          platformLabel: text(account.platform_label, account.title, account.platform),
          handle: text(account.handle),
          url: text(account.url),
          title: text(account.title) || undefined,
          verified: Boolean(account.is_verified),
          order: number(account.order, index),
        };
      })
      .filter((account) => account.handle && account.url)
      .sort((left, right) => left.order - right.order),
    results: list(dto.season_results).map((resultValue, index) => {
      const result = record(resultValue);
      const rawAward = text(result.award_title, result.medal);
      return {
        id: identifier(result, `participant-result-${index}`),
        eventSlug: text(result.event_slug),
        eventTitle: text(result.event_title),
        eventShortTitle: text(result.event_short_title) || undefined,
        eventStartDate: text(result.event_start_date) || undefined,
        eventEndDate: text(result.event_end_date) || undefined,
        rank: scalarText(result.rank) || undefined,
        score: scoreText(result.score, result.score_label) || undefined,
        award: rawAward && rawAward !== 'none' ? rawAward : undefined,
        category: text(result.category) || undefined,
        sourceUrl: text(result.result_url) || undefined,
      };
    }),
  };
}

export function normalizeSeasonEvent(value: unknown): SeasonEvent {
  const dto = record(value);
  const slug = text(dto.slug, dto.code, dto.id);
  const startDate = text(dto.start_date, dto.starts_on) || undefined;
  const endDate = text(dto.end_date, dto.ends_on) || undefined;
  const datePrecision = oneOf(
    dto.date_precision,
    ['tba', 'month', 'day', 'range'] as const,
    startDate ? (endDate && endDate !== startDate ? 'range' : 'day') : 'tba'
  );
  return {
    id: identifier(dto, slug),
    slug,
    code: text(dto.code, dto.short_code),
    title: text(dto.title, dto.name, slug),
    shortTitle: text(dto.short_title, dto.title, dto.name, slug),
    summary: text(dto.summary, dto.short_description),
    description: text(dto.description, dto.details, dto.summary),
    type: oneOf(
      dto.event_type ?? dto.type,
      ['stage', 'selection', 'training', 'international', 'unofficial'] as const,
      'stage'
    ),
    status: oneOf(
      dto.event_status ?? dto.status,
      ['tba', 'scheduled', 'live', 'completed', 'postponed', 'cancelled'] as const,
      datePrecision === 'tba' ? 'tba' : 'scheduled'
    ),
    datePrecision,
    startDate,
    endDate,
    dateLabel: text(dto.date_label, dto.display_date),
    timezone: text(dto.timezone) || undefined,
    monthKey: text(dto.month_key) || startDate?.slice(0, 7) || undefined,
    location: text(dto.location_name, dto.location) || undefined,
    venue: text(dto.venue) || undefined,
    mode: text(dto.mode, dto.format) || undefined,
    platform: text(dto.platform, dto.contest_platform) || undefined,
    organizer: text(dto.organizer, dto.organizer_name) || undefined,
    eligibility: text(dto.eligibility, dto.participant_requirements) || undefined,
    gradeMin:
      dto.grade_min === null || dto.grade_min === undefined ? undefined : number(dto.grade_min),
    gradeMax:
      dto.grade_max === null || dto.grade_max === undefined ? undefined : number(dto.grade_max),
    verificationStatus: oneOf(
      dto.verification_status,
      ['pending', 'verified', 'unverified', 'disputed'] as const,
      'pending'
    ),
    verifiedAt: text(dto.verified_at) || undefined,
    order: number(dto.order ?? dto.sort_order),
    routeMemberships: list(dto.route_memberships ?? dto.routes).map(normalizeRouteMembership),
    resources: list(dto.resources).map(normalizeResource),
    sources: list(dto.sources).map(normalizeSource),
    results: list(dto.results ?? dto.local_results).map(normalizeResult),
  };
}

function normalizeRelation(value: unknown, index: number): SeasonRelation {
  const dto = record(value);
  const fromEvent = record(dto.from_event);
  const toEvent = record(dto.to_event);
  return {
    id: identifier(dto, `relation-${index}`),
    fromEventCode: text(dto.from_event_code, fromEvent.code, dto.source),
    toEventCode: text(dto.to_event_code, toEvent.code, dto.target),
    relationType: oneOf(
      dto.relation_type ?? dto.type,
      ['qualifies_to', 'feeds_into', 'training_for', 'related_to'] as const,
      'related_to'
    ),
    routeCode: text(dto.route_code, record(dto.route).code) || undefined,
    lineStyle: oneOf(dto.line_style, ['solid', 'dashed', 'dotted'] as const, 'solid'),
    label: text(dto.label) || undefined,
  };
}

export function normalizeSeasonDetail(value: unknown): SeasonDetail {
  const dto = record(value);
  const summary = normalizeSeasonSummary(dto);
  return {
    ...summary,
    routes: list(dto.routes)
      .map((item) => {
        const route = record(item);
        const code = text(route.code, route.slug, route.id);
        return {
          id: identifier(route, code),
          code,
          title: text(route.title, route.name, code),
          description: text(route.description, route.summary),
          kind: oneOf(
            route.kind,
            ['official', 'selection', 'international', 'unofficial', 'training'] as const,
            'official'
          ),
          color: oneOf(
            route.color,
            ['blue', 'red', 'brown', 'teal', 'gold', 'purple', 'green', 'neutral'] as const,
            'blue'
          ) as SeasonRouteColor,
          lineStyle: oneOf(route.line_style, ['solid', 'dashed', 'dotted'] as const, 'solid'),
          icon: text(route.icon) || undefined,
          logoUrl: text(route.logo_url, route.logo) || undefined,
          order: number(route.order ?? route.sort_order),
        };
      })
      .sort((left, right) => left.order - right.order),
    events: list(dto.events).map(normalizeSeasonEvent),
    relations: list(dto.relations ?? dto.edges).map(normalizeRelation),
    lastVerifiedAt: text(dto.last_verified_at, dto.verified_at) || undefined,
  };
}
