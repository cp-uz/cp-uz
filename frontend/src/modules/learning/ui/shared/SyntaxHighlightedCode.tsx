import type { SyntaxLanguage } from './syntax-highlight';

import { tokenizeCode } from './syntax-highlight';

export function SyntaxHighlightedCode({ code, language }: { code: string; language: SyntaxLanguage }) {
  return tokenizeCode(code, language).map((token, index) => (
    token.kind
      ? <span key={`${index}-${token.kind}`} className={`syntax-token syntax-token--${token.kind}`}>{token.value}</span>
      : token.value
  ));
}
