export type SafeStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => boolean;
  removeItem: (key: string) => void;
  keys: () => string[];
};

/** Storage is an optional persistence layer; unavailable storage must not break reading. */
export function createSafeStorage(getStorage: () => Storage | undefined): SafeStorage {
  const fallback = new Map<string, string | null>();

  return {
    getItem(key) {
      if (fallback.has(key)) return fallback.get(key) ?? null;
      try {
        return getStorage()?.getItem(key) ?? null;
      } catch {
        return null;
      }
    },
    setItem(key, value) {
      try {
        const storage = getStorage();
        if (!storage) throw new Error('Storage unavailable');
        storage.setItem(key, value);
        fallback.delete(key);
        return true;
      } catch {
        fallback.set(key, value);
        return false;
      }
    },
    removeItem(key) {
      try {
        getStorage()?.removeItem(key);
        fallback.delete(key);
      } catch {
        fallback.set(key, null);
      }
    },
    keys() {
      const keys = new Set(fallback.keys());
      try {
        const storage = getStorage();
        for (let index = 0; storage && index < storage.length; index += 1) {
          const key = storage.key(index);
          if (key) keys.add(key);
        }
      } catch {
        // Memory-only values remain available.
      }
      return [...keys].filter((key) => fallback.get(key) !== null);
    },
  };
}

export const safeStorage = createSafeStorage(() =>
  typeof localStorage === 'undefined' ? undefined : localStorage
);

export function readStoredJson(storage: SafeStorage, key: string): unknown {
  try {
    return JSON.parse(storage.getItem(key) ?? 'null') as unknown;
  } catch {
    return null;
  }
}
