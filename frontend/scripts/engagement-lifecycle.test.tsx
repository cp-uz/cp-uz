import React, { StrictMode } from 'react';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { AuthSession } from '../src/modules/auth/domain';
import type {
  EngagementRepository,
  BookmarkEntry,
  ProgressEntry,
  NoteEntry,
} from '../src/modules/engagement/domain';

import { createSafeStorage } from '../src/shared/storage';
import { useAsyncData } from '../src/shared/hooks/use-async-data';
import {
  createEngagementStore,
  engagementOwner,
} from '../src/modules/engagement/application/engagement-store';
import { useLocalStorageList } from '../src/modules/engagement/application/use-local-storage-list';
import { useArticleProgress } from '../src/modules/engagement/application/use-article-progress';
import { useArticleNote } from '../src/modules/engagement/application/use-article-note';
import { SettingsProvider } from '../src/app/providers/settings/SettingsProvider';
import { useSettingsContext } from '../src/app/providers/settings/use-settings';
import { defaultSettings } from '../src/app/providers/settings/settings-config';

const stores: ReturnType<typeof createEngagementStore>[] = [];
afterEach(() => {
  cleanup();
  stores.splice(0).forEach((store) => store.dispose());
  localStorage.clear();
});

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

const session = (id: string, isGuest = false): AuthSession => ({
  access: `access-${id}`,
  refresh: `refresh-${id}`,
  user: { id, username: id, isGuest },
});
type ServerState = { bookmarks: BookmarkEntry[]; progress: ProgressEntry[]; notes: NoteEntry[] };
function fixture(initial: AuthSession | null = session('A')) {
  let current = initial;
  let offline = false;
  let nextId = 10;
  const subscribers = new Set<() => void>();
  const users = new Map<string, ServerState>();
  const calls: { user: string; operation: string; slug?: string; id?: number | string }[] = [];
  const repositories = new Map<string, EngagementRepository>();
  const user = (id: string) => {
    if (!users.has(id)) users.set(id, { bookmarks: [], progress: [], notes: [] });
    return users.get(id)!;
  };
  const check = () => {
    if (offline) throw new Error('offline');
  };
  const repository = (id: string): EngagementRepository => {
    if (repositories.has(id)) return repositories.get(id)!;
    const data = user(id);
    const api: EngagementRepository = {
      listBookmarks: async () => {
        check();
        return [...data.bookmarks];
      },
      listProgress: async () => {
        check();
        return [...data.progress];
      },
      listNotes: async () => {
        check();
        return [...data.notes];
      },
      addBookmark: async (slug) => {
        check();
        calls.push({ user: id, operation: 'addBookmark', slug });
        const saved = { id: nextId++, articleSlug: slug };
        data.bookmarks.push(saved);
        return saved;
      },
      removeBookmark: async (entryId) => {
        check();
        calls.push({ user: id, operation: 'removeBookmark', id: entryId });
        data.bookmarks = data.bookmarks.filter((entry) => entry.id !== entryId);
      },
      setProgress: async (slug, percent) => {
        check();
        calls.push({ user: id, operation: 'setProgress', slug });
        const saved = {
          id: nextId++,
          articleSlug: slug,
          percent,
          status: percent === 100 ? 'completed' : 'in_progress',
        };
        data.progress = [...data.progress.filter((entry) => entry.articleSlug !== slug), saved];
        return saved;
      },
      removeProgress: async (entryId) => {
        check();
        data.progress = data.progress.filter((entry) => entry.id !== entryId);
      },
      saveNote: async (slug, body) => {
        check();
        calls.push({ user: id, operation: 'saveNote', slug });
        const saved = { id: nextId++, articleSlug: slug, body, anchor: '' };
        data.notes = [...data.notes.filter((entry) => entry.articleSlug !== slug), saved];
        return saved;
      },
      removeNote: async (entryId) => {
        check();
        data.notes = data.notes.filter((entry) => entry.id !== entryId);
      },
    };
    repositories.set(id, api);
    return api;
  };
  const dependencies = {
    storage: createSafeStorage(() => localStorage),
    repository,
    getSession: () => current,
    ensureSession: vi.fn(async () => {
      check();
      current ??= session('guest', true);
      subscribers.forEach((callback) => callback());
      return current;
    }),
    subscribeSession: (callback: () => void) => {
      subscribers.add(callback);
      return () => {
        subscribers.delete(callback);
      };
    },
    eventTarget: window,
    retryDelayMs: 60_000,
  };
  const create = () => {
    const store = createEngagementStore(dependencies);
    stores.push(store);
    return store;
  };
  return {
    create,
    repository,
    user,
    calls,
    dependencies,
    setOffline(value: boolean) {
      offline = value;
    },
    login(value: AuthSession | null) {
      current = value;
      subscribers.forEach((callback) => callback());
    },
  };
}

