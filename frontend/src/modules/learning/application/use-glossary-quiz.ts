import type { GlossaryTerm } from '../domain';
import type { GlossaryQuizStats } from './glossary-quiz';

import { useMemo, useState, useCallback } from 'react';

import {
  emptyQuizStats,
  updateQuizStats,
  sanitizeQuizStats,
  isQuizAnswerCorrect,
  buildGlossaryQuizQuestions,
  GLOSSARY_QUIZ_STATS_STORAGE_KEY,
  LEGACY_GLOSSARY_QUIZ_STORAGE_KEY,
} from './glossary-quiz';

export type GlossaryQuizAnswer = {
  id: string;
  questionId: string;
  isCorrect: boolean;
  stats: GlossaryQuizStats;
};

function migrateLegacyStats(): GlossaryQuizStats {
  try {
    const history = JSON.parse(localStorage.getItem(LEGACY_GLOSSARY_QUIZ_STORAGE_KEY) ?? '[]');
    if (!Array.isArray(history)) return emptyQuizStats();
    const valid = history.filter((item) => (
      item &&
      typeof item === 'object' &&
      Number.isInteger(item.correct) &&
      Number.isInteger(item.total) &&
      item.total > 0 &&
      item.correct >= 0 &&
      item.correct <= item.total
    ));
    const stats = sanitizeQuizStats({
      attempts: valid.reduce((sum, item) => sum + item.total, 0),
      correct: valid.reduce((sum, item) => sum + item.correct, 0),
      streak: 0,
      bestStreak: 0,
      updatedAt: valid[0]?.createdAt ?? '',
    });
    if (stats.attempts > 0) {
      localStorage.setItem(GLOSSARY_QUIZ_STATS_STORAGE_KEY, JSON.stringify(stats));
    }
    return stats;
  } catch {
    return emptyQuizStats();
  }
}

function readStats() {
  try {
    const saved = localStorage.getItem(GLOSSARY_QUIZ_STATS_STORAGE_KEY);
    return saved ? sanitizeQuizStats(JSON.parse(saved)) : migrateLegacyStats();
  } catch {
    return emptyQuizStats();
  }
}

function randomSeed() {
  try {
    const value = new Uint32Array(1);
    crypto.getRandomValues(value);
    return value[0];
  } catch {
    return Math.floor((Date.now() + Math.random() * 0xffffffff) % 4_294_967_296);
  }
}

export function useGlossaryQuiz(terms: GlossaryTerm[]) {
  const [seed, setSeed] = useState(randomSeed);
  const question = useMemo(
    () => buildGlossaryQuizQuestions(terms, seed, 1)[0] ?? null,
    [seed, terms]
  );
  const [stats, setStats] = useState<GlossaryQuizStats>(readStats);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [latestAnswer, setLatestAnswer] = useState<GlossaryQuizAnswer | null>(null);

  const submit = useCallback((answer: string) => {
    if (!question || answered !== null) return;
    const isCorrect = isQuizAnswerCorrect(question, answer);
    const updatedAt = new Date().toISOString();
    const nextStats = updateQuizStats(stats, isCorrect, updatedAt);
    setAnswered(isCorrect);
    setStats(nextStats);
    setLatestAnswer({
      id: `${updatedAt}:${nextStats.attempts}`,
      questionId: question.id,
      isCorrect,
      stats: nextStats,
    });
    try {
      localStorage.setItem(GLOSSARY_QUIZ_STATS_STORAGE_KEY, JSON.stringify(nextStats));
    } catch {
      // The quiz remains usable when browser storage is unavailable.
    }
  }, [answered, question, stats]);

  const next = useCallback(() => {
    if (!question || answered === null) return;
    let nextSeed = randomSeed();
    for (let retry = 0; retry < 12; retry += 1) {
      const candidate = buildGlossaryQuizQuestions(terms, nextSeed, 1)[0];
      if (!candidate || candidate.id !== question.id) break;
      nextSeed = (nextSeed + 1) % 4_294_967_296;
    }
    setSeed(nextSeed);
    setAnswered(null);
  }, [answered, question, terms]);

  const clearStats = useCallback(() => {
    const empty = emptyQuizStats();
    setStats(empty);
    setLatestAnswer(null);
    try {
      localStorage.removeItem(GLOSSARY_QUIZ_STATS_STORAGE_KEY);
      localStorage.removeItem(LEGACY_GLOSSARY_QUIZ_STORAGE_KEY);
    } catch {
      // State is still cleared for this page session.
    }
  }, []);

  return {
    question,
    answered,
    stats,
    latestAnswer,
    submit,
    next,
    clearStats,
  };
}
