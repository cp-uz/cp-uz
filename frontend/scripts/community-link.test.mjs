import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const layoutSource = readFileSync(
  new URL('../src/app/layouts/LearningLayout.tsx', import.meta.url),
  'utf8'
);

test('Discord button exposes only the backend redirect endpoint', () => {
  assert.match(layoutSource, /href=\{apiUrl\('\/community\/discord\/'\)\}/);
  assert.doesNotMatch(layoutSource, /discord\.gg|discord\.com\/invite/i);
});
