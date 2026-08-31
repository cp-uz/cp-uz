import assert from 'node:assert/strict';
import test from 'node:test';

await import('../public/loader-facts.js');

test('boot and React use one sizeable, clean loading-fact catalogue', () => {
  const facts = globalThis.__cpuzLoadingFacts;

  assert.ok(Array.isArray(facts));
  assert.ok(facts.length >= 24, `expected at least 24 facts, received ${facts.length}`);
  assert.equal(new Set(facts).size, facts.length, 'loading facts must be unique');

  facts.forEach((fact) => {
    assert.equal(typeof fact, 'string');
    assert.equal(fact, fact.trim());
    assert.ok(fact.length >= 24, `fact is too short: ${fact}`);
    assert.ok(fact.length <= 110, `fact is too long: ${fact}`);
  });
});
