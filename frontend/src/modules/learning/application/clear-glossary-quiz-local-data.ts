import { safeStorage } from 'shared/storage';
import { getAuthSession } from 'modules/auth/application';

export function clearGlossaryQuizLocalData(owner: number | string = getAuthSession()?.user.id ?? 'anonymous') {
  safeStorage.removeItem(`cpuz:glossary-practice:v2:${owner}`);
  safeStorage.removeItem(`cpuz:glossary-quiz-outbox:v2:${owner}`);
}
