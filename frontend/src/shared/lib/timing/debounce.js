export function createDebouncer(callback, delay = 300, scheduler = globalThis) {
  let timer;
  return {
    schedule(value) {
      if (timer !== undefined) scheduler.clearTimeout(timer);
      timer = scheduler.setTimeout(() => callback(value), delay);
    },
    cancel() {
      if (timer !== undefined) scheduler.clearTimeout(timer);
      timer = undefined;
    },
  };
}
