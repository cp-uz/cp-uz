import { apiUrl } from './api-base';
import { ApiError, InvalidApiResponseError } from './api-error';

export async function requestJson<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (typeof init.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const response = await fetch(apiUrl(path), { ...init, headers });
  if (response.status === 204 && response.ok) return undefined as T;
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    if (!response.ok) throw new ApiError(response.status, null);
    throw new InvalidApiResponseError();
  }
  if (!response.ok) throw new ApiError(response.status, payload);
  return payload as T;
}
