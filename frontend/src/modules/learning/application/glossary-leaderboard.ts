import { glossaryRepository } from '../data-access/repository/glossary.repository';

export type {
  ScoreResult,
  RankedAnswer,
  RankedQuestion,
  GlossaryLeaderboardEntry,
  GlossaryLeaderboardState,
} from '../domain/entities/quiz.types';
export const glossaryLeaderboardApi = glossaryRepository;
