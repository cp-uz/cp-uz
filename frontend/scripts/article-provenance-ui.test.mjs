import assert from 'node:assert/strict';
import test from 'node:test';
import { articleProvenance } from '../src/modules/learning/ui/pages/ArticlePage/article-provenance.ts';

test('article provenance requires both reviews and preserves confirmed source links', () => {
  const article = {
    reviewState: { technical: 'approved', language: 'pending' },
    sourceUrl: 'https://cp-algorithms.com/graph/bfs.html',
    russianSourceUrl: 'https://e-maxx.ru/algo/bfs',
    contributors: [{ name: 'translation-bot' }],
  };
  const pending = articleProvenance(article);
  assert.equal(pending.isHumanReviewed, false);
  assert.equal(pending.reviewLabel, 'AI-tarjima');
  assert.deepEqual(pending.sourceLinks.map((source) => source.href), [article.sourceUrl, article.russianSourceUrl]);
  assert.equal(pending.contributors[0].name, 'cp.uz tarjima jamoasi');
  const approved = articleProvenance({ ...article, reviewState: { technical: 'approved', language: 'approved' } });
  assert.equal(approved.reviewLabel, 'Tekshiruvdan o‘tgan tarjima');
});
