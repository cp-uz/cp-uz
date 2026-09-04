import type { DependencyList } from 'react';

import { useRef, useState, useEffect } from 'react';

export function useAsyncData<T>(
  loader: () => Promise<T>,
  initial: T,
  dependencies: DependencyList = []
) {
  const keyRef = useRef({ dependencies, version: 0 });
  if (
    dependencies.length !== keyRef.current.dependencies.length ||
    dependencies.some((value, index) => !Object.is(value, keyRef.current.dependencies[index]))
  ) {
    keyRef.current = { dependencies, version: keyRef.current.version + 1 };
  }
  const version = keyRef.current.version;
  const [state, setState] = useState({
    version,
    data: initial,
    loading: true,
    error: null as Error | null,
  });

  useEffect(() => {
    let active = true;
    setState({ version, data: initial, loading: true, error: null });
    Promise.resolve()
      .then(loader)
      .then((result) => {
        if (active) {
          setState({ version, data: result, loading: false, error: null });
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setState({
            version,
            data: initial,
            loading: false,
            error: reason instanceof Error ? reason : new Error('Ma’lumotni yuklab bo‘lmadi.'),
          });
        }
      });
    return () => {
      active = false;
    };
    // The loader is deliberately keyed by explicit dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  // Never expose the previous resource even during the render before effect cleanup.
  return state.version === version ? state : { data: initial, loading: true, error: null };
}
