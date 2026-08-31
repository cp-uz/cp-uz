import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const articlePage = readFileSync(
  new URL('../src/modules/learning/ui/pages/ArticlePage/ArticlePage.tsx', import.meta.url),
  'utf8'
);
const homePage = readFileSync(
  new URL('../src/modules/landing/ui/pages/HomePage/HomePage.tsx', import.meta.url),
  'utf8'
);

test('article header exposes review truth and confirmed upstream sources', () => {
  assert.match(articlePage, /Tekshiruvdan o‘tgan tarjima/);
  assert.match(articlePage, /AI-tarjima/);
  assert.match(articlePage, /Original maqola/);
  assert.match(articlePage, /cp-algorithms\.com/);
  assert.match(articlePage, /e-maxx\.ru/);
  assert.match(articlePage, /cp-algorithms-favicon\.ico/);
});

test('landing team contains six members in a three-column desktop grid', () => {
  for (const name of [
    'Asadullo Ganiev',
    'Dilshodbek Khujaev',
    'Dilyorbek Valijanov',
    'Ulugbek Abdimanabov',
    'Davlatbek Mirakilov',
    'Nazarbek Baltabaev',
  ]) {
    assert.match(homePage, new RegExp(name));
  }
  assert.match(homePage, /md: 'repeat\(3, minmax\(0, 1fr\)\)'/);
  assert.doesNotMatch(homePage, /t\.me\/|telegram/i);
});
