import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  normalizeSeasonDetail,
  normalizeSeasonParticipant,
} from '../src/modules/seasons/data-access/mappers/season.mapper.ts';
import {
  findCurrentSeasonEvent,
  formatSeasonLabel,
  formatSeasonNodeDate,
  seasonAwardPresentation,
  seasonEventPresentation,
  seasonTimelineSlotIndexes,
  shouldDeriveSeasonRouteConnections,
  sortedSeasonEvents,
} from '../src/modules/seasons/domain/season-presentation.ts';

const payload = {
  id: 'season-1',
  slug: '2026-2027',
  title: '2026–2027 mavsumi',
  summary: 'Saralashlar va xalqaro olimpiadalar.',
  start_date: '2026-09-01',
  end_date: '2027-09-19',
  verification_status: 'verified',
  verified_at: '2026-09-01T08:00:00Z',
  is_featured: true,
  routes: [
    {
      id: 'route-1',
      code: 'ioi',
      title: 'IOI yo‘nalishi',
      kind: 'selection',
      color: 'blue',
      line_style: 'solid',
      icon: 'solar:diploma-linear',
      order: 1,
    },
  ],
  events: [
    {
      id: 'event-ioi',
      code: 'G1',
      slug: 'ioi-2027',
      title: 'IOI 2027',
      short_title: 'IOI',
      type: 'international',
      event_status: 'scheduled',
      date_precision: 'range',
      start_date: '2027-09-12',
      end_date: '2027-09-19',
      order: 20,
      route_memberships: [{ route_code: 'ioi', order: 20, node_style: 'final' }],
      resources: [{ id: 1, type: 'official_page', title: 'IOI', url: 'https://ioi2027.de' }],
      results: [],
    },
    {
      id: 'event-school',
      code: '1',
      slug: 'maktab-bosqichi',
      title: 'Maktab bosqichi',
      short_title: 'Maktab',
      type: 'stage',
      event_status: 'tba',
      date_precision: 'tba',
      order: 1,
      route_memberships: [{ route_code: 'ioi', order: 1, node_style: 'default' }],
      resources: [],
      results: [
        {
          id: 1,
          rank: 1,
          score: '493.100',
          score_label: 'A: 120.0 · B: 173.1 · C: 200',
          medal: 'gold',
          is_local: true,
          participant: {
            id: 'person-1',
            slug: 'test-ishtirokchi',
            full_name: 'Test Ishtirokchi',
            country_code: 'UZB',
          },
        },
        {
          id: 2,
          rank: 2,
          medal: 'none',
          is_local: true,
          participant: { full_name: 'Medalsiz Ishtirokchi', country_code: 'UZB' },
        },
        {
          id: 3,
          rank: 3,
          medal: 'honourable_mention',
          is_local: true,
          participant: { full_name: 'Faxriy Ishtirokchi', country_code: 'UZB' },
        },
      ],
    },
  ],
  edges: [
    {
      id: 'edge-1',
      from_event_code: '1',
      to_event_code: 'G1',
      route_code: 'ioi',
      relation_type: 'qualifies_to',
      line_style: 'dashed',
    },
  ],
};

test('season DTO graph, resources, numeric results and edges are normalized', () => {
  const season = normalizeSeasonDetail(payload);
  assert.equal(season.slug, '2026-2027');
  assert.equal(season.routes[0].icon, 'solar:diploma-linear');
  assert.equal(season.verificationStatus, 'verified');
  assert.equal(season.events[0].resources[0].type, 'official');
  assert.equal(season.events[1].results[0].rank, '1');
  assert.equal(season.events[1].results[0].participantSlug, 'test-ishtirokchi');
  assert.equal(season.events[1].results[0].score, '493.1');
  assert.equal(season.events[1].results[1].award, undefined);
  assert.equal(season.events[1].results[2].award, 'honourable_mention');
  assert.equal(season.relations[0].fromEventCode, '1');
  assert.equal(season.relations[0].lineStyle, 'dashed');
  assert.equal(shouldDeriveSeasonRouteConnections(season, 'ioi'), false);
  assert.equal(shouldDeriveSeasonRouteConnections(season, 'training'), true);
  assert.equal(
    seasonEventPresentation(season.events[0], season.routes[0]).label,
    'Xalqaro olimpiada'
  );
  assert.equal(seasonEventPresentation(season.events[0], season.routes[0]).color, '#A87308');
  assert.equal(formatSeasonNodeDate(season.events[0]), '12–19 sen');
  assert.equal(formatSeasonNodeDate(season.events[1]), 'TBA');
});

