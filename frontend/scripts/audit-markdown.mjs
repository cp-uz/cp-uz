#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import katex from 'katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

import {
  isPracticeHeading,
  normalizeMarkdownDocument,
} from '../src/modules/learning/ui/shared/markdown-adapter.js';

const frontendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = path.resolve(frontendRoot, '..');
const exportPath = process.env.CPUZ_CONTENT_EXPORT
  ? path.resolve(process.env.CPUZ_CONTENT_EXPORT)
  : path.join(repositoryRoot, 'content', 'exports', 'articles.v1.json');
const contentRoot = path.join(repositoryRoot, 'content', 'articles');
const EXPECTED_MINIMUM_HEADINGS = 1010;
const EXPECTED_MINIMUM_FRAGMENT_LINKS = 10;

function walk(node, visitor) {
  visitor(node);
  if (!Array.isArray(node?.children)) return;
  for (const child of node.children) walk(child, visitor);
}

function decodeFragment(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function localFragmentTarget(articlePath, url) {
  if (!url || /^[a-z][a-z\d+.-]*:/i.test(url) || url.startsWith('//')) return null;
  const hashIndex = url.indexOf('#');
  if (hashIndex === -1 || hashIndex === url.length - 1) return null;
  const relativePath = url.slice(0, hashIndex);
  const fragment = decodeFragment(url.slice(hashIndex + 1));
  if (!relativePath) return { fragment, path: articlePath };
  if (!/\.md$/i.test(relativePath.split('?')[0])) return null;
  const cleanPath = relativePath.split('?')[0].replace(/\\/g, '/');
  return {
    fragment,
    path: path.posix.normalize(path.posix.join(path.posix.dirname(articlePath), cleanPath)),
  };
}

function localAssetTarget(articlePath, url) {
  if (!url || /^[a-z][a-z\d+.-]*:/i.test(url) || url.startsWith('//') || url.startsWith('data:')) {
    return null;
  }
  const cleanPath = url.split(/[?#]/, 1)[0].replace(/\\/g, '/');
  if (!cleanPath || /\.md$/i.test(cleanPath)) return null;
  return path.posix.normalize(path.posix.join(path.posix.dirname(articlePath), cleanPath));
}

const payload = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
const articles = payload.articles;
const byPath = new Map(articles.map((article) => [article.path.replace(/\\/g, '/'), article]));
const normalizedByPath = new Map();
const errors = [];
let adapterHeadingCount = 0;
let parsedHeadingCount = 0;
let mathCount = 0;
let fragmentLinkCount = 0;
let localAssetCount = 0;
let extractedPracticeCount = 0;
let intentionallyStrippedHeadingCount = 0;

for (const article of articles) {
  const normalized = normalizeMarkdownDocument(article.markdown);
  normalizedByPath.set(article.path.replace(/\\/g, '/'), normalized);
  adapterHeadingCount += normalized.headings.length;
  intentionallyStrippedHeadingCount += normalized.removedHeadingCount;
  extractedPracticeCount += normalized.practiceLinks.length;

  const expectedPractice = article.practice_links.map(({ title, url }) => ({ title, url }));
  if (JSON.stringify(normalized.practiceLinks) !== JSON.stringify(expectedPractice)) {
    errors.push(
      `${article.id}: inline/structured practice parity mismatch ` +
        `(${normalized.practiceLinks.length}/${expectedPractice.length})`
    );
  }

  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkMath);
  const tree = processor.parse(normalized.markdown);
  const articleIds = new Set();
  for (const heading of normalized.headingNodes) {
    for (const id of [heading.id, ...heading.aliases]) {
      if (articleIds.has(id)) errors.push(`${article.id}: duplicate heading/alias id #${id}`);
      articleIds.add(id);
    }
  }

  let articleParsedHeadings = 0;
  walk(tree, (node) => {
    if (node.type === 'heading' && (node.depth === 2 || node.depth === 3)) {
      parsedHeadingCount += 1;
      articleParsedHeadings += 1;
    }

    if (node.type === 'math' || node.type === 'inlineMath') {
      mathCount += 1;
      try {
        katex.renderToString(node.value, {
          displayMode: node.type === 'math',
          output: 'htmlAndMathml',
          strict: 'ignore',
          throwOnError: true,
        });
      } catch (error) {
        const line = node.position?.start?.line ?? '?';
        errors.push(`${article.id}:${line}: KaTeX: ${error.message}`);
      }
    }

    if (node.type === 'html') {
      const line = node.position?.start?.line ?? '?';
      errors.push(`${article.id}:${line}: raw HTML survived normalization`);
    }

    if (node.type === 'link') {
      const target = localFragmentTarget(article.path.replace(/\\/g, '/'), node.url);
      if (target) fragmentLinkCount += 1;
    }

    if (node.type === 'image') {
      const target = localAssetTarget(article.path.replace(/\\/g, '/'), node.url);
      if (!target) return;
      localAssetCount += 1;
      const absolute = path.join(contentRoot, ...target.split('/'));
      if (!fs.existsSync(absolute)) errors.push(`${article.id}: missing local asset ${target}`);
    }
  });

  if (articleParsedHeadings !== normalized.headings.length) {
    errors.push(
      `${article.id}: swallowed headings (${articleParsedHeadings}/${normalized.headings.length} parsed)`
    );
  }

  if (/^\s*(?:!!!|\?\?\?|===)\s+/m.test(normalized.markdown)) {
    errors.push(`${article.id}: visible MkDocs block marker survived normalization`);
  }

  for (const line of normalized.markdown.split('\n')) {
    const heading = line.match(/^\s{0,3}#{1,6}\s+(.+?)\s*$/);
    if (heading && isPracticeHeading(heading[1])) {
      errors.push(`${article.id}: inline practice heading survived normalization: ${heading[1]}`);
    }
  }

  if (/^\s*```\s*\{\s*\./m.test(normalized.markdown)) {
    errors.push(`${article.id}: MkDocs code-fence attributes survived normalization`);
  }
}

for (const article of articles) {
  const articlePath = article.path.replace(/\\/g, '/');
  const normalized = normalizedByPath.get(articlePath);
  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkMath);
  const tree = processor.parse(normalized.markdown);
  walk(tree, (node) => {
    if (node.type !== 'link') return;
    const target = localFragmentTarget(articlePath, node.url);
    if (!target) return;
    const targetArticle = byPath.get(target.path);
    if (!targetArticle) {
      errors.push(`${article.id}: fragment link target article missing: ${node.url}`);
      return;
    }
    const targetDocument = normalizedByPath.get(target.path);
    const ids = new Set(
      targetDocument.headingNodes.flatMap((heading) => [heading.id, ...heading.aliases])
    );
    if (!ids.has(target.fragment)) {
      errors.push(`${article.id}: unresolved fragment ${node.url}`);
    }
  });
}

const accountedHeadingCount = adapterHeadingCount + intentionallyStrippedHeadingCount;
if (accountedHeadingCount < EXPECTED_MINIMUM_HEADINGS) {
  errors.push(`corpus heading floor failed: ${accountedHeadingCount} < ${EXPECTED_MINIMUM_HEADINGS}`);
}
if (adapterHeadingCount !== parsedHeadingCount) {
  errors.push(`corpus swallowed headings: ${parsedHeadingCount}/${adapterHeadingCount} parsed`);
}
if (fragmentLinkCount < EXPECTED_MINIMUM_FRAGMENT_LINKS) {
  errors.push(`fragment-link fixture floor failed: ${fragmentLinkCount} < ${EXPECTED_MINIMUM_FRAGMENT_LINKS}`);
}

const summary = [
  `${articles.length} articles`,
  `${accountedHeadingCount}/${accountedHeadingCount} H2/H3 accounted ` +
    `(${parsedHeadingCount} rendered, ${intentionallyStrippedHeadingCount} practice headings stripped)`,
  `${mathCount} math nodes`,
  `${fragmentLinkCount} fragment links`,
  `${localAssetCount} local image references`,
  `${extractedPracticeCount} practice links with exact structured parity`,
];

if (errors.length) {
  console.error(`Markdown corpus audit FAILED (${summary.join(', ')})`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Markdown corpus audit passed: ${summary.join(', ')}`);
}
