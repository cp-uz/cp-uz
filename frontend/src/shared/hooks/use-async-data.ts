import type { DependencyList } from 'react';

import { useState, useEffect } from 'react';

export function useAsyncData<T>(loader: () => Promise<T>, initial: T, dependencies: DependencyList = []) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    loader()
      .then((result) => {
        if (active) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(reason instanceof Error ? reason : new Error('Ma’lumotni yuklab bo‘lmadi.'));
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
    // The loader is deliberately keyed by explicit dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error };
}
