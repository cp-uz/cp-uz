export const algorithmPatterns = [
  'algebra',
  'combinatorics',
  'data-structures',
  'dynamic-programming',
  'geometry',
  'graphs',
  'linear-algebra',
  'miscellaneous',
  'numerical-methods',
  'string-processing',
  'roadmap',
  'search',
] as const;

export type AlgorithmPattern = (typeof algorithmPatterns)[number];

const aliases: Record<string, AlgorithmPattern> = {
  'number-theory': 'algebra',
  combinatorika: 'combinatorics',
  datastructures: 'data-structures',
  dp: 'dynamic-programming',
  fundamentals: 'numerical-methods',
  graph: 'graphs',
  graflar: 'graphs',
  'graph-foundations': 'graphs',
  'advanced-graphs': 'graphs',
  'graph-advanced': 'graphs',
  misc: 'miscellaneous',
  'num-methods': 'numerical-methods',
  numerical: 'numerical-methods',
  string: 'string-processing',
  strings: 'string-processing',
};

// Accept canonical category IDs, legacy source IDs and roadmap stage IDs.
export function resolveAlgorithmPattern(topic: string = 'miscellaneous'): AlgorithmPattern {
  const root = topic.split('--')[0].trim().toLowerCase().replace(/_/g, '-');
  return aliases[root] ?? algorithmPatterns.find((pattern) => pattern === root) ?? 'miscellaneous';
}
