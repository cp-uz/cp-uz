import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const readSource = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

const profileSource = readSource('../src/modules/engagement/ui/pages/ProfilePage/ProfilePage.tsx');

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
  const engagementClear = profileSource.indexOf('clearLocalEngagementData(deletingOwner)', deletion);
  const quizClear = profileSource.indexOf('clearGlossaryQuizLocalData(deletingUserId)', deletion);
  const errorHandler = profileSource.indexOf('} catch (reason)', deletion);

  assert.notEqual(deletion, -1);
  assert.ok(engagementClear > deletion && engagementClear < errorHandler);
  assert.ok(quizClear > deletion && quizClear < errorHandler);
});
