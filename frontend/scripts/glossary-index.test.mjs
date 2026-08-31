import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getEnglishGlossaryInitial,
  getGlossaryDisplayLabels,
  sortGlossaryByEnglish,
} from '../src/modules/learning/domain/glossary-index.ts';

const terms = [
  { term: 'Segment Daraxti', english: 'Segment Tree' },
  { term: 'Evklid algoritmi', english: 'Euclidean Algorithm' },
  { term: 'Aho–Korasik Algoritmi', english: 'Aho–Corasick Algorithm' },
];

test('alphabetical glossary grouping follows the normalized English term', () => {
  assert.equal(getEnglishGlossaryInitial('Euclidean Algorithm'), 'E');
  assert.equal(getEnglishGlossaryInitial('Éuler Tour'), 'E');
  assert.deepEqual(
    sortGlossaryByEnglish(terms).map((term) => term.english),
    ['Aho–Corasick Algorithm', 'Euclidean Algorithm', 'Segment Tree']
  );
});

test('English is the main visible label and Uzbek remains secondary', () => {
  assert.deepEqual(
    getGlossaryDisplayLabels({
      english: 'Euclidean Algorithm',
      term: 'Yevklid Algoritmi',
    }),
    {
      primary: 'Euclidean Algorithm',
      secondary: 'Evklid algoritmi',
    }
  );
});
