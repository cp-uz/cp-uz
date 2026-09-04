import assert from 'node:assert/strict';
import test from 'node:test';
import { Linter } from 'eslint';
import { resolve } from 'node:path';
import architecture from '../eslint-architecture.mjs';

const linter = new Linter();
function lint(code, filename) {
  return linter.verify(
    code,
    [
      {
        files: ['**/*.js'],
        plugins: { architecture },
        rules: { 'architecture/boundaries': 'error' },
      },
    ],
    { filename: resolve('src', filename) }
  );
}
test('cross-module aliases, relative paths and lazy imports share one boundary', () => {
  for (const code of [
    "import x from 'modules/learning/ui/private';",
    "import x from '../../learning/ui/private';",
    "const x = import('modules/learning/ui/private');",
  ]) {
    assert.equal(lint(code, 'modules/problems/ui/page.js').length, 1);
  }
  assert.equal(
    lint("const x = import('modules/learning/pages/catalog');", 'app/routes.js').length,
    0
  );
  assert.equal(lint("import x from './private';", 'modules/learning/ui/page.js').length, 0);
});
test('shared and domain cannot acquire presentation or network dependencies', () => {
  assert.equal(lint("import x from 'modules/auth/application';", 'shared/utils.js').length, 1);
  assert.equal(lint("import x from 'react';", 'modules/auth/domain/model.js').length, 1);
  assert.equal(lint("fetch('/api');", 'modules/learning/ui/page.js').length, 1);
  assert.equal(lint("fetch('/api');", 'modules/learning/data-access/repository.js').length, 0);
});

test('domain boundaries include barrel imports and shared browser infrastructure', () => {
  for (const source of [
    '../application',
    '../data-access',
    'modules/learning/application',
    'modules/learning',
    'shared/api/http',
    'shared/storage',
    'shared/hooks',
    'shared/ui/Seo',
  ]) {
    assert.ok(
      lint(`import x from '${source}';`, 'modules/auth/domain/model.js').length > 0,
      source
    );
  }
  assert.equal(
    lint("import x from 'modules/learning/domain';", 'modules/auth/domain/model.js').length,
    0
  );
  assert.equal(lint("import x from 'shared/config';", 'modules/auth/domain/model.js').length, 0);
});

test('normalized aliases and global browser fetch calls cannot bypass boundaries', () => {
  assert.equal(
    lint("import x from 'modules/learning/domain/../ui/private';", 'modules/problems/ui/page.js')
      .length,
    1
  );
  for (const expression of ['window.fetch', 'globalThis.fetch', "self['fetch']"]) {
    assert.equal(
      lint(`${expression}('/api');`, 'modules/learning/ui/page.js').length,
      1,
      expression
    );
    assert.equal(
      lint(`${expression}('/api');`, 'modules/learning/data-access/repository.js').length,
      0,
      expression
    );
  }
});
