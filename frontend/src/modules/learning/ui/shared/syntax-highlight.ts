export type SyntaxLanguage = 'cpp' | 'python';

export type SyntaxToken = {
  kind?: 'builtin' | 'comment' | 'keyword' | 'number' | 'operator' | 'string' | 'type';
  value: string;
};

const CPP_KEYWORDS = new Set([
  'alignas', 'alignof', 'and', 'asm', 'auto', 'break', 'case', 'catch', 'class', 'const',
  'constexpr', 'continue', 'default', 'delete', 'do', 'else', 'enum', 'explicit', 'export',
  'extern', 'false', 'for', 'friend', 'goto', 'if', 'inline', 'namespace', 'new', 'noexcept',
  'not', 'nullptr', 'operator', 'or', 'private', 'protected', 'public', 'register', 'return',
  'sizeof', 'static', 'struct', 'switch', 'template', 'this', 'throw', 'true', 'try', 'typedef',
  'typename', 'union', 'using', 'virtual', 'volatile', 'while', 'xor',
]);

const CPP_TYPES = new Set([
  'bool', 'char', 'double', 'float', 'int', 'int32_t', 'int64_t', 'long', 'short', 'signed',
  'size_t', 'string', 'uint32_t', 'uint64_t', 'unsigned', 'vector', 'void',
]);

const CPP_BUILTINS = new Set([
  'begin', 'cin', 'cout', 'emplace_back', 'end', 'lower_bound', 'make_pair', 'max', 'min',
  'pair', 'push_back', 'reverse', 'sort', 'swap', 'upper_bound',
]);

const PYTHON_KEYWORDS = new Set([
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class',
  'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global',
  'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return',
  'try', 'while', 'with', 'yield',
]);

const PYTHON_BUILTINS = new Set([
  'abs', 'all', 'any', 'bool', 'dict', 'enumerate', 'filter', 'float', 'input', 'int', 'len',
  'list', 'map', 'max', 'min', 'print', 'range', 'reversed', 'set', 'sorted', 'str', 'sum',
  'tuple', 'zip',
]);

const CPP_PARTS = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|#\s*[a-zA-Z_][^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:0[xX][\da-fA-F]+|\d+(?:\.\d+)?)\b|\b[A-Za-z_]\w*\b|[{}()[\];,.<>:=+\-*/%&|!^~?]+|\s+|.)/g;
const PYTHON_PARTS = /("""[\s\S]*?"""|'''[\s\S]*?'''|#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:0[xX][\da-fA-F]+|\d+(?:\.\d+)?)\b|\b[A-Za-z_]\w*\b|[{}()[\];,.<>:=+\-*/%&|!^~?]+|\s+|.)/g;

export function normalizeSyntaxLanguage(value?: string): SyntaxLanguage | undefined {
  const language = value?.toLowerCase();
  if (language === 'cpp' || language === 'c++' || language === 'cc' || language === 'cxx') return 'cpp';
  if (language === 'python' || language === 'py') return 'python';
  return undefined;
}

export function tokenizeCode(code: string, language: SyntaxLanguage): SyntaxToken[] {
  const parts = code.match(language === 'cpp' ? CPP_PARTS : PYTHON_PARTS) ?? [code];

  return parts.map((value) => {
    if (language === 'cpp') {
      if (value.startsWith('//') || value.startsWith('/*')) return { kind: 'comment', value };
      if (/^#\s*[A-Za-z_]/.test(value)) return { kind: 'keyword', value };
      if (CPP_KEYWORDS.has(value)) return { kind: 'keyword', value };
      if (CPP_TYPES.has(value)) return { kind: 'type', value };
      if (CPP_BUILTINS.has(value)) return { kind: 'builtin', value };
    } else {
      if (value.startsWith('#')) return { kind: 'comment', value };
      if (PYTHON_KEYWORDS.has(value)) return { kind: 'keyword', value };
      if (PYTHON_BUILTINS.has(value)) return { kind: 'builtin', value };
    }

    if (/^(?:"|')/.test(value)) return { kind: 'string', value };
    if (/^(?:0[xX][\da-fA-F]+|\d)/.test(value)) return { kind: 'number', value };
    if (/^[{}()[\];,.<>:=+\-*/%&|!^~?]+$/.test(value)) return { kind: 'operator', value };
    return { value };
  });
}
