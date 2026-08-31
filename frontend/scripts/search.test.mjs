import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeSearchText,
  rankArticleSearchResults,
} from '../src/modules/learning/domain/utils/article-search.js';
import { createDebouncer } from '../src/shared/lib/timing/debounce.js';

function article(title, summary = '', tags = [], category = 'Ma’lumotlar tuzilmasi') {
  return { title, summary, tags, category };
}

test('English alias ranks the canonical Uzbek article first', () => {
  const articles = [
    article('Daraxtlar', 'Segment tree haqida umumiy kirish'),
    article('Segment Daraxti', 'Oraliq so‘rovlarini logarifmik vaqtda hisoblash'),
    article('Fenwick Daraxti', 'Segment tree uchun ixcham muqobil'),
  ];

  for (const query of ['segment tree', 'segment daraxti', 'kesma daraxti']) {
    assert.equal(rankArticleSearchResults(articles, query)[0]?.title, 'Segment Daraxti');
  }
});

test('search normalization handles Uzbek apostrophes, case and hyphens', () => {
  assert.equal(normalizeSearchText("O‘RTA-murakkablik"), normalizeSearchText("o'rta murakkablik"));
  assert.equal(normalizeSearchText('Kenglik bo‘yicha qidiruv'), 'kenglik boyicha qidiruv');
});

test('debouncer publishes only the latest value after 300 ms', () => {
  let now = 0;
  let nextId = 1;
  const tasks = new Map();
  const scheduler = {
    setTimeout(callback, delay) {
      const id = nextId++;
      tasks.set(id, { callback, at: now + delay });
      return id;
    },
    clearTimeout(id) {
      tasks.delete(id);
    },
  };
  const advance = (milliseconds) => {
    now += milliseconds;
    [...tasks.entries()]
      .filter(([, task]) => task.at <= now)
      .sort((left, right) => left[1].at - right[1].at)
      .forEach(([id, task]) => {
        tasks.delete(id);
        task.callback();
      });
  };
  const received = [];
  const debouncer = createDebouncer((value) => received.push(value), 300, scheduler);

  debouncer.schedule('segment');
  advance(120);
  debouncer.schedule('segment tree');
  advance(299);
  assert.deepEqual(received, []);
  advance(1);
  assert.deepEqual(received, ['segment tree']);
});