describe('real React engagement lifecycle', () => {
  it('blocks callbacks and drafts from a previous login of the same user ID', async () => {
    const f = fixture({ ...session('A'), sessionKey: 'old-login' });
    const store = f.create();
    const view = renderHook(() => ({
      list: useLocalStorageList('cpuz:bookmarks', [], store),
      note: useArticleNote('article', store),
    }));
    await act(async () => {
      await store.sync();
    });
    act(() => view.result.current.note.setNote('old session draft'));
    const oldToggle = view.result.current.list.toggle;
    const oldSave = view.result.current.note.saveNote;
    act(() => f.login({ ...session('A'), sessionKey: 'new-login' }));
    expect(view.result.current.note.note).toBe('');
    act(() => {
      oldToggle('old-article');
      oldSave();
    });
    await act(async () => {
      await store.sync();
    });
    expect(f.calls).toEqual([]);
    expect(store.getSnapshot().pending).toEqual([]);
  });
  it('isolates bookmarks, notes and stale callbacks when the account changes', async () => {
    const f = fixture();
    f.user('A').bookmarks.push({ id: 41, articleSlug: 'private-A' });
    f.user('A').notes.push({
      id: 42,
      articleSlug: 'shared-article',
      body: 'A private note',
      anchor: '',
    });
    const store = f.create();
    const view = renderHook(() => ({
      list: useLocalStorageList('cpuz:bookmarks', [], store),
      note: useArticleNote('shared-article', store),
    }));
    await waitFor(() => expect(view.result.current.list.items).toEqual(['private-A']));
    expect(view.result.current.note.note).toBe('A private note');
    const oldToggle = view.result.current.list.toggle;
    act(() => view.result.current.note.setNote('unsaved A draft'));
    act(() => f.login(session('B')));
    expect(view.result.current.list.items).toEqual([]);
    expect(view.result.current.note.note).toBe('');
    act(() => oldToggle('private-A'));
    await act(async () => {
      await store.sync();
    });
    expect(f.calls).toEqual([]);
    expect(f.user('A').bookmarks).toHaveLength(1);
  });

  it('never completes unread B when navigating from completed A, including StrictMode', async () => {
    const f = fixture();
    f.user('A').progress.push({
      id: 11,
      articleSlug: 'article-A',
      percent: 100,
      status: 'completed',
    });
    const store = f.create();
    const headings: { id: string }[] = [];
    const view = renderHook(({ slug }) => useArticleProgress(slug, headings, store), {
      initialProps: { slug: 'article-A' },
      wrapper: ({ children }) => <StrictMode>{children}</StrictMode>,
    });
    await waitFor(() => expect(view.result.current.readingProgress).toBe(100));
    view.rerender({ slug: 'article-B' });
    expect(view.result.current.readingProgress).toBe(0);
    expect(view.result.current.isArticleCompleted).toBe(false);
    await act(async () => {
      await store.sync();
    });
    expect(f.calls).toEqual([]);
    expect(store.getSnapshot().pending).toEqual([]);
    act(() => view.result.current.setReadingProgress(100));
    await waitFor(() =>
      expect(f.user('A').progress.find((row) => row.articleSlug === 'article-B')?.percent).toBe(100)
    );
  });

  it('does not overwrite an edited note when a delayed server snapshot arrives', async () => {
    const f = fixture();
    const incoming = deferred<NoteEntry[]>();
    f.repository('A').listNotes = () => incoming.promise;
    const store = f.create();
    const view = renderHook(() => useArticleNote('article', store));
    act(() => view.result.current.setNote('new draft'));
    await act(async () =>
      incoming.resolve([{ id: 1, articleSlug: 'article', body: 'old server text', anchor: '' }])
    );
    expect(view.result.current.note).toBe('new draft');
    act(() => view.result.current.saveNote());
    await waitFor(() => expect(f.user('A').notes[0]?.body).toBe('new draft'));
  });
});

