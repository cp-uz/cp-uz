import { problemRepository } from '../data-access';

export const problemQueries = {
  catalog: (seasonSlug?: string) => problemRepository.catalog(seasonSlug),
  event: (seasonSlug: string, eventSlug: string) =>
    problemRepository.event(seasonSlug, eventSlug),
  detail: (seasonSlug: string, eventSlug: string, problemSlug: string) =>
    problemRepository.detail(seasonSlug, eventSlug, problemSlug),
};
