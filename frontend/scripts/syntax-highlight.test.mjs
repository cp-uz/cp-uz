import test from 'node:test';
import assert from 'node:assert/strict';

import {
  tokenizeCode,
  normalizeSyntaxLanguage,
} from '../src/modules/learning/ui/shared/syntax-highlight.ts';

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
