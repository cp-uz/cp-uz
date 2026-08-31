import { apiUrl } from 'shared/api/http';
import { authenticatedRequest } from 'modules/auth/application';

export type GlossaryLeaderboardEntry = {
  rank: number;
  name: string;
  correct: number;
  total: number;
  percent: number;
  currentStreak: number;
  bestStreak: number;
  isCurrentUser: boolean;
  updatedAt: string;
};

export type GlossaryLeaderboardState = {
  leaderboard: GlossaryLeaderboardEntry[];
  personal: GlossaryLeaderboardEntry | null;
};

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function normalizeEntry(value: unknown, index = 0): GlossaryLeaderboardEntry {
    const row = record(value);
    const correct = Number(row.correct ?? 0);
    const total = Number(row.total ?? 5);
    return {
      rank: Number(row.rank ?? index + 1),
      name: typeof row.name === 'string' && row.name.trim() ? row.name.trim() : 'Ishtirokchi',
      correct,
      total,
      percent: Number(row.percent ?? (total > 0 ? Math.round((correct / total) * 100) : 0)),
      currentStreak: Number(row.current_streak ?? 0),
      bestStreak: Number(row.best_streak ?? 0),
      isCurrentUser: Boolean(row.is_current_user),
      updatedAt: typeof row.updated_at === 'string' ? row.updated_at : '',
    };
}

function normalizeLeaderboardState(payload: unknown): GlossaryLeaderboardState {
  const state = record(payload);
  const rows = Array.isArray(state.leaderboard) ? state.leaderboard : [];
  const personalValue = state.personal;
  return {
    leaderboard: rows.slice(0, 3).map(normalizeEntry),
    personal: personalValue ? normalizeEntry(personalValue) : null,
  };
}

async function listLeaderboard() {
  const response = await fetch(apiUrl('/api/v1/glossary/leaderboard/'), {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Reytingni yuklab bo‘lmadi.');
  return normalizeLeaderboardState(await response.json());
}

async function submitScore(isCorrect: boolean) {
  const payload = await authenticatedRequest<unknown>('/api/v1/glossary/score/', {
    method: 'POST',
    body: JSON.stringify({ is_correct: isCorrect }),
  });
  return normalizeLeaderboardState(payload);
}

export const glossaryLeaderboardApi = { listLeaderboard, submitScore };
