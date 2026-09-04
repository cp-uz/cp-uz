import type { PendingGlossaryScore } from '../domain/entities/quiz.types';

import { safeStorage, readStoredJson } from 'shared/storage';

export type { PendingGlossaryScore } from '../domain/entities/quiz.types';
export const GLOSSARY_QUIZ_OUTBOX_STORAGE_KEY = 'cpuz:glossary-quiz-outbox:v2';
const keyFor = (owner: number | string) => `${GLOSSARY_QUIZ_OUTBOX_STORAGE_KEY}:${owner}`;

export function readGlossaryScoreOutbox(owner: number | string): PendingGlossaryScore[] {
  const value = readStoredJson(safeStorage, keyFor(owner));
  if (!Array.isArray(value)) return [];
  const ids = new Set<string>();
  return value.filter((item): item is PendingGlossaryScore => {
    if (
      !item ||
      typeof item !== 'object' ||
      typeof item.id !== 'string' ||
      !item.id ||
      item.id.length > 120 ||
      typeof item.questionId !== 'string' ||
      !item.questionId ||
      typeof item.selectedAnswer !== 'string' ||
      !item.selectedAnswer ||
      ids.has(item.id)
    )
      return false;
    ids.add(item.id);
    return true;
  });
}
export function enqueueGlossaryScore(owner: number | string, answer: PendingGlossaryScore) {
  const current = readGlossaryScoreOutbox(owner);
  if (current.some((item) => item.id === answer.id || item.questionId === answer.questionId))
    return safeStorage.setItem(keyFor(owner), JSON.stringify(current));
  return safeStorage.setItem(keyFor(owner), JSON.stringify([...current, answer]));
}
export function removeGlossaryScore(owner: number | string, answerId: string) {
  safeStorage.setItem(
    keyFor(owner),
    JSON.stringify(readGlossaryScoreOutbox(owner).filter((item) => item.id !== answerId))
  );
}
export function pendingGlossaryScoreCount(owner: number | string) {
  return readGlossaryScoreOutbox(owner).length;
}
export async function flushGlossaryScoreOutbox<T>(
  owner: number | string,
  submit: (answer: PendingGlossaryScore) => Promise<T>
): Promise<T | null> {
  let latest: T | null = null;
  for (const answer of readGlossaryScoreOutbox(owner)) {
    latest = await submit(answer);
    removeGlossaryScore(owner, answer.id);
  }
  return latest;
}
