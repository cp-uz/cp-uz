/** A bounded cache that never republishes a response invalidated while in flight. */
export function createRequestCache(maxEntries = 100) {
  const values = new Map<string, { value: unknown; expiresAt: number }>();
  const pending = new Map<string, Promise<unknown>>();
  let revision = 0;

  return {
    invalidate() {
      revision += 1;
      values.clear();
      pending.clear();
    },
    get<T>(key: string, load: () => Promise<T>, ttlMs: number): Promise<T> {
      const cached = values.get(key);
      if (cached && cached.expiresAt > Date.now()) return Promise.resolve(cached.value as T);
      values.delete(key);
      const existing = pending.get(key);
      if (existing) return existing as Promise<T>;

      const startedAt = revision;
      const request = Promise.resolve()
        .then(load)
        .then((value) => {
          if (startedAt === revision) {
            values.set(key, { value, expiresAt: Date.now() + ttlMs });
            while (values.size > maxEntries) values.delete(values.keys().next().value!);
          }
          return value;
        })
        .finally(() => {
          if (pending.get(key) === request) pending.delete(key);
        });
      pending.set(key, request);
      return request;
    },
  };
}
