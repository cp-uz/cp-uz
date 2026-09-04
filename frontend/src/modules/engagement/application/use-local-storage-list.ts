import type { EngagementStore } from './engagement-store';

import { useMemo, useCallback, useSyncExternalStore } from 'react';

import { engagementStore } from './engagement-service';

export function useEngagementState(store: EngagementStore = engagementStore) {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}

/** List facade backed by one identity-scoped store, with no component-owned storage writes. */
export function useLocalStorageList(
  key: 'cpuz:bookmarks' | 'cpuz:completed',
  _initial: string[] = [],
  store: EngagementStore = engagementStore
) {
  const state = useEngagementState(store);
  const items = useMemo(
    () =>
      key === 'cpuz:bookmarks'
        ? state.bookmarks.map((entry) => entry.articleSlug)
        : state.progress.filter((entry) => entry.percent >= 100).map((entry) => entry.articleSlug),
    [key, state.bookmarks, state.progress]
  );
  const toggle = useCallback(
    (slug: string) => {
      const current = store.getSnapshot();
      if (current.identity !== state.identity) return;
      if (key === 'cpuz:bookmarks') {
        store.setBookmark(
          slug,
          !current.bookmarks.some((entry) => entry.articleSlug === slug),
          state.owner,
          state.identity
        );
      } else {
        const completed = current.progress.some(
          (entry) => entry.articleSlug === slug && entry.percent >= 100
        );
        store.setProgress(slug, completed ? null : 100, state.owner, state.identity);
      }
    },
    [key, state.owner, state.identity, store]
  );
  return { items, toggle, has: (slug: string) => items.includes(slug) };
}
