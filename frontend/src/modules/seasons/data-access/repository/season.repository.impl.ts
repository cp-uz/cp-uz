import type { ApiSchema } from 'shared/api/generated';
import type { SeasonRepository } from '../../domain';

import { publicRequest, optionalPublicRequest as requestJson } from 'shared/api/http';

import {
  normalizeSeasonEvent,
  normalizeSeasonDetail,
  normalizeSeasonSummary,
  normalizeSeasonParticipant,
} from '../mappers';

export const seasonRepository: SeasonRepository = {
  async list() {
    return (await publicRequest<ApiSchema<'SeasonList'>[]>('/api/v1/seasons/')).map(
      normalizeSeasonSummary
    );
  },

  async getCurrent() {
    const payload = await requestJson<ApiSchema<'SeasonGraph'>>('/api/v1/seasons/current/');
    return payload ? normalizeSeasonDetail(payload) : null;
  },

  async get(slug) {
    const payload = await requestJson<ApiSchema<'SeasonGraph'>>(
      `/api/v1/seasons/${encodeURIComponent(slug)}/`
    );
    return payload ? normalizeSeasonDetail(payload) : null;
  },

  async getEvent(seasonSlug, eventSlug) {
    const payload = await requestJson<ApiSchema<'EventDetail'>>(
      `/api/v1/seasons/${encodeURIComponent(seasonSlug)}/events/${encodeURIComponent(eventSlug)}/`
    );
    return payload ? normalizeSeasonEvent(payload) : null;
  },

  async getParticipant(seasonSlug, participantSlug) {
    const payload = await requestJson<ApiSchema<'ParticipantDetail'>>(
      `/api/v1/seasons/${encodeURIComponent(seasonSlug)}/participants/${encodeURIComponent(participantSlug)}/`
    );
    return payload ? normalizeSeasonParticipant(payload) : null;
  },
};
