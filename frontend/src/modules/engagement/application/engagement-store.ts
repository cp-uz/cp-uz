import type { SafeStorage } from 'shared/storage';
import type { AuthSession } from 'modules/auth/domain';
import type { NoteEntry, BookmarkEntry, ProgressEntry, EngagementRepository } from '../domain';

import { readStoredJson } from 'shared/storage';

export const ENGAGEMENT_STORAGE_PREFIX = 'cpuz:engagement:v2:';
export const ANONYMOUS_OWNER = 'anonymous';

type Collections = {
  bookmarks: BookmarkEntry[];
  progress: ProgressEntry[];
  notes: NoteEntry[];
};
type Mutation = {
  id: string;
  kind: 'bookmark' | 'progress' | 'note';
  slug: string;
  value: boolean | number | string | null;
};
export type EngagementState = Collections & {
  owner: string;
  identity: string;
  pending: Mutation[];
  hydrated: boolean;
  syncing: boolean;
  error: string;
  persistent: boolean;
};
type Scope = {
  state: EngagementState;
  remote: Collections;
  loaded: boolean;
  revision: number;
  running?: Promise<void>;
  retryTimer?: ReturnType<typeof setTimeout>;
};
type StoreDependencies = {
  storage: SafeStorage;
  repository: (userId: string) => EngagementRepository;
  getSession: () => AuthSession | null;
  ensureSession: () => Promise<AuthSession>;
  subscribeSession: (listener: () => void) => () => void;
  eventTarget?: Pick<Window, 'addEventListener' | 'removeEventListener'>;
  retryDelayMs?: number;
};

const emptyCollections = (): Collections => ({ bookmarks: [], progress: [], notes: [] });
export const engagementOwner = (session: AuthSession | null) =>
  session ? `user:${String(session.user.id)}` : ANONYMOUS_OWNER;
export const engagementIdentity = (session: AuthSession | null) =>
  session ? `${engagementOwner(session)}:${session.sessionKey ?? session.access}` : ANONYMOUS_OWNER;
const storageKey = (owner: string) => `${ENGAGEMENT_STORAGE_PREFIX}${encodeURIComponent(owner)}`;
const mutationKey = (mutation: Pick<Mutation, 'kind' | 'slug'>) =>
  `${mutation.kind}:${mutation.slug}`;
const validSlug = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0;
const validId = (value: unknown): value is number | string =>
  typeof value === 'number' || typeof value === 'string';

function readCollections(value: unknown): Collections {
  if (!value || typeof value !== 'object') return emptyCollections();
  const saved = value as Record<string, unknown>;
  const rows = (name: string): Record<string, unknown>[] =>
    Array.isArray(saved[name])
      ? saved[name].filter((row): row is Record<string, unknown> =>
          Boolean(row && typeof row === 'object' && validSlug(row.articleSlug) && validId(row.id))
        )
      : [];
  return {
    bookmarks: rows('bookmarks').map((row) => ({
      id: row.id as number | string,
      articleSlug: row.articleSlug as string,
    })),
    progress: rows('progress')
      .filter((row) => typeof row.percent === 'number' && Number.isFinite(row.percent))
      .map((row) => ({
        id: row.id as number | string,
        articleSlug: row.articleSlug as string,
        percent: Math.min(100, Math.max(0, row.percent as number)),
        status: typeof row.status === 'string' ? row.status : 'in_progress',
      })),
    notes: rows('notes')
      .filter((row) => typeof row.body === 'string')
      .map((row) => ({
        id: row.id as number | string,
        articleSlug: row.articleSlug as string,
        body: row.body as string,
        anchor: typeof row.anchor === 'string' ? row.anchor : '',
      })),
  };
}

function readPending(value: unknown): Mutation[] {
  if (
    !value ||
    typeof value !== 'object' ||
    !('pending' in value) ||
    !Array.isArray(value.pending)
  ) {
    return [];
  }
  return value.pending.filter((row): row is Mutation => {
    if (!row || typeof row !== 'object' || !validSlug(row.id) || !validSlug(row.slug)) return false;
    return (
      (row.kind === 'bookmark' && typeof row.value === 'boolean') ||
      (row.kind === 'progress' &&
        (row.value === null || (typeof row.value === 'number' && Number.isFinite(row.value)))) ||
      (row.kind === 'note' && (row.value === null || typeof row.value === 'string'))
    );
  });
}

