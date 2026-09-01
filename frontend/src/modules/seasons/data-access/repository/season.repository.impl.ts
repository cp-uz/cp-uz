import type { SeasonRepository } from '../../domain';

import { apiUrl } from 'shared/api/http';

import {
  unwrapSeasonResults,
  normalizeSeasonEvent,
  normalizeSeasonDetail,
  normalizeSeasonSummary,
  normalizeSeasonParticipant,
} from '../mappers';

const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, { expiresAt: number; value: unknown }>();
const inFlight = new Map<string, Promise<unknown>>();

function requestJson(path: string): Promise<unknown> {
  const cached = cache.get(path);
  if (cached && cached.expiresAt > Date.now()) return Promise.resolve(cached.value);
  if (cached) cache.delete(path);

  const pending = inFlight.get(path);
  if (pending) return pending;

  const request = fetch(apiUrl(path), {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })
    .then(async (response) => {
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`Mavsum API xatosi: ${response.status}`);
      return response.json() as Promise<unknown>;
    })
    .then((value) => {
      cache.set(path, { value, expiresAt: Date.now() + CACHE_TTL_MS });
      return value;
    })
    .finally(() => inFlight.delete(path));

  inFlight.set(path, request);
  return request;
}

export const seasonRepository: SeasonRepository = {
  async list() {
    return unwrapSeasonResults(await requestJson('/api/v1/seasons/'))
      .map(normalizeSeasonSummary)
      .filter((season) => season.slug);
  },

  async getCurrent() {
    const payload = await requestJson('/api/v1/seasons/current/');
    return payload ? normalizeSeasonDetail(payload) : null;
  },

  async get(slug) {
    const payload = await requestJson(`/api/v1/seasons/${encodeURIComponent(slug)}/`);
    return payload ? normalizeSeasonDetail(payload) : null;
  },

  async getEvent(seasonSlug, eventSlug) {
    const payload = await requestJson(
      `/api/v1/seasons/${encodeURIComponent(seasonSlug)}/events/${encodeURIComponent(eventSlug)}/`
    );
    return payload ? normalizeSeasonEvent(payload) : null;
  },

  async getParticipant(seasonSlug, participantSlug) {
    const payload = await requestJson(
      `/api/v1/seasons/${encodeURIComponent(seasonSlug)}/participants/${encodeURIComponent(participantSlug)}/`
    );
    return payload ? normalizeSeasonParticipant(payload) : null;
  },
};
