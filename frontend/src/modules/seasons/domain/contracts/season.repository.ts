import type { SeasonEvent, SeasonDetail, SeasonSummary, SeasonParticipant } from '../entities';

export interface SeasonRepository {
  list(): Promise<SeasonSummary[]>;
  getCurrent(): Promise<SeasonDetail | null>;
  get(slug: string): Promise<SeasonDetail | null>;
  getEvent(seasonSlug: string, eventSlug: string): Promise<SeasonEvent | null>;
  getParticipant(seasonSlug: string, participantSlug: string): Promise<SeasonParticipant | null>;
}
