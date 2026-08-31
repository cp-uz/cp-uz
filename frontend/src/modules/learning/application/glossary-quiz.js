export const GLOSSARY_QUIZ_STATS_STORAGE_KEY = 'cpuz:glossary-quiz-stats';
export const LEGACY_GLOSSARY_QUIZ_STORAGE_KEY = 'cpuz:glossary-quiz-history';

export const GLOSSARY_QUIZ_MODES = [
  {
    id: 'english_to_uzbek',
    label: 'English → O‘zbekcha',
    instruction: 'Inglizcha atamaning o‘zbekcha muqobilini tanlang.',
    promptField: 'english',
    answerField: 'term',
  },
  {
    id: 'uzbek_to_english',
    label: 'O‘zbekcha → English',
    instruction: 'O‘zbekcha atamaning inglizcha muqobilini tanlang.',
    promptField: 'term',
    answerField: 'english',
  },
  {
    id: 'definition_to_english',
    label: 'Izoh → English',
    instruction: 'Izohga mos inglizcha atamani tanlang.',
    promptField: 'definition',
    answerField: 'english',
  },
  {
    id: 'definition_to_uzbek',
    label: 'Izoh → O‘zbekcha',
    instruction: 'Izohga mos o‘zbekcha atamani tanlang.',
    promptField: 'definition',
    answerField: 'term',
  },
];

function normalizeOption(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLocaleLowerCase('uz')
    .replace(/[’‘`ʻʼ']/g, '')
    .replace(/[-_/]+/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function gcd(left, right) {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b) [a, b] = [b, a % b];
  return a;
}

function questionStep(length, seed) {
  if (length <= 1) return 1;
  let step = ((Math.abs(seed) * 2 + 11) % length) || 1;
  while (gcd(step, length) !== 1) step = (step + 1) % length || 1;
  return step;
}

function shuffle(values, seed) {
  const result = [...values];
  const modulus = 4_294_967_296;
  let state = (Math.abs(seed) + 1) % modulus;
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) % modulus;
    if (state < 0) state += modulus;
    const target = state % (index + 1);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function uniqueOptions(values, excluded) {
  const excludedValue = normalizeOption(excluded);
  const seen = new Set([excludedValue]);
  return values.filter((value) => {
    const normalized = normalizeOption(value);
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

function questionId(term, mode) {
  const slug = normalizeOption(term.english).replace(/\s+/g, '-');
  return `glossary:${slug}:${mode.id}:v1`;
}

export function buildGlossaryQuizQuestions(terms, seed = 0, count = 5) {
  const candidates = terms.filter(
    (term) =>
      normalizeOption(term?.term) &&
      normalizeOption(term?.english) &&
      normalizeOption(term?.definition)
  );
  if (candidates.length < 4 || count <= 0) return [];

  const safeSeed = Number.isInteger(seed) ? Math.abs(seed) : 0;
  const total = Math.min(Math.floor(count), candidates.length);
  const start = (safeSeed * 17) % candidates.length;
  const step = questionStep(candidates.length, safeSeed);

  return Array.from({ length: total }, (_, index) => {
    const term = candidates[(start + index * step) % candidates.length];
    const mode = GLOSSARY_QUIZ_MODES[(safeSeed + index) % GLOSSARY_QUIZ_MODES.length];
    const correctAnswer = term[mode.answerField];
    const distractorPool = uniqueOptions(
      candidates.map((candidate) => candidate[mode.answerField]),
      correctAnswer
    );
    const distractors = shuffle(distractorPool, safeSeed * 97 + index * 31).slice(0, 3);
    const options = shuffle([correctAnswer, ...distractors], safeSeed * 193 + index * 53);

    return {
      id: questionId(term, mode),
      mode: mode.id,
      modeLabel: mode.label,
      instruction: mode.instruction,
      prompt: term[mode.promptField],
      correctAnswer,
      options,
    };
  }).filter((question) => question.options.length === 4);
}

export function isQuizAnswerCorrect(question, answer) {
  return normalizeOption(answer) === normalizeOption(question?.correctAnswer);
}

function isValidIsoDate(value) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

export function emptyQuizStats() {
  return { attempts: 0, correct: 0, streak: 0, bestStreak: 0, updatedAt: '' };
}

export function sanitizeQuizStats(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return emptyQuizStats();
  const attempts = Number(value.attempts);
  const correct = Number(value.correct);
  const streak = Number(value.streak);
  const bestStreak = Number(value.bestStreak);
  const updatedAt = value.updatedAt;
  const valid =
    Number.isInteger(attempts) &&
    Number.isInteger(correct) &&
    Number.isInteger(streak) &&
    Number.isInteger(bestStreak) &&
    attempts >= 0 &&
    correct >= 0 &&
    correct <= attempts &&
    streak >= 0 &&
    streak <= correct &&
    bestStreak >= streak &&
    bestStreak <= correct &&
    (updatedAt === '' || isValidIsoDate(updatedAt));
  if (!valid) return emptyQuizStats();
  return { attempts, correct, streak, bestStreak, updatedAt };
}

export function updateQuizStats(value, isCorrect, updatedAt) {
  const current = sanitizeQuizStats(value);
  const nextStreak = isCorrect ? current.streak + 1 : 0;
  return {
    attempts: current.attempts + 1,
    correct: current.correct + (isCorrect ? 1 : 0),
    streak: nextStreak,
    bestStreak: Math.max(current.bestStreak, nextStreak),
    updatedAt: isValidIsoDate(updatedAt) ? updatedAt : new Date().toISOString(),
  };
}