test('compact node dates include same-month and cross-month ranges', () => {
  const season = normalizeSeasonDetail(payload);
  const event = season.events[0];
  assert.equal(
    formatSeasonNodeDate({ ...event, startDate: '2026-08-09', endDate: '2026-08-16' }),
    '9–16 avg'
  );
  assert.equal(
    formatSeasonNodeDate({ ...event, startDate: '2026-01-28', endDate: '2026-02-02' }),
    '28 yan – 2 fev'
  );
});

test('new season keeps ordered TBA stages before a dated international final', () => {
  const season = normalizeSeasonDetail(payload);
  assert.deepEqual(
    sortedSeasonEvents(season).map((event) => event.code),
    ['1', 'G1']
  );
  assert.equal(findCurrentSeasonEvent(season, new Date('2026-09-01T00:00:00Z'))?.code, '1');
});

test('events with the same start date share one timeline row while TBA stays separate', () => {
  const season = normalizeSeasonDetail(payload);
  const datedEvent = season.events[0];
  const sameDateEvent = { ...datedEvent, id: 'same-date', code: 'G2', slug: 'same-date' };
  const { slotByEvent, slotCount } = seasonTimelineSlotIndexes([
    season.events[1],
    datedEvent,
    sameDateEvent,
  ]);

  assert.equal(slotByEvent.get(datedEvent.id), slotByEvent.get(sameDateEvent.id));
  assert.notEqual(slotByEvent.get(season.events[1].id), slotByEvent.get(datedEvent.id));
  assert.equal(slotCount, 2);
});

test('an ended season opens its latest dated completed event instead of stale TBA', () => {
  const endedPayload = {
    ...payload,
    end_date: '2026-08-31',
    events: payload.events.map((event) =>
      event.code === 'G1'
        ? {
            ...event,
            event_status: 'completed',
            start_date: '2026-08-09',
            end_date: '2026-08-16',
          }
        : event
    ),
  };
  const season = normalizeSeasonDetail(endedPayload);
  assert.equal(findCurrentSeasonEvent(season, new Date('2026-09-01T00:00:00Z'))?.code, 'G1');
});

test('result rows use aligned accessible medal tooltips without visible labels', () => {
  const detailSource = readFileSync(
    new URL('../src/modules/seasons/ui/shared/SeasonEventDetail.tsx', import.meta.url),
    'utf8'
  );
  const dialogSource = readFileSync(
    new URL('../src/modules/seasons/ui/shared/SeasonParticipantDialog.tsx', import.meta.url),
    'utf8'
  );
  const awardSource = readFileSync(
    new URL('../src/modules/seasons/ui/shared/SeasonAwardIcon.tsx', import.meta.url),
    'utf8'
  );
  assert.match(detailSource, /sm: '38px minmax\(0, 1fr\) 24px 72px 20px'/);
  assert.match(detailSource, /fontVariantNumeric: 'tabular-nums'/);
  assert.match(
    detailSource,
    /<SeasonAwardIcon award=\{result\.award\} size=\{18\} reserveSpace \/>/
  );
  assert.match(
    dialogSource,
    /<SeasonAwardIcon award=\{result\.award\} size=\{24\} focusable=\{false\} reserveSpace \/>/
  );
  assert.match(awardSource, /<Tooltip title=\{presentation\.label\} arrow>/);
  assert.match(awardSource, /tabIndex=\{focusable \? 0 : undefined\}/);
  assert.match(awardSource, /aria-label=\{presentation\.label\}/);
  assert.doesNotMatch(detailSource, /function (?:formatAward|awardPresentation)/);
  assert.doesNotMatch(dialogSource, /function (?:awardLabel|awardColor)/);
});

