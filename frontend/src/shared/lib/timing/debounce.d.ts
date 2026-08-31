export type TimerScheduler = Pick<typeof globalThis, 'setTimeout' | 'clearTimeout'>;
export function createDebouncer<T>(
  callback: (value: T) => void,
  delay?: number,
  scheduler?: TimerScheduler
): { schedule(value: T): void; cancel(): void };
