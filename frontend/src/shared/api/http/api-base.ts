const configuredBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();

export const API_BASE_URL = (configuredBase || '/api/v1').replace(/\/$/, '');

export function apiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (API_BASE_URL.endsWith('/api/v1') && normalizedPath.startsWith('/api/v1/')) {
    return `${API_BASE_URL}${normalizedPath.slice('/api/v1'.length)}`;
  }
  return `${API_BASE_URL}${normalizedPath}`;
}

export function resolveApiAssetUrl(value: string) {
  if (!value || /^https?:\/\//i.test(value) || !value.startsWith('/')) return value;
  if (/^https?:\/\//i.test(API_BASE_URL)) return `${new URL(API_BASE_URL).origin}${value}`;
  return value;
}
