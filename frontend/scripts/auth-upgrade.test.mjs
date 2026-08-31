import test from 'node:test';
import assert from 'node:assert/strict';

import {
  mapGuestUpgradeInput,
  mapGuestUpgradePayload,
} from '../src/modules/auth/data-access/mappers/auth-session.mapper.ts';

const validPayload = {
  access: 'fresh-access',
  refresh: 'fresh-refresh',
  username: 'saved_learner',
  one_time_password: 'Strong-One-Time-Pass-2026!',
  user: {
    id: 17,
    username: 'saved_learner',
    first_name: 'Diyor',
    last_name: 'Karimov',
    name: 'saved_learner',
    is_guest: false,
  },
};

test('maps a guest upgrade response into a real persisted session', () => {
  const result = mapGuestUpgradePayload(validPayload);

  assert.equal(result.username, 'saved_learner');
  assert.equal(result.oneTimePassword, 'Strong-One-Time-Pass-2026!');
  assert.equal(result.session.user.id, 17);
  assert.equal(result.session.user.firstName, 'Diyor');
  assert.equal(result.session.user.lastName, 'Karimov');
  assert.equal(result.session.user.isGuest, false);
  assert.equal(result.session.sessionToken, undefined);
});

test('maps and trims optional profile names for the guest upgrade request', () => {
  assert.deepEqual(
    mapGuestUpgradeInput({
      username: '  Saved_Learner  ',
      firstName: '  Diyor  ',
      lastName: '  Karimov  ',
    }),
    {
      username: 'saved_learner',
      first_name: 'Diyor',
      last_name: 'Karimov',
    }
  );

  assert.deepEqual(
    mapGuestUpgradeInput({ username: 'learner', firstName: '   ', lastName: '' }),
    { username: 'learner', first_name: '', last_name: '' }
  );
  assert.deepEqual(mapGuestUpgradeInput({ username: 'learner' }), { username: 'learner' });
});

test('rejects upgrade responses that omit the one-time password or remain guest', () => {
  assert.throws(
    () => mapGuestUpgradePayload({ ...validPayload, one_time_password: undefined }),
    /yaroqsiz javob/
  );
  assert.throws(
    () =>
      mapGuestUpgradePayload({
        ...validPayload,
        user: { ...validPayload.user, is_guest: true },
      }),
    /yaroqsiz javob/
  );
});
