import type { LearningCategory } from '../entities';

type CategoryPresentation = {
  icon: string;
  title: string;
};

const ROOT_CATEGORY_PRESENTATION: Record<string, CategoryPresentation> = {
  algebra: { title: 'Algebra', icon: 'solar:calculator-minimalistic-linear' },
  combinatorics: { title: 'Kombinatorika', icon: 'solar:atom-linear' },
  'data-structures': { title: 'Ma’lumotlar tuzilmalari', icon: 'solar:database-linear' },
  'dynamic-programming': { title: 'Dinamik dasturlash', icon: 'solar:layers-minimalistic-linear' },
  geometry: { title: 'Geometriya', icon: 'solar:ruler-cross-pen-linear' },
  graphs: { title: 'Graflar', icon: 'solar:branching-paths-up-linear' },
  'linear-algebra': { title: 'Chiziqli algebra', icon: 'solar:widget-4-linear' },
  miscellaneous: { title: 'Boshqa mavzular', icon: 'solar:code-square-linear' },
  'numerical-methods': { title: 'Sonli usullar', icon: 'solar:chart-square-linear' },
  'string-processing': { title: 'Satrlar', icon: 'solar:text-square-linear' },
};

const CATEGORY_ALIASES: Record<string, string> = {
  combinatorika: 'combinatorics',
  data_structures: 'data-structures',
  datastructures: 'data-structures',
  dp: 'dynamic-programming',
  dynamic_programming: 'dynamic-programming',
  graph: 'graphs',
  graflar: 'graphs',
  linear_algebra: 'linear-algebra',
  chiziqli_algebra: 'linear-algebra',
  misc: 'miscellaneous',
  num_methods: 'numerical-methods',
  numerical: 'numerical-methods',
  numerical_methods: 'numerical-methods',
  string: 'string-processing',
  strings: 'string-processing',
};

export function canonicalCategoryId(value: string) {
  const root = value.split('--')[0] ?? value;
  const normalized = root.trim().toLocaleLowerCase('en').replace(/\s+/g, '-');
  return CATEGORY_ALIASES[normalized] ?? normalized.replace(/_/g, '-');
}

export function rootCategoryTitle(value: string, fallback = '') {
  return ROOT_CATEGORY_PRESENTATION[canonicalCategoryId(value)]?.title || fallback;
}

export function presentRootCategory(category: LearningCategory): LearningCategory {
  const id = canonicalCategoryId(category.id);
  const presentation = ROOT_CATEGORY_PRESENTATION[id] ?? {
    title: category.title,
    icon: 'solar:code-square-linear',
  };

  return {
    ...category,
    id,
    title: ROOT_CATEGORY_PRESENTATION[id] ? presentation.title : category.title,
    icon: presentation.icon,
    accent: '#036FDC',
  };
}

export function presentRootCategories(categories: LearningCategory[]) {
  return categories.map(presentRootCategory);
}
