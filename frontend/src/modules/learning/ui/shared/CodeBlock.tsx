import { useState } from 'react';
import { UiIcon } from 'shared/ui/UiIcon';

import { normalizeSyntaxLanguage } from './syntax-highlight';
import { SyntaxHighlightedCode } from './SyntaxHighlightedCode';

type CodeSample = { language: string; label: string; code: string };

export function CodeBlock({ samples, title }: { samples: CodeSample[]; title?: string }) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const sample = samples[active];
  const syntaxLanguage = normalizeSyntaxLanguage(sample.language);

  const copy = async () => {
    await navigator.clipboard.writeText(sample.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="code-block">
      <div className="code-block__bar">
        <div className="code-block__dots" aria-hidden><i /><i /><i /></div>
        <div className="code-block__tabs" role="tablist" aria-label="Dasturlash tili">
          {samples.map((item, index) => (
            <button
              key={item.language}
              type="button"
              role="tab"
              aria-selected={active === index}
              className={active === index ? 'is-active' : ''}
              onClick={() => setActive(index)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button className="code-copy" type="button" onClick={copy} aria-label="Kodni nusxalash">
          <UiIcon icon={copied ? 'solar:check-circle-bold' : 'solar:copy-linear'} width={17} />
          {copied ? 'Nusxalandi' : 'Nusxalash'}
        </button>
      </div>
      {title && <div className="code-block__title">{title}</div>}
      <pre>
        <code data-language={sample.language}>
          {syntaxLanguage
            ? <SyntaxHighlightedCode code={sample.code} language={syntaxLanguage} />
            : sample.code}
        </code>
      </pre>
    </div>
  );
}
