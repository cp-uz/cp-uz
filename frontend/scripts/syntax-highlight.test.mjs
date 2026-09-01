import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  tokenizeCode,
  normalizeSyntaxLanguage,
} from '../src/modules/learning/ui/shared/syntax-highlight.ts';

const globalStyles = readFileSync(new URL('../src/app/styles/global.css', import.meta.url), 'utf8');
const richMarkdown = readFileSync(
  new URL('../src/modules/learning/ui/shared/RichMarkdown.tsx', import.meta.url),
  'utf8'
);

test('normalizes the supported C++ and Python fence names', () => {
  assert.equal(normalizeSyntaxLanguage('c++'), 'cpp');
  assert.equal(normalizeSyntaxLanguage('py'), 'python');
  assert.equal(normalizeSyntaxLanguage('javascript'), undefined);
});

test('highlights C++ without changing the source text', () => {
  const source = '// izoh\nlong long answer = 42;\nreturn answer;';
  const tokens = tokenizeCode(source, 'cpp');

  assert.equal(tokens.map((token) => token.value).join(''), source);
  assert.ok(tokens.some((token) => token.kind === 'comment'));
  assert.ok(tokens.some((token) => token.kind === 'type'));
  assert.ok(tokens.some((token) => token.kind === 'keyword'));
  assert.ok(tokens.some((token) => token.kind === 'number'));
});

test('highlights Python comments, keywords, builtins, and strings', () => {
  const source = '# izoh\nfor value in range(3):\n    print("salom")';
  const tokens = tokenizeCode(source, 'python');

  assert.equal(tokens.map((token) => token.value).join(''), source);
  assert.ok(tokens.some((token) => token.kind === 'comment'));
  assert.ok(tokens.some((token) => token.kind === 'keyword'));
  assert.ok(tokens.some((token) => token.kind === 'builtin'));
  assert.ok(tokens.some((token) => token.kind === 'string'));
});

test('keeps multi-character code operators visually separate', () => {
  assert.match(globalStyles, /font-variant-ligatures:\s*none/);
  assert.match(globalStyles, /'liga'\s+0/);
  assert.match(globalStyles, /'calt'\s+0/);
});

test('uses a dedicated high-contrast syntax palette in dark mode', () => {
  assert.match(globalStyles, /:root\[data-color-scheme='dark'\]/);
  assert.match(globalStyles, /--syntax-code-background:\s*#202a36/);
  assert.match(globalStyles, /--syntax-code-foreground:\s*#e6edf3/);
  assert.match(globalStyles, /--syntax-keyword:\s*#ff7ab2/);
  assert.match(globalStyles, /--syntax-operator:\s*#89ddff/);
  assert.match(globalStyles, /\.syntax-token--keyword\s*{[^}]*var\(--syntax-keyword\)/s);
  assert.match(globalStyles, /\.syntax-token--operator\s*{[^}]*var\(--syntax-operator\)/s);
});

test('article code blocks expose a clipboard action with a browser fallback', () => {
  assert.match(richMarkdown, /aria-label=\{copyLabel\}/);
  assert.match(richMarkdown, /title=\{copyLabel\}/);
  assert.match(richMarkdown, /navigator\.clipboard\?\.writeText/);
  assert.match(richMarkdown, /document\.execCommand\('copy'\)/);
  assert.match(globalStyles, /\.markdown-code-copy/);
  assert.match(globalStyles, /position:\s*absolute/);
});
