import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  GLOSSARY_QUIZ_MODES,
  emptyQuizStats,
  sanitizeQuizStats,
  updateQuizStats,
  isQuizAnswerCorrect,
  buildGlossaryQuizQuestions,
} from '../src/modules/learning/application/glossary-quiz.js';
import {
  enqueueGlossaryScore,
  pendingGlossaryScoreCount,
  flushGlossaryScoreOutbox,
  GLOSSARY_QUIZ_OUTBOX_STORAGE_KEY,
} from '../src/modules/learning/application/glossary-score-outbox.ts';

const glossaryTerms = Array.from({ length: 12 }, (_, index) => ({
  term: `O‘zbekcha ${index + 1}`,
  english: `English ${index + 1}`,
  definition: `${index + 1}-tushunchaning bir jumlali o‘zbekcha izohi.`,
}));

const canonicalGlossary = JSON.parse(
  readFileSync(new URL('../../content/metadata/glossary.json', import.meta.url), 'utf8')
).map((row) => ({
  term: row.uzbek,
  english: row.source,
  definition: row.note,
}));

const normalize = (value) =>
  value
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLocaleLowerCase('uz')
    .replace(/[’‘`ʻʼ']/g, '')
    .replace(/[-_/]+/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

test('single-question seeds cover every supported quiz mode', () => {
  const questions = GLOSSARY_QUIZ_MODES.map(
    (_, seed) => buildGlossaryQuizQuestions(glossaryTerms, seed, 1)[0]
  );

  assert.deepEqual(
    new Set(questions.map((question) => question.mode)),
    new Set(GLOSSARY_QUIZ_MODES.map((mode) => mode.id))
  );
});

test('every generated question has exactly four unique options with the answer', () => {
  for (let seed = 0; seed < 32; seed += 1) {
    const question = buildGlossaryQuizQuestions(glossaryTerms, seed, 1)[0];
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map(normalize)).size, 4);
    assert.equal(question.options.includes(question.correctAnswer), true);
    assert.equal(isQuizAnswerCorrect(question, question.correctAnswer), true);
    assert.equal(isQuizAnswerCorrect(question, 'not an option'), false);
  }
});

test('all 174 canonical terms remain distinct and produce valid quiz options', () => {
  assert.equal(canonicalGlossary.length, 174);
  for (const field of ['term', 'english', 'definition']) {
    assert.equal(
      new Set(canonicalGlossary.map((item) => normalize(item[field]))).size,
      canonicalGlossary.length
    );
  }

  for (let seed = 0; seed < canonicalGlossary.length; seed += 1) {
    const questions = buildGlossaryQuizQuestions(canonicalGlossary, seed, canonicalGlossary.length);
    assert.equal(questions.length, canonicalGlossary.length);
    questions.forEach((question) => {
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options.map(normalize)).size, 4);
      assert.equal(question.options.includes(question.correctAnswer), true);
    });
  }
});

test('cumulative stats update after every answer and preserve best streak', () => {
  let stats = emptyQuizStats();
  stats = updateQuizStats(stats, true, '2026-08-31T08:00:00.000Z');
  stats = updateQuizStats(stats, true, '2026-08-31T08:01:00.000Z');
  stats = updateQuizStats(stats, false, '2026-08-31T08:02:00.000Z');

  assert.deepEqual(stats, {
    attempts: 3,
    correct: 2,
    streak: 0,
    bestStreak: 2,
    updatedAt: '2026-08-31T08:02:00.000Z',
  });
});

test('malformed persisted cumulative stats reset safely', () => {
  assert.deepEqual(
    sanitizeQuizStats({ attempts: 2, correct: 3, streak: 1, bestStreak: 1, updatedAt: '' }),
    emptyQuizStats()
  );
  assert.deepEqual(
    sanitizeQuizStats({
      attempts: 4,
      correct: 3,
      streak: 2,
      bestStreak: 2,
      updatedAt: '2026-08-31T08:00:00.000Z',
    }),
    { attempts: 4, correct: 3, streak: 2, bestStreak: 2, updatedAt: '2026-08-31T08:00:00.000Z' }
  );
});

class MemoryStorage {
  values = new Map();

  getItem(key) {
    return this.values.get(key) ?? null;
  }

  setItem(key, value) {
    this.values.set(key, String(value));
  }

  removeItem(key) {
    this.values.delete(key);
  }
}

test('glossary score outbox deduplicates answers by client id', () => {
  const originalLocalStorage = globalThis.localStorage;
  const storage = new MemoryStorage();
  globalThis.localStorage = storage;
  try {
    assert.equal(enqueueGlossaryScore({ id: 'answer-1', isCorrect: true }), true);
    assert.equal(enqueueGlossaryScore({ id: 'answer-1', isCorrect: false }), true);

    assert.equal(pendingGlossaryScoreCount(), 1);
    assert.deepEqual(JSON.parse(storage.getItem(GLOSSARY_QUIZ_OUTBOX_STORAGE_KEY)), [
      { id: 'answer-1', isCorrect: true },
    ]);
  } finally {
    if (originalLocalStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = originalLocalStorage;
  }
});

test('glossary score outbox retains failed answers and removes each successful delivery', async () => {
  const originalLocalStorage = globalThis.localStorage;
  const storage = new MemoryStorage();
  globalThis.localStorage = storage;
  try {
    enqueueGlossaryScore({ id: 'answer-ok', isCorrect: true });
    enqueueGlossaryScore({ id: 'answer-retry', isCorrect: false });
    const firstAttempt = [];

    await assert.rejects(
      flushGlossaryScoreOutbox(async (answer) => {
        firstAttempt.push(answer.id);
        if (answer.id === 'answer-retry') throw new Error('offline');
        return { revision: 1 };
      }),
      /offline/
    );

    assert.deepEqual(firstAttempt, ['answer-ok', 'answer-retry']);
    assert.deepEqual(JSON.parse(storage.getItem(GLOSSARY_QUIZ_OUTBOX_STORAGE_KEY)), [
      { id: 'answer-retry', isCorrect: false },
    ]);
    assert.equal(pendingGlossaryScoreCount(), 1);

    const retried = [];
    const result = await flushGlossaryScoreOutbox(async (answer) => {
      retried.push(answer.id);
      return { revision: 2 };
    });

    assert.deepEqual(retried, ['answer-retry']);
    assert.deepEqual(result, { revision: 2 });
    assert.equal(pendingGlossaryScoreCount(), 0);
    assert.deepEqual(JSON.parse(storage.getItem(GLOSSARY_QUIZ_OUTBOX_STORAGE_KEY)), []);
  } finally {
    if (originalLocalStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = originalLocalStorage;
  }
});
