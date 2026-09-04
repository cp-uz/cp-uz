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
  participantCount: number;
};

export type RankedQuestion = {
  id: string;
  mode: 'english_to_uzbek' | 'uzbek_to_english' | 'definition_to_english' | 'definition_to_uzbek';
  modeLabel: string;
  instruction: string;
  prompt: string;
  options: string[];
  expiresAt: string;
};

export type RankedAnswer = { questionId: string; isCorrect: boolean; correctAnswer: string };
export type ScoreResult = GlossaryLeaderboardState & { answer: RankedAnswer };
export type PendingGlossaryScore = { id: string; questionId: string; selectedAnswer: string };
