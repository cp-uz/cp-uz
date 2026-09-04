import type { ApiSchema } from '../src/shared/api/generated';

import { describe, expect, it } from 'vitest';

import {
  normalizeArticle,
  normalizeStats,
} from '../src/modules/learning/data-access/mappers/learning.mapper';
import {
  normalizeSeasonDetail,
  normalizeSeasonParticipant,
} from '../src/modules/seasons/data-access/mappers/season.mapper';
import { mapProblemDetail } from '../src/modules/problems/data-access/problem.repository';

const article: ApiSchema<'ArticleDetail'> = {
  id: 'article-id',
  slug: 'algebra--euclid',
  canonical_path: 'algebra/euclid',
  canonical_url: '/algo/algebra/euclid/',
  asset_base_url: '/media/content/algebra/',
  title: 'Evklid algoritmi',
  summary: 'Eng katta umumiy bo‘luvchi',
  category: { name: 'Algebra', slug: 'algebra' },
  difficulty: 'intermediate',
  estimated_reading_minutes: 7,
  updated_at: '2026-09-01T00:00:00Z',
  tags: [],
  content: '# Evklid',
  content_hash: 'hash',
  status: 'draft',
  contributors: [
    {
      role: 'translator',
      role_label: 'Tarjimon',
      user: {
        id: 1,
        username: 'author',
        first_name: '',
        last_name: '',
        name: 'Ko‘rinadigan ism',
        avatar_url: '',
        github_url: '',
        is_guest: false,
      },
    },
  ],
  practice_references: [
    {
      id: 1,
      platform: 'codeforces',
      platform_name: 'Codeforces',
      title: 'Problem',
      url: 'https://example.com/problem',
      difficulty_label: '1600',
      level: 'challenge',
      level_label: 'Murakkab sinov',
      note: 'Mashq',
      order: 0,
    },
  ],
  prerequisites: [],
  previous_article: null,
  next_article: null,
  related_articles: [],
  russian_source_url: null,
  review_state: {
    technical_approved: false,
    language_approved: true,
    fully_reviewed: false,
    content_hash: 'hash',
    latest: { technical: { decision: 'changes_requested', created_at: '2026-09-01T00:00:00Z' } },
  },
};

const event: ApiSchema<'EventGraph'> = {
  id: 'event-id',
  code: 'IOI',
  slug: 'ioi',
  title: 'IOI',
  type: 'international',
  date_precision: 'tba',
  event_status: 'tba',
  start_date: null,
  end_date: null,
  route_memberships: [],
  resources: [],
  sources: [],
  results: [],
};

describe('generated API DTO mappings', () => {
  it('uses backend contributor display name, numeric difficulty label and latest review decision', () => {
    const mapped = normalizeArticle(article);
    expect(mapped.slug).toBe('euclid');
    expect(mapped.sourceId).toBe('algebra--euclid');
    expect(mapped.contributors?.[0].name).toBe('Ko‘rinadigan ism');
    expect(mapped.practiceReferences?.[0].difficulty).toBe('1600');
    expect(mapped.reviewState).toEqual({
      technical: 'changes_requested',
      language: 'approved',
      isPublished: false,
    });
  });

  it('does not infer fields that the backend never supplies', () => {
    const mapped = normalizeArticle(article);
    expect(mapped.publicPath).toBeUndefined();
    expect(mapped.revisions).toEqual([]);
    expect(() =>
      normalizeArticle({ ...article, tags: undefined } as unknown as ApiSchema<'ArticleDetail'>)
    ).toThrow();
  });

  it('maps public stats using the documented editorial object', () => {
    expect(
      normalizeStats({
        articles: 10,
        categories: 2,
        practice_references: 4,
        full_translations: 8,
        synopsis_drafts: 2,
        editorial: { draft: 6, in_review: 1, published: 3 },
      })
    ).toEqual({
      articleCount: 10,
      categoryCount: 2,
      practiceReferenceCount: 4,
      publishedCount: 3,
      draftCount: 6,
      fullDraftCount: 8,
      synopsisCount: 2,
    });
  });

  it('handles nullable individual/team result subjects and preserves decimal scores', () => {
    const season: ApiSchema<'SeasonGraph'> = {
      id: 'season-id',
      slug: '2026-2027',
      title: 'Season',
      start_date: '2026-09-01',
      end_date: '2027-08-31',
      routes: [],
      edges: [],
      events: [
        {
          ...event,
          results: [
            {
              id: 'result-id',
              participant: null,
              team: {
                id: 'team-id',
                name: 'Team',
                members: [],
                country_code: 'UZB',
                school: 'School',
              },
              rank: 0,
              score: '0.000',
              medal: 'none',
            },
          ],
        },
      ],
    };
    const mapped = normalizeSeasonDetail(season);
    expect(mapped.eventCount).toBe(1);
    expect(mapped.events[0].results[0]).toMatchObject({
      participantName: '',
      teamName: 'Team',
      school: 'School',
      rank: '0',
      score: '0',
    });
    expect(mapped.events[0].startDate).toBeUndefined();
    expect(mapped.events[0].results[0].award).toBeUndefined();
  });

  it('maps participant aliases/accounts and nullable event dates', () => {
    const dto: ApiSchema<'ParticipantDetail'> = {
      id: 'participant-id',
      slug: 'person',
      full_name: 'Person',
      aliases: ['Alias'],
      platform_accounts: [],
      season_results: [
        {
          id: 'result-id',
          event_slug: 'ioi',
          event_title: 'IOI',
          event_short_title: '',
          event_start_date: null,
          event_end_date: null,
          score: '123.450',
        },
      ],
    };
    const mapped = normalizeSeasonParticipant(dto);
    expect(mapped.aliases).toEqual(['Alias']);
    expect(mapped.results[0].score).toBe('123.45');
    expect(mapped.results[0].eventStartDate).toBeUndefined();
  });

  it('maps problem navigation and PDF metadata without coercing null limits to zero', () => {
    const dto: ApiSchema<'ProblemDetail'> = {
      id: 'problem-id',
      slug: 'problem',
      code: 'A',
      title: 'Problem',
      translation_status_label: 'AI-tarjima',
      problem_type_label: 'Standart',
      statement_markdown: '# Problem',
      source_path: 'problems/statement.md',
      statement_pdf: {
        url: '/api/v1/problems/pdf',
        source_url: 'https://example.com/pdf',
        sha256: 'hash',
        size_bytes: 100,
        page_count: 2,
        language: 'uz',
        provenance: 'official',
        provenance_label: 'Rasmiy',
      },
      last_verified_on: null,
      time_limit_ms: null,
      memory_limit_mb: null,
      max_score: '100.00',
      tags: [],
      links: [],
      attachments: [],
      problem_set: { slug: 'day-1', title: 'Day1', date_label: '', order: 0 },
      season: {
        slug: '2026-2027',
        title: 'Season',
        start_date: '2026-09-01',
        end_date: '2027-08-31',
      },
      event,
      sets: [],
    };
    const mapped = mapProblemDetail(dto);
    expect(mapped.timeLimitMs).toBeUndefined();
    expect(mapped.maxScore).toBe('100.00');
    expect(mapped.statementPdf).toMatchObject({
      pageCount: 2,
      provenance: 'official',
      language: 'uz',
    });
  });
});
