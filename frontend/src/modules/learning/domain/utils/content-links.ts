import type { LearningArticle } from '../entities';

import { getArticlePath } from './article-routing';

const SCHEME = /^[a-z][a-z\d+.-]*:/i;

function splitSuffix(href: string) {
  const match = href.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);
  return {
    path: match?.[1] ?? href,
    query: match?.[2] ?? '',
    hash: match?.[3] ?? '',
  };
}

function dirname(path: string) {
  const normalized = path.replace(/\\/g, '/');
  return normalized.slice(0, Math.max(0, normalized.lastIndexOf('/')));
}

export function normalizeContentPath(path: string) {
  const output: string[] = [];
  path.replace(/\\/g, '/').split('/').forEach((part) => {
    if (!part || part === '.') return;
    if (part === '..') output.pop();
    else output.push(part);
  });
  return output.join('/');
}

export function resolveArticleHref(
  currentSourcePath: string,
  href: string,
  knownArticles: LearningArticle[] = []
) {
  if (!href || href.startsWith('#') || href.startsWith('//') || SCHEME.test(href)) return href;

  const { path, query, hash } = splitSuffix(href);
  if (!/\.md$/i.test(path)) return href;

  const resolvedSource = normalizeContentPath(
    path.startsWith('/') ? path : `${dirname(currentSourcePath)}/${path}`
  );
  const known = knownArticles.find(
    (article) => article.sourcePath && normalizeContentPath(article.sourcePath) === resolvedSource
  );
  if (known) return `${getArticlePath(known)}${query}${hash}`;

  const relative = resolvedSource.replace(/^(?:docs|src)\//, '');
  const parts = relative.split('/');
  const filename = parts.pop() ?? 'index.md';
  const category = parts[0] || 'misc';
  const slug = filename.replace(/\.md$/i, '');
  return `/algoritmlar/${category}/${slug}${query}${hash}`;
}

export function resolveContentAssetHref(
  currentSourcePath: string,
  src: string,
  assetBase?: string
) {
  if (!src || src.startsWith('//') || SCHEME.test(src) || src.startsWith('data:')) return src;
  const { path, query, hash } = splitSuffix(src);
  if (assetBase) {
    return `${assetBase.replace(/\/$/, '')}/${normalizeContentPath(path)}${query}${hash}`;
  }
  const resolved = normalizeContentPath(
    path.startsWith('/') ? path : `${dirname(currentSourcePath)}/${path}`
  );
  const fallbackBase =
    (import.meta.env.VITE_CONTENT_ASSET_URL as string | undefined) ?? '/content';
  return `${fallbackBase.replace(/\/$/, '')}/${resolved.replace(/^\//, '')}${query}${hash}`;
}

// Kept as executable examples for backend-contract smoke tests.
export const contentLinkExamples = {
  sibling: resolveArticleHref('docs/algebra/phi-function.md', 'module-inverse.md'),
  parent: resolveArticleHref(
    'docs/algebra/phi-function.md',
    '../graph/fixed_length_paths.md#matrix'
  ),
  asset: resolveContentAssetHref('docs/geometry/convex-hull.md', 'hull.png', '/media/content'),
};
