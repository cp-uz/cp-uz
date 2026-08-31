import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const readSource = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

const headerSource = readSource('../src/app/layouts/LearningLayout.tsx');
const profileSource = readSource('../src/modules/engagement/ui/pages/ProfilePage/ProfilePage.tsx');

test('authenticated header identity opens a profile dropdown with logout', () => {
  assert.match(headerSource, /logoutAuthSession/);
  assert.match(headerSource, /id="profile-identity-button"/);
  assert.match(headerSource, /id="profile-identity-menu"/);
  assert.match(headerSource, /<MenuItem onClick=\{logout\}>/);
  assert.match(headerSource, /Akkauntdan chiqish/);
  assert.match(headerSource, /logoutAuthSession\(\)/);
});

test('profile hard-delete requires explicit confirmation and a real account password', () => {
  assert.match(profileSource, /deleteConfirmation !== 'O‘CHIRISH'/);
  assert.match(profileSource, /session && !session\.user\.isGuest && !deletePassword/);
  assert.match(profileSource, /authApi\.deleteAccount\(\{/);
  assert.match(profileSource, /confirmation: 'O‘CHIRISH'/);
  assert.match(profileSource, /\.\.\.\(deletePassword \? \{ password: deletePassword \} : \{\}\)/);
  assert.match(profileSource, /type="password"/);
  assert.match(profileSource, /label="Joriy parol"/);
  assert.match(profileSource, /autoComplete="current-password"/);
});

test('profile clears device engagement only after account deletion succeeds', () => {
  const deletion = profileSource.indexOf('await authApi.deleteAccount');
  const engagementClear = profileSource.indexOf('clearLocalEngagementData()', deletion);
  const quizClear = profileSource.indexOf('clearGlossaryQuizLocalData()', deletion);
  const errorHandler = profileSource.indexOf('} catch (reason)', deletion);

  assert.notEqual(deletion, -1);
  assert.ok(engagementClear > deletion && engagementClear < errorHandler);
  assert.ok(quizClear > deletion && quizClear < errorHandler);
});
