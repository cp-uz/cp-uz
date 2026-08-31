import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeMarkdownDocument } from '../src/modules/learning/ui/shared/markdown-adapter.js';

test('normalizes display math without touching fenced code', () => {
  const source = [
    '## Formula',
    '',
    '$$\\begin{align}',
    'a &= b',
    '\\end{align}$$',
    '',
    '```txt',
    '$$must stay on one line$$',
    '```',
  ].join('\n');
  const document = normalizeMarkdownDocument(source);
  assert.match(document.markdown, /\$\$\n\\begin\{align\}/);
  assert.match(document.markdown, /\\end\{align\}\n\$\$/);
  assert.match(document.markdown, /```txt\n\$\$must stay on one line\$\$\n```/);
});

test('uses explicit IDs, preserves aliases and suffixes duplicate IDs', () => {
  const source = [
    '<div id="legacy-anchor"></div>',
    '## Birinchi { #stable data-toc-label="Birinchi bo‘lim" }',
    '## Birinchi { #stable }',
  ].join('\n');
  const document = normalizeMarkdownDocument(source);
  assert.deepEqual(document.headings, [
    { aliases: ['legacy-anchor'], id: 'stable', label: 'Birinchi bo‘lim', level: 2 },
    { aliases: [], id: 'stable-2', label: 'Birinchi', level: 2 },
  ]);
  assert.doesNotMatch(document.markdown, /data-toc-label|cp-anchor/);
});

test('does not mistake ordinary trailing braces for heading attributes', () => {
  const document = normalizeMarkdownDocument('## Belgilar {a,b}');
  assert.equal(document.markdown, '## Belgilar {a,b}');
  assert.equal(document.headings[0].label, 'Belgilar a,b');
});

test('converts MkDocs blocks and tabs to safe visible Markdown fallbacks', () => {
  const source = [
    '!!! warning "Holat"',
    '    Matn',
    '',
    '??? hint "Isbot"',
    '    Yashirin bo‘lmasin.',
    '',
    '=== "C++"',
    '    ```{.c++ file=answer}',
    '    int main() {}',
    '    ```',
  ].join('\n');
  const document = normalizeMarkdownDocument(source);
  assert.doesNotMatch(document.markdown, /^\s*(?:!!!|\?\?\?|===)/m);
  assert.match(document.markdown, /> \*\*Holat\*\*/);
  assert.match(document.markdown, /> \*\*Isbot — batafsil\*\*/);
  assert.match(document.markdown, /\*\*C\+\+\*\*/);
  assert.match(document.markdown, /```cpp file=answer/);
});

test('unwraps safe HTML, converts media and removes executable markup', () => {
  const source = [
    '<div style="text-align:center" onclick="bad()">',
    '  <img src="diagram.png" alt="Diagram" onerror="bad()">',
    '</div>',
    '<script>alert(1)</script>',
    '<style>body{display:none}</style>',
  ].join('\n');
  const document = normalizeMarkdownDocument(source);
  assert.match(document.markdown, /!\[Diagram\]\(diagram\.png\)/);
  assert.doesNotMatch(document.markdown, /onclick|onerror|script|style|alert/);
});

test('removes inline practice sections and retains their original link identity', () => {
  const source = [
    '## Tushuntirish',
    'Saqlanadi.',
    '### Mashq masalalari:',
    '- [A masala](https://codeforces.com/problemset/problem/1/A)',
    '- [Izoh](https://en.wikipedia.org/wiki/Algorithm)',
    '### Keyingi bo‘lim',
    'Bu ham saqlanadi.',
  ].join('\n');
  const document = normalizeMarkdownDocument(source);
  assert.doesNotMatch(document.markdown, /Mashq masalalari|A masala|wikipedia/);
  assert.match(document.markdown, /## Tushuntirish/);
  assert.match(document.markdown, /### Keyingi bo‘lim/);
  assert.deepEqual(document.practiceLinks, [
    { title: 'A masala', url: 'https://codeforces.com/problemset/problem/1/A' },
  ]);
});
