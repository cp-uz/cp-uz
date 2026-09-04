import type { GlossaryTerm } from '../domain';

import { useMemo, useState, useCallback } from 'react';
import { safeStorage, readStoredJson } from 'shared/storage';

import {
  emptyQuizStats,
  updateQuizStats,
  sanitizeQuizStats,
  isQuizAnswerCorrect,
  buildGlossaryQuizQuestions,
} from './glossary-quiz';

const seedValue = () => crypto.getRandomValues(new Uint32Array(1))[0];

/** Local practice never changes the public leaderboard. The caller keys this hook by owner. */
export function useGlossaryQuiz(terms: GlossaryTerm[], owner: number | string = 'anonymous') {
  const storageKey = `cpuz:glossary-practice:v2:${owner}`;
  const [seed, setSeed] = useState(seedValue);
  const question = useMemo(
    () => buildGlossaryQuizQuestions(terms, seed, 1)[0] ?? null,
    [seed, terms]
  );
  const [stats, setStats] = useState(() =>
    sanitizeQuizStats(readStoredJson(safeStorage, storageKey))
  );
  const [answered, setAnswered] = useState<boolean | null>(null);

  const submit = useCallback(
    (answer: string) => {
      if (!question || answered !== null) return;
      const correct = isQuizAnswerCorrect(question, answer);
      const nextStats = updateQuizStats(stats, correct, new Date().toISOString());
      setAnswered(correct);
      setStats(nextStats);
      safeStorage.setItem(storageKey, JSON.stringify(nextStats));
    },
    [question, answered, stats, storageKey]
  );

  const next = useCallback(() => {
    if (answered === null) return;
    let candidate = seedValue();
    for (
      let retry = 0;
      retry < 12 && buildGlossaryQuizQuestions(terms, candidate, 1)[0]?.id === question?.id;
      retry += 1
    )
      candidate = (candidate + 1) % 4_294_967_296;
    setSeed(candidate);
    setAnswered(null);
  }, [answered, question, terms]);

  const clearStats = () => {
    setStats(emptyQuizStats());
    safeStorage.removeItem(storageKey);
  };
  return { question, answered, stats, submit, next, clearStats };
}
