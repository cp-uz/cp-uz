import type { ApiSchema } from 'shared/api/generated';
import type {
  ScoreResult,
  RankedQuestion,
  PendingGlossaryScore,
  GlossaryLeaderboardEntry,
  GlossaryLeaderboardState,
} from '../../domain/entities/quiz.types';

import { authenticatedRequest } from 'modules/auth/application';
import { requestJson, InvalidApiResponseError } from 'shared/api/http';

function assertRecord(value: unknown): void {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new InvalidApiResponseError();
}
function text(value: unknown): string {
  if (typeof value !== 'string') throw new InvalidApiResponseError();
  return value;
}
function number(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new InvalidApiResponseError();
  return value;
}
function flag(value: unknown): boolean {
  if (typeof value !== 'boolean') throw new InvalidApiResponseError();
  return value;
}
function entry(row: ApiSchema<'GlossaryLeaderboardEntry'>): GlossaryLeaderboardEntry {
  assertRecord(row);
  return {
    rank: number(row.rank),
    name: text(row.name),
    correct: number(row.correct),
    total: number(row.total),
    percent: number(row.percent),
    currentStreak: number(row.current_streak),
    bestStreak: number(row.best_streak),
    isCurrentUser: flag(row.is_current_user),
    updatedAt: text(row.updated_at),
  };
}
function state(dto: ApiSchema<'GlossaryQuizState'>): GlossaryLeaderboardState {
  assertRecord(dto);
  if (!Array.isArray(dto.leaderboard)) throw new InvalidApiResponseError();
  return {
    leaderboard: dto.leaderboard.map(entry),
    personal: dto.personal === null ? null : entry(dto.personal),
    participantCount: number(dto.participant_count),
  };
}

export const glossaryRepository = {
  async listLeaderboard(owner?: number | string) {
    const path = '/api/v1/glossary/leaderboard/';
    return state(
      owner === undefined
        ? await requestJson<ApiSchema<'GlossaryQuizState'>>(path)
        : await authenticatedRequest<ApiSchema<'GlossaryQuizState'>>(
            path,
            {},
            { expectedUserId: owner }
          )
    );
  },
  async getQuestion(owner: number | string): Promise<RankedQuestion> {
    const dto = await authenticatedRequest<ApiSchema<'GlossaryQuizQuestion'>>(
      '/api/v1/glossary/questions/',
      { method: 'POST', body: '{}' },
      { expectedUserId: owner }
    );
    assertRecord(dto);
    const modes = [
      'english_to_uzbek',
      'uzbek_to_english',
      'definition_to_english',
      'definition_to_uzbek',
    ] satisfies ApiSchema<'GlossaryQuizQuestion'>['mode'][];
    if (
      !modes.includes(dto.mode) ||
      !Array.isArray(dto.options) ||
      dto.options.length !== 4 ||
      new Set(dto.options).size !== 4
    )
      throw new InvalidApiResponseError();
    return {
      id: text(dto.id),
      mode: dto.mode,
      modeLabel: text(dto.mode_label),
      instruction: text(dto.instruction),
      prompt: text(dto.prompt),
      options: dto.options.map(text),
      expiresAt: text(dto.expires_at),
    };
  },
  async submitScore(owner: number | string, answer: PendingGlossaryScore): Promise<ScoreResult> {
    const submission: ApiSchema<'GlossaryQuizSubmissionRequest'> = {
      client_answer_id: answer.id,
      question_id: answer.questionId,
      selected_answer: answer.selectedAnswer,
    };
    const dto = await authenticatedRequest<ApiSchema<'GlossaryQuizScoreResponse'>>(
      '/api/v1/glossary/score/',
      {
        method: 'POST',
        body: JSON.stringify(submission),
      },
      { expectedUserId: owner }
    );
    assertRecord(dto);
    const result = dto.answer;
    assertRecord(result);
    return {
      ...state(dto),
      answer: {
        questionId: text(result.question_id),
        isCorrect: flag(result.is_correct),
        correctAnswer: text(result.correct_answer),
      },
    };
  },
};
