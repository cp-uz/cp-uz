import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { roadmapStages } from '../src/modules/learning/domain/constants/roadmap.ts';

const exportUrl = new URL('../../content/exports/articles.v1.json', import.meta.url);
const corpus = JSON.parse(await readFile(exportUrl, 'utf8'));
const articlesById = new Map(corpus.articles.map((article) => [article.id, article]));

test('roadmap stages are ordered and prerequisite-safe', () => {
  assert.equal(roadmapStages.length, 10);
  assert.deepEqual(
    roadmapStages.map((stage) => stage.order),
    Array.from({ length: roadmapStages.length }, (_, index) => index + 1)
  );

  const stagesById = new Map(roadmapStages.map((stage) => [stage.id, stage]));
  assert.equal(stagesById.size, roadmapStages.length, 'stage ids must be unique');

  for (const stage of roadmapStages) {
    assert.match(stage.duration, /^\d+–\d+ hafta$/);
    assert.match(stage.objective, /^Maqsad: .+[.!?]$/);
    assert.ok(stage.description.length >= 80, `${stage.id}: description is too terse`);
    assert.ok(stage.articleSlugs.length >= 6, `${stage.id}: too few learning steps`);

    for (const prerequisiteId of stage.prerequisiteStageIds) {
      const prerequisite = stagesById.get(prerequisiteId);
      assert.ok(prerequisite, `${stage.id}: unknown prerequisite stage ${prerequisiteId}`);
      assert.ok(
        prerequisite.order < stage.order,
        `${stage.id}: prerequisite ${prerequisiteId} must come first`
      );
    }
  }
});

test('every roadmap reference resolves to one real corpus article', () => {
  const referencedIds = roadmapStages.flatMap((stage) => stage.articleSlugs);
  assert.equal(referencedIds.length, new Set(referencedIds).size, 'roadmap articles must be unique');

  for (const articleId of referencedIds) {
    const article = articlesById.get(articleId);
    assert.ok(article, `unresolved roadmap article: ${articleId}`);
    assert.ok(article.path?.endsWith('.md'), `${articleId}: canonical Markdown path is missing`);
    assert.ok(article.route?.endsWith('/index.html'), `${articleId}: canonical route is missing`);
    assert.ok(article.translation?.title?.trim(), `${articleId}: Uzbek title is missing`);
    assert.ok(article.translation?.idea?.trim(), `${articleId}: Uzbek summary is missing`);
    assert.ok(article.markdown?.trim(), `${articleId}: learning content is empty`);
  }
});

test('every roadmap lesson has a complete translated body', () => {
  const referenced = roadmapStages
    .flatMap((stage) => stage.articleSlugs)
    .map((articleId) => articlesById.get(articleId));
  assert.ok(
    referenced.every(
      (article) =>
        article.translation.scope === 'full_upstream_article' &&
        article.translation.full_prose_translated === true
    )
  );
});
