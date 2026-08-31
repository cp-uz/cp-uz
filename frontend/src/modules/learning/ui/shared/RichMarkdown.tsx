import type { ReactNode, ComponentPropsWithoutRef } from 'react';
import type { LearningArticle } from '../../domain';

import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { UiIcon } from 'shared/ui/UiIcon';
import ReactMarkdown from 'react-markdown';
import { useMemo, useState, isValidElement } from 'react';

import { normalizeSyntaxLanguage } from './syntax-highlight';
import { SyntaxHighlightedCode } from './SyntaxHighlightedCode';
import { resolveArticleHref, resolveContentAssetHref } from '../../domain';
import {
  slugifyHeading,
  extractMarkdownHeadings,
  normalizeMarkdownDocument,
  remarkApplyMarkdownMetadata,
} from './markdown-adapter';

export type MarkdownHeading = { id: string; label: string; level: number };

function plainText(value: ReactNode): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(plainText).join('');
  if (isValidElement<{ children?: ReactNode }>(value)) return plainText(value.props.children);
  return '';
}

function copySourceText(value: ReactNode): string {
  if (Array.isArray(value)) return value.map(copySourceText).join('');
  if (isValidElement<{ children?: ReactNode; 'data-copy-code'?: string }>(value)) {
    return value.props['data-copy-code'] ?? copySourceText(value.props.children);
  }
  return plainText(value);
}

async function writeClipboard(value: string) {
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  if (copied) return;

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  throw new Error('Clipboardga nusxalab bo‘lmadi.');
}

function MarkdownCodeBlock({ children }: { children: ReactNode }) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const code = copySourceText(children).replace(/\n$/, '');

  const copy = async () => {
    try {
      await writeClipboard(code);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
    window.setTimeout(() => setCopyState('idle'), 1600);
  };

  return (
    <div className="markdown-code-frame">
      <button
        className="code-copy markdown-code-copy"
        type="button"
        onClick={() => void copy()}
        aria-label="Kodni nusxalash"
      >
        <UiIcon
          icon={
            copyState === 'copied'
              ? 'solar:check-circle-bold'
              : copyState === 'error'
                ? 'solar:danger-triangle-linear'
                : 'solar:copy-linear'
          }
          width={17}
        />
        {copyState === 'copied'
          ? 'Nusxalandi'
          : copyState === 'error'
            ? 'Nusxalanmadi'
            : 'Nusxalash'}
      </button>
      <pre className="markdown-code">{children}</pre>
    </div>
  );
}

export { slugifyHeading, extractMarkdownHeadings };

type HeadingProps = ComponentPropsWithoutRef<'h2'> & {
  node?: unknown;
  'data-heading-aliases'?: string;
  'data-heading-label'?: string;
};

const headingTags = { 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' } as const;

export function RichMarkdown({
  children,
  sourcePath = 'docs/misc/article.md',
  assetBaseUrl,
  knownArticles = [],
}: {
  children: string;
  sourcePath?: string;
  assetBaseUrl?: string;
  knownArticles?: LearningArticle[];
}) {
  const document = useMemo(() => normalizeMarkdownDocument(children), [children]);
  const heading = (level: 1 | 2 | 3 | 4 | 5 | 6) => ({
    id: providedId,
    children: headingChildren,
    'data-heading-label': providedLabel,
    'data-heading-aliases': aliasList = '',
  }: HeadingProps) => {
    const label = providedLabel || plainText(headingChildren);
    const id = providedId || slugifyHeading(label) || 'bolim';
    const Heading = headingTags[level];
    const aliases = aliasList.split(' ').filter(Boolean);
    return (
      <Heading id={id}>
        {aliases.map((alias) => <span key={alias} id={alias} className="heading-alias" aria-hidden />)}
        {headingChildren}
        <a className="heading-anchor" href={`#${id}`} aria-hidden tabIndex={-1}>#</a>
      </Heading>
    );
  };

  return (
    <div className="rich-markdown">
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
          remarkMath,
          [remarkApplyMarkdownMetadata, { headingNodes: document.headingNodes }],
        ]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: heading(1),
          h2: heading(2),
          h3: heading(3),
          h4: heading(4),
          h5: heading(5),
          h6: heading(6),
          a: ({ href = '', children: linkChildren }) => {
            const resolved = resolveArticleHref(sourcePath, href, knownArticles);
            const external = /^https?:\/\//i.test(resolved);
            return <a href={resolved} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>{linkChildren}</a>;
          },
          img: ({ src = '', alt = '' }) => (
            <span className="article-image" role="figure" aria-label={alt || undefined}>
              <img src={resolveContentAssetHref(sourcePath, src, assetBaseUrl)} alt={alt} loading="lazy" />
              {alt && <span className="article-image__caption">{alt}</span>}
            </span>
          ),
          pre: ({ children: codeChildren }) => (
            <MarkdownCodeBlock>{codeChildren}</MarkdownCodeBlock>
          ),
          code: ({ className, children: codeChildren }) => {
            const language = normalizeSyntaxLanguage(/language-([^\s]+)/.exec(className ?? '')?.[1]);
            const code = plainText(codeChildren).replace(/\n$/, '');
            if (!language) {
              return (
                <code className={className} data-copy-code={code}>
                  {codeChildren}
                </code>
              );
            }
            return (
              <code className={className} data-language={language} data-copy-code={code}>
                <SyntaxHighlightedCode code={code} language={language} />
              </code>
            );
          },
        }}
      >
        {document.markdown}
      </ReactMarkdown>
    </div>
  );
}
