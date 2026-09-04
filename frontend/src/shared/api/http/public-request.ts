import { ApiError } from './api-error';
import { requestJson } from './request';
import { createRequestCache } from './request-cache';

const publicCache = createRequestCache();

export function publicRequest<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  if (init.signal || init.headers || (init.method && init.method !== 'GET')) {
    return requestJson<T>(path, init);
  }
  return publicCache.get(path, () => requestJson<T>(path, { credentials: 'omit' }), 300_000);
}

export async function optionalPublicRequest<T = unknown>(path: string): Promise<T | null> {
  try {
    return await publicRequest<T>(path);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
