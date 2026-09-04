import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ApiSchema } from '../src/shared/api/generated';
import { authenticatedRequest } from '../src/modules/auth/application';
import { glossaryRepository } from '../src/modules/learning/data-access/repository/glossary.repository';
import { InvalidApiResponseError } from '../src/shared/api/http';

vi.mock('../src/modules/auth/application', () => ({ authenticatedRequest: vi.fn() }));
afterEach(() => vi.unstubAllGlobals());

const entry: ApiSchema<'GlossaryLeaderboardEntry'> = {
  rank: 1,
  name: 'Aziza',
  correct: 0,
  total: 1,
  percent: 0,
  current_streak: 0,
  best_streak: 0,
  is_current_user: false,
  updated_at: '2026-09-05T00:00:00Z',
};

describe('generated glossary contract', () => {
  it('keeps zero statistics and a nullable personal score', async () => {
    const dto: ApiSchema<'GlossaryQuizState'> = {
      leaderboard: [entry],
      personal: null,
      participant_count: 1,
    };
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify(dto)))
    );
    await expect(glossaryRepository.listLeaderboard()).resolves.toEqual({
      leaderboard: [
        {
          rank: 1,
          name: 'Aziza',
          correct: 0,
          total: 1,
          percent: 0,
          currentStreak: 0,
          bestStreak: 0,
          isCurrentUser: false,
          updatedAt: entry.updated_at,
        },
      ],
      personal: null,
      participantCount: 1,
    });
  });

  it.each([{ percent: '0' }, { updated_at: null }])(
    'rejects malformed leaderboard fields instead of silently coercing %j',
    async (invalid) => {
      vi.stubGlobal(
        'fetch',
        vi.fn(
          async () =>
            new Response(
              JSON.stringify({
                leaderboard: [{ ...entry, ...invalid }],
                personal: null,
                participant_count: 1,
              })
            )
        )
      );
      await expect(glossaryRepository.listLeaderboard()).rejects.toBeInstanceOf(
        InvalidApiResponseError
      );
    }
  );

  it('rejects duplicate question options and uses the expected account for ranked questions', async () => {
    const question: ApiSchema<'GlossaryQuizQuestion'> = {
      id: 'c3316e4c-014f-480b-8f6d-590b3fbe1a31',
      mode: 'english_to_uzbek',
      mode_label: 'Tarjima',
      instruction: 'Tanlang',
      prompt: 'array',
      options: ['massiv', 'satr', 'son', 'massiv'],
      expires_at: '2026-09-05T01:00:00Z',
    };
    vi.mocked(authenticatedRequest).mockResolvedValue(question);
    await expect(glossaryRepository.getQuestion(7)).rejects.toBeInstanceOf(InvalidApiResponseError);
    expect(authenticatedRequest).toHaveBeenCalledWith(
      '/api/v1/glossary/questions/',
      { method: 'POST', body: '{}' },
      { expectedUserId: 7 }
    );
  });
});
