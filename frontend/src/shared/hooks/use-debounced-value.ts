import { useState, useEffect } from 'react';
import { createDebouncer } from 'shared/lib/timing';

export function useDebouncedValue<T>(value: T, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const debouncer = createDebouncer<T>(setDebouncedValue, delay);
    debouncer.schedule(value);
    return () => debouncer.cancel();
  }, [delay, value]);

  return debouncedValue;
}
