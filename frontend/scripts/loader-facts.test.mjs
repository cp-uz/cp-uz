import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

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

test('fact loader is limited to the first visit and route transitions stay simple', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const app = readFileSync(new URL('../src/app/App.tsx', import.meta.url), 'utf8');

  assert.match(html, /cpuz:fact-loader-shown/);
  assert.match(html, /sessionStorage\.getItem\(visitKey\)/);
  assert.match(html, /dataset\.loaderExperience = loaderExperience/);
  assert.match(html, /loader-facts\.js" defer/);
  assert.match(app, /setLoadingVariant\('simple'\)/);
  assert.match(app, /<LoadingScreen variant=\{loadingVariant\}/);
  assert.doesNotMatch(app, /1000 \+ Math\.floor/);
});

test('reader font size setting overrides the boot stylesheet root size', () => {
  const bootCss = readFileSync(new URL('../public/boot.css', import.meta.url), 'utf8');
  const settingsComponents = readFileSync(
    new URL('../src/app/theme/with-settings/update-components.ts', import.meta.url),
    'utf8'
  );
  const settingsProvider = readFileSync(
    new URL('../src/app/providers/settings/SettingsProvider.tsx', import.meta.url),
    'utf8'
  );

  assert.match(bootCss, /font-size: var\(--boot-font-size, 16px\)/);
  assert.match(settingsComponents, /'--boot-font-size': `\$\{fontSize\}px`/);
  assert.match(settingsComponents, /fontSize,/);
  assert.match(
    settingsProvider,
    /document\.documentElement\.style\.setProperty\('--boot-font-size', `\$\{state\.fontSize\}px`\)/
  );
  assert.match(settingsProvider, /\[state\.fontSize\]/);
});