describe('durable identity-scoped engagement outbox', () => {
  it('preserves the first anonymous action across the lazy guest session transition', async () => {
    const f = fixture(null);
    const store = f.create();
    const view = renderHook(() => useLocalStorageList('cpuz:bookmarks', [], store));
    act(() => view.result.current.toggle('first-article'));
    await waitFor(() => expect(f.user('guest').bookmarks[0]?.articleSlug).toBe('first-article'));
    expect(store.getSnapshot().owner).toBe('user:guest');
    expect(store.getSnapshot().pending).toEqual([]);
    expect(f.dependencies.ensureSession).toHaveBeenCalledOnce();
  });
  it('retains offline deletion across reload and retries when online without resurrecting the item', async () => {
    const f = fixture();
    f.user('A').bookmarks.push({ id: 41, articleSlug: 'article' });
    let store = f.create();
    await store.sync();
    f.setOffline(true);
    store.setBookmark('article', false);
    await store.sync();
    expect(store.getSnapshot().bookmarks).toEqual([]);
    expect(store.getSnapshot().pending).toHaveLength(1);
    store.dispose();
    store = f.create();
    const view = renderHook(() => useLocalStorageList('cpuz:bookmarks', [], store));
    expect(view.result.current.items).toEqual([]);
    await act(async () => {
      await store.sync();
    });
    f.setOffline(false);
    act(() => window.dispatchEvent(new Event('online')));
    await waitFor(() => expect(store.getSnapshot().pending).toEqual([]));
    expect(f.user('A').bookmarks).toEqual([]);
    expect(view.result.current.items).toEqual([]);
  });

  it('serializes fast add/remove while POST is pending, using the returned server ID', async () => {
    const f = fixture();
    const saved = deferred<BookmarkEntry>();
    const started = vi.fn();
    f.repository('A').addBookmark = async () => {
      started();
      const entry = await saved.promise;
      f.user('A').bookmarks.push(entry);
      return entry;
    };
    const store = f.create();
    await store.sync();
    store.setBookmark('article', true);
    await waitFor(() => expect(started).toHaveBeenCalledOnce());
    store.setBookmark('article', false);
    saved.resolve({ id: 99, articleSlug: 'article' });
    await store.sync();
    expect(f.calls).toEqual([{ user: 'A', operation: 'removeBookmark', id: 99 }]);
    expect(store.getSnapshot().bookmarks).toEqual([]);
    expect(store.getSnapshot().pending).toEqual([]);
  });

  it('keeps an explicit progress reset before a newly observed percentage', async () => {
    const f = fixture();
    f.user('A').progress = [{ id: 42, articleSlug: 'article', percent: 100, status: 'completed' }];
    const remove = vi.spyOn(f.repository('A'), 'removeProgress');
    const store = f.create();
    await store.sync();
    store.setProgress('article', null);
    store.setProgress('article', 25);
    await store.sync();
    expect(remove).toHaveBeenCalledWith(42);
    expect(store.getSnapshot().progress[0].percent).toBe(25);
    expect(f.user('A').progress[0].percent).toBe(25);
    expect(store.getSnapshot().pending).toEqual([]);
  });

  it('keeps the old owner outbox when identity changes during a write', async () => {
    const f = fixture();
    const saved = deferred<BookmarkEntry>();
    const started = vi.fn();
    f.repository('A').addBookmark = async () => {
      started();
      return saved.promise;
    };
    const store = f.create();
    const stop = store.subscribe(() => undefined);
    await store.sync();
    store.setBookmark('article-A', true);
    await waitFor(() => expect(started).toHaveBeenCalledOnce());
    f.login(session('B'));
    store.setBookmark('article-B', true);
    saved.resolve({ id: 1, articleSlug: 'article-A' });
    await store.sync();
    expect(store.getSnapshot().owner).toBe('user:B');
    expect(store.getSnapshot().bookmarks.map((row) => row.articleSlug)).toEqual(['article-B']);
    expect(f.calls.filter((call) => call.user === 'B').map((call) => call.slug)).toEqual([
      'article-B',
    ]);
    stop();
  });

  it('migrates only known anonymous data to a guest; registered login never imports legacy data', async () => {
    const f = fixture(null);
    localStorage.setItem('cpuz:bookmarks', '["someone-elses-legacy-bookmark"]');
    f.setOffline(true);
    const store = f.create();
    store.setBookmark('anonymous-article', true);
    await store.sync();
    f.login(session('registered'));
    store.migrateAnonymous(session('registered'));
    expect(store.getSnapshot().bookmarks).toEqual([]);
    f.login(session('guest'));
    store.migrateAnonymous(session('guest', true));
    expect(store.getSnapshot().bookmarks).toEqual([]);
    f.login(session('guest', true));
    store.migrateAnonymous(session('guest', true));
    expect(store.getSnapshot().bookmarks.map((row) => row.articleSlug)).toEqual([
      'anonymous-article',
    ]);
    expect(localStorage.getItem('cpuz:bookmarks')).toBe('["someone-elses-legacy-bookmark"]');
  });

  it('clears the deleted account scope after logout without clearing a different account', async () => {
    const f = fixture();
    const store = f.create();
    store.setBookmark('article-A', true);
    await store.sync();
    const deletingOwner = engagementOwner(session('A'));
    f.login(session('B'));
    store.setBookmark('article-B', true);
    await store.sync();
    store.clear(deletingOwner);
    expect(store.getSnapshot().bookmarks[0].articleSlug).toBe('article-B');
    expect(localStorage.getItem('cpuz:engagement:v2:user%3AA')).toBeNull();
  });
});

