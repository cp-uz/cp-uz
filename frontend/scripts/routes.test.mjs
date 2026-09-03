import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

import { appRoutes, appRoutePatterns } from '../src/shared/config/routes.ts';

test('public routes have one canonical source of truth', () => {
  assert.deepEqual(
    {
      dictionary: appRoutes.dictionary,
      algorithms: appRoutes.algorithms,
      tasks: appRoutes.tasks,
      seasons: appRoutes.seasons,
      saved: appRoutes.saved,
      roadmap: appRoutes.roadmap,
      login: appRoutes.login,
      profile: appRoutes.profile,
      article: appRoutes.article,
    },
    {
      dictionary: '/dict',
      algorithms: '/algo',
      tasks: '/tasks',
      seasons: '/seasons',
      saved: '/saved',
      roadmap: '/roadmap',
      login: '/login',
      profile: '/profile',
      article: '/article',
    }
  );

  assert.equal(appRoutes.algorithm('graph', 'dfs'), '/algo/graph/dfs');
  assert.equal(appRoutes.algorithmCategory('graphs'), '/algo/graphs');
  assert.equal(appRoutePatterns.algorithmCategory, '/algo/:category');
  assert.equal(appRoutes.task('2025-2026', 'izho-2026', 'game'), '/tasks/2025-2026/izho-2026/game');
  assert.equal(appRoutes.seasonEvent('2025-2026', 'izho-2026'), '/seasons/2025-2026/izho-2026');
  assert.equal(appRoutePatterns.task, '/tasks/:seasonSlug/:eventSlug/:problemSlug');
});

test('router uses canonical route constants and exposes no legacy redirects', () => {
  const source = readFileSync(
    new URL('../src/app/providers/router/config/routes.tsx', import.meta.url),
    'utf8'
  );

  assert.match(source, /path: appRoutes\.algorithms/);
  assert.match(source, /path: appRoutePatterns\.algorithmCategory/);
  assert.match(source, /path: appRoutePatterns\.task/);
  assert.doesNotMatch(
    source,
    /algoritmlar|masalalar|maqola|yol-xaritasi|lugat|saqlanganlar|SectionRedirect|LegacyRedirect/
  );
});
