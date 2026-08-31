export type GlossaryQuizStats = {
  attempts: number;
  correct: number;
  streak: number;
  bestStreak: number;
  updatedAt: string;
};

export type GlossaryQuizMode =
  | 'english_to_uzbek'
  | 'uzbek_to_english'
  | 'definition_to_english'
  | 'definition_to_uzbek';

export type GlossaryQuizTermInput = {
  term: string;
  english: string;
  definition: string;
};

export type GlossaryQuizQuestion = {
  id: string;
  mode: GlossaryQuizMode;
  modeLabel: string;
  instruction: string;
  prompt: string;
  correctAnswer: string;
  options: string[];
};

export const GLOSSARY_QUIZ_STATS_STORAGE_KEY: string;
export const LEGACY_GLOSSARY_QUIZ_STORAGE_KEY: string;
export const GLOSSARY_QUIZ_MODES: ReadonlyArray<{
  id: GlossaryQuizMode;
  label: string;
  instruction: string;
  promptField: 'term' | 'english' | 'definition';
  answerField: 'term' | 'english';
}>;

export function buildGlossaryQuizQuestions(
  terms: GlossaryQuizTermInput[],
  seed?: number,
  count?: number
): GlossaryQuizQuestion[];

export function isQuizAnswerCorrect(
  question: GlossaryQuizQuestion | null | undefined,
  answer: unknown
): boolean;

export function emptyQuizStats(): GlossaryQuizStats;
export function sanitizeQuizStats(value: unknown): GlossaryQuizStats;
export function updateQuizStats(
  value: unknown,
  isCorrect: boolean,
  updatedAt?: string
): GlossaryQuizStats;