function replaceEntry<T extends { articleSlug: string }>(
  entries: T[],
  slug: string,
  entry?: T
): T[] {
  return [...entries.filter((item) => item.articleSlug !== slug), ...(entry ? [entry] : [])];
}

/** Pending desired values overlay server snapshots, including explicit deletion tombstones. */
function overlay(collections: Collections, pending: Mutation[]): Collections {
  const result = { ...collections };
  for (const mutation of pending) {
    const { slug, value } = mutation;
    if (mutation.kind === 'bookmark') {
      result.bookmarks = replaceEntry(
        result.bookmarks,
        slug,
        value
          ? {
              id: result.bookmarks.find((row) => row.articleSlug === slug)?.id ?? `local:${slug}`,
              articleSlug: slug,
            }
          : undefined
      );
    } else if (mutation.kind === 'progress') {
      const percent = Number(value);
      result.progress = replaceEntry(
        result.progress,
        slug,
        value === null
          ? undefined
          : {
              id: result.progress.find((row) => row.articleSlug === slug)?.id ?? `local:${slug}`,
              articleSlug: slug,
              percent,
              status: percent >= 100 ? 'completed' : 'in_progress',
            }
      );
    } else {
      result.notes = replaceEntry(
        result.notes,
        slug,
        value === null
          ? undefined
          : {
              id: result.notes.find((row) => row.articleSlug === slug)?.id ?? `local:${slug}`,
              articleSlug: slug,
              body: String(value),
              anchor: '',
            }
      );
    }
  }
  return result;
}

