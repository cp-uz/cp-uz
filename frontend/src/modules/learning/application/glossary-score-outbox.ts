export const GLOSSARY_QUIZ_OUTBOX_STORAGE_KEY = 'cpuz:glossary-quiz-outbox';

export type PendingGlossaryScore = {
  id: string;
  isCorrect: boolean;
};

function readOutbox(): PendingGlossaryScore[] {
  try {
    const value = JSON.parse(localStorage.getItem(GLOSSARY_QUIZ_OUTBOX_STORAGE_KEY) ?? '[]');
    if (!Array.isArray(value)) return [];
    const ids = new Set<string>();
    return value.filter((item): item is PendingGlossaryScore => {
      if (
        !item ||
        typeof item !== 'object' ||
        typeof item.id !== 'string' ||
        !item.id.trim() ||
        item.id.length > 120 ||
        typeof item.isCorrect !== 'boolean' ||
        ids.has(item.id)
      ) {
        return false;
      }
      ids.add(item.id);
      return true;
    });
  } catch {
    return [];
  }
}

function writeOutbox(items: PendingGlossaryScore[]) {
  localStorage.setItem(GLOSSARY_QUIZ_OUTBOX_STORAGE_KEY, JSON.stringify(items.slice(-1000)));
}

export function enqueueGlossaryScore(answer: PendingGlossaryScore) {
  try {
    const current = readOutbox();
    if (!current.some((item) => item.id === answer.id)) writeOutbox([...current, answer]);
    return true;
  } catch {
    return false;
  }
}

export function pendingGlossaryScoreCount() {
  return readOutbox().length;
}

export async function flushGlossaryScoreOutbox<T>(
  submit: (answer: PendingGlossaryScore) => Promise<T>
): Promise<T | null> {
  let latest: T | null = null;
  while (true) {
    const answer = readOutbox()[0];
    if (!answer) return latest;
    latest = await submit(answer);
    const remaining = readOutbox().filter((item) => item.id !== answer.id);
    writeOutbox(remaining);
  }
}
