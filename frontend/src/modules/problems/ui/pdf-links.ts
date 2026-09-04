/** PDF attachments and annotations must never turn arbitrary schemes into browser actions. */
export function pdfHttpUrl(value: string, allowRelative = false): string | undefined {
  try {
    if (!value.trim()) return undefined;
    const base = typeof window === 'undefined' ? 'https://cp.uz' : window.location.href;
    const parsed = allowRelative ? new URL(value, base) : new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
      ? allowRelative
        ? value
        : parsed.href
      : undefined;
  } catch {
    return undefined;
  }
}
