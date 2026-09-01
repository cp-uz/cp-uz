import { seasonRepository } from '../data-access';

export const seasonQueries = {
  list: () => seasonRepository.list(),
  get: (slug: string) => seasonRepository.get(slug),
  getEvent: (seasonSlug: string, eventSlug: string) =>
    seasonRepository.getEvent(seasonSlug, eventSlug),
  getParticipant: (seasonSlug: string, participantSlug: string) =>
    seasonRepository.getParticipant(seasonSlug, participantSlug),

  async getFeatured() {
    const current = await seasonRepository.getCurrent();
    if (current) return current;
    const seasons = await seasonRepository.list();
    const selected =
      seasons.find((season) => season.featured) ??
      seasons.find((season) => season.status === 'published') ??
      seasons[0];
    return selected ? seasonRepository.get(selected.slug) : null;
  },
};