test('participant dialog stays roomy while platform accounts remain compact on mobile', () => {
  const dialogSource = readFileSync(
    new URL('../src/modules/seasons/ui/shared/SeasonParticipantDialog.tsx', import.meta.url),
    'utf8'
  );

  assert.match(dialogSource, /m: \{ xs: 1\.25, sm: 2 \}/);
  assert.match(dialogSource, /width: \{ xs: 'calc\(100% - 20px\)', sm: 'calc\(100% - 32px\)' \}/);
  assert.match(dialogSource, /px: \{ xs: 2, sm: 3 \}/);
  assert.match(dialogSource, /minHeight: 56/);
  assert.match(dialogSource, /gridTemplateColumns: '28px minmax\(0, 1fr\) 14px'/);
  assert.match(
    dialogSource,
    /UZB: \{ label: 'O‘zbekiston', src: '\/assets\/countries\/uz\.svg' \}/
  );
  assert.match(dialogSource, /src=\{country\.src\}/);
  assert.match(dialogSource, /alt=\{country\.label\}/);
  assert.doesNotMatch(dialogSource, /label=\{participant\.countryCode\}/);
  assert.match(
    dialogSource,
    /const PARTICIPANT_AVATAR_FALLBACK = '\/assets\/seasons\/participants\/participant-avatar\.svg'/
  );
  assert.match(dialogSource, /src=\{participant\.photoUrl \|\| PARTICIPANT_AVATAR_FALLBACK\}/);
  assert.doesNotMatch(dialogSource, /function initials/);
});

test('award presentation unifies medals and both honourable mention spellings', () => {
  assert.equal(seasonAwardPresentation('gold')?.label, 'Oltin medal');
  assert.equal(seasonAwardPresentation('bronze')?.label, 'Bronza medal');
  assert.equal(seasonAwardPresentation('honourable_mention')?.label, 'Faxriy e’tirof');
  assert.deepEqual(
    seasonAwardPresentation('honorable mention'),
    seasonAwardPresentation('honourable_mention')
  );
  assert.equal(seasonAwardPresentation('participation'), undefined);
  assert.equal(seasonAwardPresentation('Ishtirokchi'), undefined);
  assert.equal(seasonAwardPresentation('Maxsus sovrin')?.label, 'Maxsus sovrin');
});

test('shared season selector owns season labels and both dropdown consumers use it', () => {
  const pageSource = readFileSync(
    new URL('../src/modules/seasons/ui/pages/SeasonPage/SeasonPage.tsx', import.meta.url),
    'utf8'
  );
  const previewSource = readFileSync(
    new URL('../src/modules/seasons/ui/shared/SeasonPreview.tsx', import.meta.url),
    'utf8'
  );
  const selectorSource = readFileSync(
    new URL('../src/modules/seasons/ui/shared/SeasonSelector.tsx', import.meta.url),
    'utf8'
  );

  assert.equal(formatSeasonLabel('2025-2026'), '2025–2026');
  assert.equal(formatSeasonLabel('archive'), 'archive');
  assert.match(pageSource, /<SeasonSelector/);
  assert.match(previewSource, /<SeasonSelector/);
  assert.doesNotMatch(pageSource, /<MenuItem/);
  assert.doesNotMatch(previewSource, /<MenuItem/);
  assert.match(selectorSource, /formatSeasonLabel\(season\.slug\)/);
});

test('global navigation promotes the current season and moves glossary beside saved items', () => {
  const source = readFileSync(
    new URL('../src/app/layouts/LearningLayout.tsx', import.meta.url),
    'utf8'
  );
  const navItemsSource = source.match(/const navItems = \[([\s\S]*?)\];/)?.[1] || '';
  const utilityItemsSource = source.match(/const utilityItems = \[([\s\S]*?)\];/)?.[1] || '';

  assert.match(navItemsSource, /to: '\/seasons\/2026-2027'/);
  assert.match(navItemsSource, /label: 'Olimpiada mavsumi'/);
  assert.ok(
    navItemsSource.indexOf("to: '/seasons/2026-2027'") <
      navItemsSource.indexOf("to: '/algoritmlar'")
  );
  assert.doesNotMatch(navItemsSource, /to: '\/lugat'/);
  assert.match(utilityItemsSource, /glossaryItem/);
  assert.match(source, /<Tooltip title="Lug‘at">[\s\S]*?to="\/lugat"/);
  assert.ok(
    source.indexOf('<Tooltip title="Lug‘at">') < source.indexOf('<Tooltip title="Saqlanganlar">')
  );
  assert.match(source, /const footerItems = \[\.\.\.navItems, glossaryItem\]/);
});

test('selected timeline nodes keep an opaque surface above route lines', () => {
  const source = readFileSync(
    new URL('../src/modules/seasons/ui/shared/SeasonEventNode.tsx', import.meta.url),
    'utf8'
  );
  assert.match(source, /bgcolor: theme\.vars\.palette\.background\.paper/);
  assert.match(source, /boxShadow: selected/);
  assert.doesNotMatch(source, /bgcolor: selected \? alpha/);
});

