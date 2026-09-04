# Engagement state

`createEngagementStore` owns bookmark, reading progress and note state. React views subscribe
through `useEngagementState`; they never write browser storage themselves. All snapshots and
pending mutations use the `cpuz:engagement:v2:<owner>` key. An owner is `user:<id>` or `anonymous`.
Guest upgrades keep the same user ID and therefore keep the same learning data.

Writes first persist the desired value in the owner's outbox. A missing bookmark/note/progress
entry is represented by an explicit deletion mutation until the server confirms it. Server
snapshots are overlaid with pending values, so an offline deletion does not reappear during
hydration. Mutations are coalesced per article and kind and flushed serially. A response only
acknowledges its own mutation ID; a newer edit remains queued. Reconnection, login, a new action,
the retry button and a timer retry failed writes. Uncertain responses trigger server
reconciliation before another write. Repositories capture `expectedUserId`, and the store also
checks its current owner before accepting results.

Anonymous v2 data may transfer only to the currently identified guest via
`migrateLocalEngagement` or the lazy guest creation triggered by a learning action. Registered
login does not merge another owner's state. Legacy unscoped keys are left untouched because
their original owner cannot be determined safely; they are not silently attributed to a new
account. Storage failures use a memory fallback and show that persistence is unavailable.

Deleting an account must capture its owner before the auth request clears the session, then
pass that owner to `clearLocalEngagementData`. Signing out preserves its own scoped data for
offline recovery but never exposes it through another identity's snapshot.

`scripts/engagement-lifecycle.test.tsx` exercises the React hooks and store against controlled
requests, including StrictMode navigation, identity changes, delayed writes and offline reload.
