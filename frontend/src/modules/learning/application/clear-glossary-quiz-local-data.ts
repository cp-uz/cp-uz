const GLOSSARY_QUIZ_LOCAL_KEYS = [
  'cpuz:glossary-quiz-stats',
  'cpuz:glossary-quiz-history',
  'cpuz:glossary-quiz-outbox',
];

export function clearGlossaryQuizLocalData() {
  GLOSSARY_QUIZ_LOCAL_KEYS.forEach((key) => localStorage.removeItem(key));
}
