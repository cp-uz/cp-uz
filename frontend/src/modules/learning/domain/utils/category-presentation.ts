import type { LearningCategory } from '../entities';

type CategoryPresentation = {
  icon: string;
  title: string;
};

const ROOT_CATEGORY_PRESENTATION: Record<string, CategoryPresentation> = {
  algebra: { title: 'Algebra', icon: 'cp:algebra' },
  combinatorics: { title: 'Kombinatorika', icon: 'cp:combinatorics' },
  'data-structures': { title: 'Ma’lumotlar tuzilmalari', icon: 'cp:data-structures' },
  'dynamic-programming': { title: 'Dinamik dasturlash', icon: 'cp:dynamic-programming' },
  geometry: { title: 'Geometriya', icon: 'cp:geometry' },
  graphs: { title: 'Graflar', icon: 'cp:graphs' },
  'linear-algebra': { title: 'Chiziqli algebra', icon: 'cp:linear-algebra' },
  miscellaneous: { title: 'Boshqa mavzular', icon: 'cp:miscellaneous' },
  'numerical-methods': { title: 'Sonli usullar', icon: 'cp:numerical-methods' },
  'string-processing': { title: 'Satrlar', icon: 'cp:string-processing' },
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
    icon: 'cp:miscellaneous',
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
