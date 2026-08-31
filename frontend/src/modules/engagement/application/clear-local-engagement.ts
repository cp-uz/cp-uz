const EXACT_KEYS = new Set(['cpuz:bookmarks', 'cpuz:completed']);
const KEY_PREFIXES = [
  'cpuz:note:',
  'cpuz:reading-progress:',
  'cpuz:engagement-migrated:',
];

export function clearLocalEngagementData() {
  const keys: string[] = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (
      key &&
      (EXACT_KEYS.has(key) || KEY_PREFIXES.some((prefix) => key.startsWith(prefix)))
    ) {
      keys.push(key);
    }
  }
  keys.forEach((key) => localStorage.removeItem(key));
}