export function createEngagementStore(dependencies: StoreDependencies) {
  const { storage, getSession, ensureSession, repository, subscribeSession, eventTarget } =
    dependencies;
  const scopes = new Map<string, Scope>();
  const listeners = new Set<() => void>();
  let sequence = 0;
  let disposed = false;
  let unsubscribeSession: (() => void) | undefined;
  let currentOwner = engagementOwner(getSession());
  let currentIdentity = engagementIdentity(getSession());

  function scopeFor(owner: string): Scope {
    let scope = scopes.get(owner);
    if (!scope) {
      const saved = readStoredJson(storage, storageKey(owner));
      scope = {
        state: {
          ...overlay(readCollections(saved), readPending(saved)),
          owner,
          identity: engagementIdentity(getSession()),
          pending: readPending(saved),
          hydrated: owner === ANONYMOUS_OWNER,
          syncing: false,
          error: '',
          persistent: true,
        },
        remote: emptyCollections(),
        loaded: false,
        revision: 0,
      };
      scopes.set(owner, scope);
    }
    return scope;
  }

  function publish(scope: Scope, update: Partial<EngagementState>, persist = false) {
    scope.state = { ...scope.state, ...update };
    if (persist) {
      const persistent = storage.setItem(
        storageKey(scope.state.owner),
        JSON.stringify({
          bookmarks: scope.state.bookmarks,
          progress: scope.state.progress,
          notes: scope.state.notes,
          pending: scope.state.pending,
        })
      );
      scope.state = { ...scope.state, persistent };
    }
    if (!disposed) listeners.forEach((listener) => listener());
  }

  function isCurrent(owner: string) {
    return !disposed && owner === engagementOwner(getSession());
  }

  function enqueue(
    owner: string,
    kind: Mutation['kind'],
    slug: string,
    value: Mutation['value'],
    identity: string
  ) {
    if (!slug || !isCurrent(owner) || identity !== engagementIdentity(getSession())) return;
    const scope = scopeFor(owner);
    const mutation: Mutation = {
      kind,
      slug,
      value,
      id: `${Date.now()}:${++sequence}:${Math.random()}`,
    };
    const pending = [
      ...scope.state.pending.filter(
        (item) =>
          mutationKey(item) !== mutationKey(mutation) ||
          // A reset must reach the server before a new high-water progress value can replace it.
          (kind === 'progress' && value !== null && item.value === null)
      ),
      mutation,
    ];
    publish(scope, { ...overlay(scope.state, [mutation]), pending }, true);
    void sync(owner);
  }

  async function loadRemote(scope: Scope, api: EngagementRepository, revision: number) {
    const [bookmarks, progress, notes] = await Promise.all([
      api.listBookmarks(),
      api.listProgress(),
      api.listNotes(),
    ]);
    if (!isCurrent(scope.state.owner) || revision !== scope.revision) return false;
    scope.remote = { bookmarks, progress, notes };
    scope.loaded = true;
    publish(scope, { ...overlay(scope.remote, scope.state.pending), hydrated: true }, true);
    return true;
  }

  async function applyMutation(scope: Scope, api: EngagementRepository, mutation: Mutation) {
    const { slug, value } = mutation;
    if (mutation.kind === 'bookmark') {
      const existing = scope.remote.bookmarks.find((entry) => entry.articleSlug === slug);
      if (value && !existing) {
        const saved = await api.addBookmark(slug);
        scope.remote.bookmarks = replaceEntry(scope.remote.bookmarks, slug, saved);
      } else if (!value && existing) {
        await api.removeBookmark(existing.id);
        scope.remote.bookmarks = replaceEntry(scope.remote.bookmarks, slug);
      }
    } else if (mutation.kind === 'progress') {
      const existing = scope.remote.progress.find((entry) => entry.articleSlug === slug);
      if (value === null) {
        if (existing) await api.removeProgress(existing.id);
        scope.remote.progress = replaceEntry(scope.remote.progress, slug);
      } else {
        const saved = await api.setProgress(slug, Math.max(Number(value), existing?.percent ?? 0));
        scope.remote.progress = replaceEntry(scope.remote.progress, slug, saved);
      }
    } else {
      const existing = scope.remote.notes.find((entry) => entry.articleSlug === slug);
      if (value === null) {
        if (existing) await api.removeNote(existing.id);
        scope.remote.notes = replaceEntry(scope.remote.notes, slug);
      } else {
        const saved = await api.saveNote(slug, String(value), existing?.id);
        scope.remote.notes = replaceEntry(scope.remote.notes, slug, saved);
      }
    }
  }

  function scheduleRetry(owner: string, scope: Scope) {
    if (scope.retryTimer || !scope.state.pending.length || !isCurrent(owner)) return;
    scope.retryTimer = setTimeout(() => {
      scope.retryTimer = undefined;
      void sync(owner);
    }, dependencies.retryDelayMs ?? 15_000);
  }

  /** Only an identified guest may receive the known anonymous v2 scope. */
  function migrateAnonymous(session: AuthSession) {
    const owner = engagementOwner(session);
    const current = getSession();
    if (
      !session.user.isGuest ||
      !current?.user.isGuest ||
      engagementIdentity(session) !== engagementIdentity(current) ||
      !isCurrent(owner)
    )
      return;
    const anonymous = scopeFor(ANONYMOUS_OWNER);
    const target = scopeFor(owner);
    if (!anonymous.state.pending.length) return;
    const targetKeys = new Set(target.state.pending.map(mutationKey));
    const imported = anonymous.state.pending.filter((item) => !targetKeys.has(mutationKey(item)));
    const pending = [...target.state.pending, ...imported];
    publish(target, { ...overlay(target.state, imported), pending }, true);
    // Ownership transfer is saved before its source is cleared; repeated migration is idempotent.
    if (!target.state.persistent) return;
    publish(anonymous, { ...emptyCollections(), pending: [], error: '' }, true);
  }

  async function run(owner: string, scope: Scope) {
    publish(scope, { syncing: true, error: '' });
    const revision = scope.revision;
    try {
      if (owner === ANONYMOUS_OWNER) {
        if (!scope.state.pending.length) return;
        const session = await ensureSession();
        // ensureSession itself changes the identity; migrate only to the guest it established.
        if (!session.user.isGuest || !isCurrent(engagementOwner(session))) return;
        migrateAnonymous(session);
        await sync(engagementOwner(session));
        return;
      }
      const api = repository(owner.slice('user:'.length));
      if (!scope.loaded && !(await loadRemote(scope, api, revision))) return;
      while (scope.state.pending.length && isCurrent(owner) && revision === scope.revision) {
        const mutation = scope.state.pending[0];
        await applyMutation(scope, api, mutation);
        if (!isCurrent(owner) || revision !== scope.revision) return;
        const pending = scope.state.pending.filter((item) => item.id !== mutation.id);
        publish(scope, { ...overlay(scope.remote, pending), pending, error: '' }, true);
      }
    } catch (reason) {
      scope.loaded = false; // Reconcile uncertain writes against the server before retrying.
      if (isCurrent(owner) && revision === scope.revision) {
        publish(scope, {
          hydrated: true,
          error:
            reason instanceof Error ? reason.message : 'Profil bilan ulanishni tiklab bo‘lmadi.',
        });
        scheduleRetry(owner, scope);
      }
    } finally {
      publish(scope, { syncing: false });
    }
  }

  function sync(owner = engagementOwner(getSession())): Promise<void> {
    if (!isCurrent(owner)) return Promise.resolve();
    const scope = scopeFor(owner);
    if (scope.running) return scope.running;
    const request = Promise.resolve()
      .then(() => run(owner, scope))
      .finally(() => {
        if (scope.running === request) {
          scope.running = undefined;
          if (
            owner !== ANONYMOUS_OWNER &&
            isCurrent(owner) &&
            !scope.state.error &&
            (!scope.loaded || scope.state.pending.length)
          )
            void sync(owner);
        }
      });
    scope.running = request;
    return request;
  }

  function onSessionChange() {
    const nextOwner = engagementOwner(getSession());
    const nextIdentity = engagementIdentity(getSession());
    if (nextOwner === currentOwner && nextIdentity === currentIdentity) return;
    const previous = scopeFor(currentOwner);
    previous.revision += 1;
    previous.loaded = false;
    clearTimeout(previous.retryTimer);
    previous.retryTimer = undefined;
    currentOwner = nextOwner;
    currentIdentity = nextIdentity;
    const next = scopeFor(nextOwner);
    next.state = { ...next.state, identity: nextIdentity };
    next.loaded = false;
    listeners.forEach((listener) => listener());
    if (nextOwner !== ANONYMOUS_OWNER) void sync(nextOwner);
  }

  const retry = () => {
    const scope = scopeFor(engagementOwner(getSession()));
    clearTimeout(scope.retryTimer);
    scope.retryTimer = undefined;
    scope.loaded = false;
    return sync();
  };

  const onOnline = () => {
    void retry();
  };
  const onStorage = (event: Event) => {
    const key = (event as StorageEvent).key;
    const owner = engagementOwner(getSession());
    if (key !== null && key !== storageKey(owner)) return;
    const scope = scopeFor(owner);
    const saved = readStoredJson(storage, storageKey(owner));
    publish(scope, { ...readCollections(saved), pending: readPending(saved) });
    void retry();
  };

  function start() {
    if (unsubscribeSession || disposed) return;
    unsubscribeSession = subscribeSession(onSessionChange);
    eventTarget?.addEventListener('online', onOnline);
    eventTarget?.addEventListener('storage', onStorage);
    if (engagementOwner(getSession()) !== ANONYMOUS_OWNER) void sync();
  }

  return {
    getSnapshot: () => {
      const scope = scopeFor(engagementOwner(getSession()));
      const identity = engagementIdentity(getSession());
      if (scope.state.identity !== identity) scope.state = { ...scope.state, identity };
      return scope.state;
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      start();
      return () => {
        listeners.delete(listener);
      };
    },
    setBookmark(
      slug: string,
      selected: boolean,
      owner = engagementOwner(getSession()),
      identity = engagementIdentity(getSession())
    ) {
      enqueue(owner, 'bookmark', slug, selected, identity);
    },
    setProgress(
      slug: string,
      percent: number | null,
      owner = engagementOwner(getSession()),
      identity = engagementIdentity(getSession())
    ) {
      if (percent !== null && !Number.isFinite(percent)) return;
      const current =
        scopeFor(owner).state.progress.find((entry) => entry.articleSlug === slug)?.percent ?? 0;
      enqueue(
        owner,
        'progress',
        slug,
        percent === null ? null : Math.min(100, Math.max(0, current, percent)),
        identity
      );
    },
    saveNote(
      slug: string,
      body: string,
      owner = engagementOwner(getSession()),
      identity = engagementIdentity(getSession())
    ) {
      enqueue(owner, 'note', slug, body.trim() ? body : null, identity);
    },
    sync,
    retry,
    migrateAnonymous,
    clear(owner = engagementOwner(getSession())) {
      const scope = scopeFor(owner);
      scope.revision += 1;
      clearTimeout(scope.retryTimer);
      scope.loaded = false;
      scope.remote = emptyCollections();
      publish(scope, { ...emptyCollections(), pending: [], error: '', hydrated: true }, true);
      storage.removeItem(storageKey(owner));
    },
    dispose() {
      disposed = true;
      unsubscribeSession?.();
      scopes.forEach((scope) => clearTimeout(scope.retryTimer));
      listeners.clear();
      eventTarget?.removeEventListener('online', onOnline);
      eventTarget?.removeEventListener('storage', onStorage);
    },
  };
}

export type EngagementStore = ReturnType<typeof createEngagementStore>;