describe('query identity and safe storage', () => {
  it('mounts and updates SettingsProvider when native storage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError');
    });
    const view = renderHook(() => useSettingsContext(), {
      wrapper: ({ children }) => (
        <SettingsProvider storageKey="test-blocked-settings" defaultSettings={defaultSettings}>
          {children}
        </SettingsProvider>
      ),
    });
    expect(view.result.current.state.fontSize).toBe(defaultSettings.fontSize);
    act(() => view.result.current.setField('fontSize', 18));
    expect(view.result.current.state.fontSize).toBe(18);
  });

  it('validates stored settings before passing them into theme creation', () => {
    localStorage.setItem(
      'test-invalid-settings',
      JSON.stringify({
        ...defaultSettings,
        primaryColor: 'broken',
        fontSize: 'bad',
        mode: 'invalid',
        fontFamily: ['invalid'],
      })
    );
    const view = renderHook(() => useSettingsContext(), {
      wrapper: ({ children }) => (
        <SettingsProvider storageKey="test-invalid-settings" defaultSettings={defaultSettings}>
          {children}
        </SettingsProvider>
      ),
    });
    expect(view.result.current.state).toEqual(defaultSettings);
  });
  it('clears A during the first render for B and preserves B errors without showing A', async () => {
    const next = deferred<string>();
    const view = renderHook(
      ({ id }) =>
        useAsyncData(
          () => (id === 'A' ? Promise.resolve('article A') : next.promise),
          null as string | null,
          [id]
        ),
      { initialProps: { id: 'A' } }
    );
    await waitFor(() => expect(view.result.current.data).toBe('article A'));
    view.rerender({ id: 'B' });
    expect(view.result.current).toMatchObject({ data: null, loading: true, error: null });
    await act(async () => next.reject(new Error('B not found')));
    expect(view.result.current.data).toBeNull();
    expect(view.result.current.error?.message).toBe('B not found');
  });

  it('ignores an earlier response that completes after navigation', async () => {
    const first = deferred<string>();
    const view = renderHook(
      ({ id }) =>
        useAsyncData(
          () => (id === 'A' ? first.promise : Promise.resolve('B')),
          null as string | null,
          [id]
        ),
      { initialProps: { id: 'A' } }
    );
    view.rerender({ id: 'B' });
    await waitFor(() => expect(view.result.current.data).toBe('B'));
    await act(async () => first.resolve('A'));
    expect(view.result.current.data).toBe('B');
  });

  it('keeps memory changes and deletions usable when browser storage is blocked', () => {
    const storage = createSafeStorage(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    expect(storage.getItem('key')).toBeNull();
    expect(storage.setItem('key', 'value')).toBe(false);
    expect(storage.getItem('key')).toBe('value');
    expect(storage.keys()).toContain('key');
    storage.removeItem('key');
    expect(storage.getItem('key')).toBeNull();
    expect(storage.keys()).not.toContain('key');
  });

  it('ignores malformed local data shapes rather than exposing them to hooks', () => {
    const f = fixture();
    localStorage.setItem(
      'cpuz:engagement:v2:user%3AA',
      JSON.stringify({
        bookmarks: null,
        progress: [{ percent: 'bad' }],
        notes: {},
        pending: ['bad'],
      })
    );
    expect(f.create().getSnapshot()).toMatchObject({
      bookmarks: [],
      progress: [],
      notes: [],
      pending: [],
    });
  });
});
