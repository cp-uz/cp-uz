import type { GlossaryTerm } from './entities';

const englishCollator = new Intl.Collator('en', {
  numeric: true,
  sensitivity: 'base',
});

const canonicalUzbekLabels: Readonly<Record<string, string>> = {
  'Euclidean Algorithm': 'Evklid algoritmi',
};

export function getEnglishGlossaryInitial(englishTerm: string) {
  const normalized = englishTerm.normalize('NFKD').replace(/\p{M}/gu, '').toUpperCase();

  return normalized.match(/[A-Z]/)?.[0] ?? '#';
}

export function sortGlossaryByEnglish(terms: readonly GlossaryTerm[]) {
  return [...terms].sort((left, right) => englishCollator.compare(left.english, right.english));
}

export function getGlossaryDisplayLabels(term: Pick<GlossaryTerm, 'english' | 'term'>) {
  return {
    primary: term.english,
    secondary: canonicalUzbekLabels[term.english] ?? term.term,
  };
}
