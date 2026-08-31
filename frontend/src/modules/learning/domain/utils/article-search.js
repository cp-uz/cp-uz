const SEARCH_ALIASES = [
  ['segment tree', 'segment daraxti', 'kesma daraxti', 'kesmalar daraxti'],
  ['binary search', 'ikkilik qidiruv'],
  ['dynamic programming', 'dinamik dasturlash', 'dp'],
  ['disjoint set union', 'ajralgan toplamlar birlashmasi', 'kesishmaydigan toplamlar tizimi', 'union find', 'dsu'],
  ['breadth first search', 'kenglik boyicha qidiruv', 'bfs'],
  ['depth first search', 'chuqurlik boyicha qidiruv', 'dfs'],
  ['shortest path', 'eng qisqa yol'],
  ['minimum spanning tree', 'minimum ostov daraxt', 'eng kichik ostov daraxt', 'mst'],
  ['fenwick tree', 'fenwick daraxti', 'binary indexed tree'],
  ['lowest common ancestor', 'eng yaqin umumiy ajdod', 'lca'],
  ['convex hull', 'qavariq qobiq'],
  ['string', 'satr'],
  ['hash', 'xesh'],
];

export function normalizeSearchText(value) {
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

function expandedQueries(query) {
  const normalized = normalizeSearchText(query);
  if (!normalized) return [];
  const values = new Set([normalized]);
  if (normalized.length >= 2) {
    SEARCH_ALIASES.forEach((group) => {
      const aliases = group.map(normalizeSearchText);
      if (aliases.some((alias) => alias.includes(normalized) || normalized.includes(alias))) {
        aliases.forEach((alias) => values.add(alias));
      }
    });
  }
  return [...values];
}

export function scoreArticleSearch(article, query) {
  const queries = expandedQueries(query);
  if (!queries.length) return 0;
  const primary = queries[0];
  const title = normalizeSearchText(article.title);
  const tags = normalizeSearchText((article.tags ?? []).join(' '));
  const category = normalizeSearchText(article.category);
  const summary = normalizeSearchText(article.summary);

  if (title === primary) return 1000;
  if (title.startsWith(primary)) return 900;
  if (title.includes(primary)) return 850;
  if (queries.slice(1).some((candidate) => title === candidate)) return 800;
  if (queries.slice(1).some((candidate) => title.includes(candidate))) return 750;
  if (queries.some((candidate) => tags.includes(candidate))) return 600;
  if (queries.some((candidate) => category.includes(candidate))) return 500;
  if (queries.some((candidate) => summary.includes(candidate))) return 300;
  return 0;
}

export function rankArticleSearchResults(articles, query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [...articles];

  return articles
    .map((article, index) => ({ article, index, score: scoreArticleSearch(article, normalizedQuery) }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map(({ article }) => article);
}

export function matchesArticleSearch(article, query) {
  return !normalizeSearchText(query) || scoreArticleSearch(article, query) > 0;
}
