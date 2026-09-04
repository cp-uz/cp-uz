import type { RankedAnswer, RankedQuestion } from '../domain/entities/quiz.types';

import { ApiError } from 'shared/api/http';
import { useRef, useState, useEffect, useCallback } from 'react';

import { glossaryLeaderboardApi } from './glossary-leaderboard';
import {
  removeGlossaryScore,
  enqueueGlossaryScore,
  readGlossaryScoreOutbox,
  flushGlossaryScoreOutbox,
} from './glossary-score-outbox';

export function useRankedQuiz(owner: number | string, onScore: () => void) {
  const [question, setQuestion] = useState<RankedQuestion | null>(null);
  const [answer, setAnswer] = useState<RankedAnswer | null>(null);
  const [submittedAnswer, setSubmittedAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [storageWarning, setStorageWarning] = useState('');
  const alive = useRef(false);
  const busy = useRef(false);
  const scoreCallback = useRef(onScore);
  const questionRef = useRef(question);
  questionRef.current = question;
  scoreCallback.current = onScore;

  const run = useCallback(
    async (nextQuestion: boolean) => {
      if (busy.current) return;
      busy.current = true;
      setLoading(true);
      setError('');
      try {
        const result = await flushGlossaryScoreOutbox(owner, (pending) =>
          glossaryLeaderboardApi.submitScore(owner, pending)
        );
        if (!alive.current) return;
        if (!readGlossaryScoreOutbox(owner).length) setStorageWarning('');
        if (result) {
          setAnswer(result.answer);
          scoreCallback.current();
        }
        if (nextQuestion) {
          const next = await glossaryLeaderboardApi.getQuestion(owner);
          if (!alive.current) return;
          setQuestion(next);
          setAnswer(null);
          setSubmittedAnswer(null);
        }
      } catch (reason) {
        if (!alive.current) return;
        if (reason instanceof ApiError && [400, 403, 404].includes(reason.status)) {
          const pending = readGlossaryScoreOutbox(owner)[0];
          if (pending) removeGlossaryScore(owner, pending.id);
          if (!readGlossaryScoreOutbox(owner).length) setStorageWarning('');
          setQuestion(null);
          setSubmittedAnswer(null);
          setError('Savolga javob qabul qilinmadi. Yangi savol olib davom eting.');
        } else {
          setError(
            reason instanceof Error ? reason.message : 'Aloqa tiklangach qayta urinib ko‘ring.'
          );
        }
      } finally {
        busy.current = false;
        if (alive.current) setLoading(false);
      }
    },
    [owner]
  );

  useEffect(() => {
    alive.current = true;
    void run(true);
    const online = () => {
      if (readGlossaryScoreOutbox(owner).length) void run(!questionRef.current);
    };
    window.addEventListener('online', online);
    return () => {
      alive.current = false;
      window.removeEventListener('online', online);
    };
  }, [owner, run]);

  const submit = (selectedAnswer: string) => {
    if (!question || answer || busy.current || !question.options.includes(selectedAnswer)) return;
    if (submittedAnswer !== null) {
      void run(false);
      return;
    }
    const persisted = enqueueGlossaryScore(owner, {
      id: crypto.randomUUID(),
      questionId: question.id,
      selectedAnswer,
    });
    setSubmittedAnswer(selectedAnswer);
    setStorageWarning(
      persisted
        ? ''
        : 'Javob brauzer xotirasiga saqlanmadi: server tasdiqlamaguncha sahifani yangilasangiz yoki yopsangiz, javob yo‘qoladi.'
    );
    void run(false);
  };
  return {
    question,
    answer,
    submittedAnswer,
    loading,
    error,
    storageWarning,
    submit,
    next: () => run(true),
    retry: () => run(!question),
  };
}