test('official and independent season finals use local brand assets', () => {
  const source = readFileSync(
    new URL('../src/modules/seasons/ui/shared/SeasonRouteMark.tsx', import.meta.url),
    'utf8'
  );
  assert.match(source, /G2: '\/assets\/seasons\/izho\.png'/);
  assert.match(source, /U1: '\/assets\/seasons\/vkoshp\.ico'/);
  assert.match(source, /U2: '\/assets\/seasons\/info1cup\.png'/);
});

test('season page starts from its first dated month and keeps mobile navigation compact', () => {
  const pageSource = readFileSync(
    new URL('../src/modules/seasons/ui/pages/SeasonPage/SeasonPage.tsx', import.meta.url),
    'utf8'
  );
  const timelineSource = readFileSync(
    new URL('../src/modules/seasons/ui/shared/SeasonTimeline.tsx', import.meta.url),
    'utf8'
  );
  const nodeSource = readFileSync(
    new URL('../src/modules/seasons/ui/shared/SeasonEventNode.tsx', import.meta.url),
    'utf8'
  );

  assert.doesNotMatch(pageSource, />Sport dasturlash mavsumi<\/Typography>/);
  assert.match(pageSource, /navigableMonthGroups\[0\]/);
  assert.match(timelineSource, /filter\(\(group\) => group\.key !== 'tba'\)/);
  assert.match(timelineSource, /Yo‘nalishlarni ko‘rish uchun yon tomonga suring/);
  assert.match(timelineSource, /compactTimeline \? 116 : 134/);
  assert.match(nodeSource, /const squareEventLogo = event\.code === 'G2'/);
});

test('landing preview selects a season and keeps independent contests off the main route', () => {
  const source = readFileSync(
    new URL('../src/modules/seasons/ui/shared/SeasonPreview.tsx', import.meta.url),
    'utf8'
  );
  assert.match(source, /Bosh sahifadagi olimpiada mavsumini tanlash/);
  assert.match(source, /route\.code\.toLocaleLowerCase\('en'\) === 'main'/);
  assert.match(source, /event\.type !== 'unofficial'/);
  assert.match(source, /event\.type !== 'training'/);
  assert.match(source, /EGOI, KhIMIO, APIO va mustaqil musobaqalar/);
  assert.doesNotMatch(source, />\s*Barcha yo‘llar\s*</);
  assert.doesNotMatch(source, /Mavsum finali/);
  assert.doesNotMatch(source, /badge: 'Keyingi'/);
  assert.doesNotMatch(source, /`Keyingi:/);
});

test('participant profile normalizes public accounts and season results', () => {
  const participant = normalizeSeasonParticipant({
    id: 'person-1',
    slug: 'test-ishtirokchi',
    full_name: 'Test Ishtirokchi',
    country_code: 'UZB',
    bio: 'Olimpiada ishtirokchisi.',
    platform_accounts: [
      {
        id: 'account-1',
        platform: 'codeforces',
        platform_label: 'Codeforces',
        handle: 'tester',
        url: 'https://codeforces.com/profile/tester',
        is_verified: true,
      },
    ],
    season_results: [
      {
        id: 'result-1',
        event_slug: 'ioi-2026',
        event_title: 'IOI 2026',
        rank: 12,
        score: '303.480',
        medal: 'silver',
      },
    ],
  });

  assert.equal(participant.slug, 'test-ishtirokchi');
  assert.equal(participant.platformAccounts[0].handle, 'tester');
  assert.equal(participant.platformAccounts[0].verified, true);
  assert.equal(participant.results[0].eventSlug, 'ioi-2026');
  assert.equal(participant.results[0].score, '303.48');

  const detailSource = readFileSync(
    new URL('../src/modules/seasons/ui/shared/SeasonEventDetail.tsx', import.meta.url),
    'utf8'
  );
  const dialogSource = readFileSync(
    new URL('../src/modules/seasons/ui/shared/SeasonParticipantDialog.tsx', import.meta.url),
    'utf8'
  );
  assert.match(detailSource, /setParticipantSlug\(result\.participantSlug/);
  assert.match(dialogSource, /Platformalar/);
  assert.match(dialogSource, /assets\/platforms\/codeforces\.png/);
  assert.match(dialogSource, /O‘rin/);
  assert.match(dialogSource, /Ball/);
  assert.doesNotMatch(dialogSource, /formatUzbekDate/);
  assert.match(dialogSource, /SeasonAwardIcon/);
  assert.match(dialogSource, /mavsumidagi natijalar/);
});
