import { useState, useEffect, useCallback } from 'react';
import { useAuthSession } from 'modules/auth/application';

import { engagementApi } from './engagement-service';

const serverIds = new Map<string, number | string>();

export function useLocalStorageList(key: string, initial: string[] = []) {
  const session = useAuthSession();
  const sessionUserId = session?.user.id;
  const [items, setItems] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as string[]) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => localStorage.setItem(key, JSON.stringify(items)), [items, key]);

  useEffect(() => {
    if (!sessionUserId || !['cpuz:bookmarks', 'cpuz:completed'].includes(key)) return undefined;
    let active = true;
    const load =
      key === 'cpuz:bookmarks'
        ? engagementApi.listBookmarks().then((entries) => ({
            values: entries.map((entry) => entry.articleSlug),
            ids: entries.map((entry) => [entry.articleSlug, entry.id] as const),
          }))
        : engagementApi.listProgress().then((entries) => {
            const completed = entries.filter((entry) => entry.percent >= 100);
            return {
              values: completed.map((entry) => entry.articleSlug),
              ids: completed.map((entry) => [entry.articleSlug, entry.id] as const),
            };
          });
    load
      .then(({ values, ids }) => {
        if (!active) return;
        ids.forEach(([slug, id]) => serverIds.set(`${key}:${slug}`, id));
        setItems((current) => [...new Set([...current, ...values])]);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [key, sessionUserId]);

  const toggle = useCallback(
    (value: string) => {
      const exists = items.includes(value);
      setItems((current) =>
        exists ? current.filter((item) => item !== value) : [...current, value]
      );
      const sync = async () => {
        if (key === 'cpuz:bookmarks') {
          if (exists) {
            const id = serverIds.get(`${key}:${value}`);
            if (id !== undefined) await engagementApi.removeBookmark(id);
            serverIds.delete(`${key}:${value}`);
          } else {
            const entry = await engagementApi.addBookmark(value);
            serverIds.set(`${key}:${value}`, entry.id);
          }
        }
        if (key === 'cpuz:completed') {
          if (exists) {
            const id = serverIds.get(`${key}:${value}`);
            if (id !== undefined) await engagementApi.removeProgress(id);
            serverIds.delete(`${key}:${value}`);
          } else {
            const entry = await engagementApi.setProgress(value, 100);
            serverIds.set(`${key}:${value}`, entry.id);
          }
        }
      };
      // Local state remains the offline source of truth. A failed lazy-session
      // or API write is retried by the local engagement migration later.
      void sync().catch(() => undefined);
    },
    [items, key]
  );

  return { items, toggle, has: (value: string) => items.includes(value) };
}
