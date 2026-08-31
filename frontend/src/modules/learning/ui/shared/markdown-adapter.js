const FENCE_OPEN = /^((?:[ \t]*>[ \t]?)*[ \t]*)(`{3,}|~{3,})(.*)$/;
const HEADING = /^(\s{0,3})(#{1,6})\s+(.+?)\s*$/;
const MKDOCS_BLOCK = /^(\s*)(!!!|\?\?\?|===)\s+(.+?)\s*$/;
const SAFE_CONTAINER_OPEN = /^(\s*)<(div|center|figure)(?:\s[^>]*)?>\s*$/i;
const MARKDOWN_LINK = /(?<!!)\[([^\]]+)\]\((https?:\/\/[^\s)]+)(?:\s+['"][^'"]*['"])?\)/g;

const CALLOUT_LABELS = {
  danger: 'Diqqat',
  error: 'Xato',
  example: 'Misol',
  hint: 'Yechim',
  info: 'Ma’lumot',
  lemma: 'Lemma',
  note: 'Izoh',
  tip: 'Tavsiya',
  warning: 'Ogohlantirish',
};

function leadingWidth(line) {
  return line.match(/^\s*/)?.[0].length ?? 0;
}

function isFenceClose(line, fence) {
  if (!fence) return false;
  const match = line.match(FENCE_OPEN);
  return Boolean(match && match[2][0] === fence.marker && match[2].length >= fence.length && !match[3].trim());
}

function updateFence(line, fence) {
  if (fence) return isFenceClose(line, fence) ? null : fence;
  const match = line.match(FENCE_OPEN);
  if (!match) return null;
  return { marker: match[2][0], length: match[2].length };
}

function plainPracticeHeading(value) {
  return value
    .replace(/\s+\{[^{}]*\}\s*$/, '')
    .replace(/[`*_]/g, '')
    .toLocaleLowerCase('uz')
    .trim()
    .replace(/:+$/, '')
    .replace(/\s+/g, ' ');
}

export function isPracticeHeading(value) {
  const heading = plainPracticeHeading(value);
  if (['masalalar', 'masalalari', 'practice problems', 'practice problem'].includes(heading)) {
    return true;
  }
  if (heading.startsWith('masala misol')) return true;
  return /(?:mashq|amaliy|namunaviy|misol|onlayn hakamlardagi|bog‘liq|bog'liq|boshqa).*(?:masala|masalalar|masalalari)$/.test(
    heading
  );
}

function isExerciseUrl(value) {
  try {
    const hostname = new URL(value).hostname.toLowerCase();
    return !['wikipedia.org', 'e-maxx.ru'].some(
      (suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`)
    );
  } catch {
    return false;
  }
}

export function stripPracticeSections(markdown) {
  const lines = String(markdown ?? '').replace(/\r\n?/g, '\n').split('\n');
  const output = [];
  const practiceLinks = [];
  const seenUrls = new Set();
  let removedHeadingCount = 0;
  let activeLevel = null;
  let fence = null;

  for (const line of lines) {
    const nextFence = updateFence(line, fence);
    if (fence || nextFence) {
      if (activeLevel === null) output.push(line);
      fence = nextFence;
      continue;
    }

    const heading = line.match(HEADING);
    if (heading) {
      const level = heading[2].length;
      if (activeLevel !== null && level <= activeLevel) activeLevel = null;
      if (activeLevel === null && isPracticeHeading(heading[3])) {
        activeLevel = level;
        if (level === 2 || level === 3) removedHeadingCount += 1;
        continue;
      }
      if (activeLevel !== null) {
        if (level === 2 || level === 3) removedHeadingCount += 1;
        continue;
      }
      output.push(line);
      continue;
    }

    if (activeLevel === null) {
      output.push(line);
      continue;
    }

    for (const match of line.matchAll(MARKDOWN_LINK)) {
      const title = match[1].replace(/\s+/g, ' ').trim();
      const url = match[2].trim();
      if (!isExerciseUrl(url) || seenUrls.has(url)) continue;
      seenUrls.add(url);
      practiceLinks.push({ title, url });
    }
  }

  return { markdown: output.join('\n'), practiceLinks, removedHeadingCount };
}

function dedent(lines, targetIndent) {
  const populated = lines.filter((line) => line.trim());
  if (!populated.length) return lines;
  const minimum = Math.min(...populated.map(leadingWidth));
  const remove = Math.max(0, minimum - targetIndent);
  return lines.map((line) => (line.trim() ? line.slice(Math.min(remove, leadingWidth(line))) : ''));
}

function findContainerEnd(lines, start, tag) {
  let depth = 1;
  let fence = null;
  const nestedOpen = new RegExp(`^\\s*<${tag}(?:\\s[^>]*)?>\\s*$`, 'i');
  const close = new RegExp(`^\\s*</${tag}>\\s*$`, 'i');

  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    const nextFence = updateFence(line, fence);
    if (fence || nextFence) {
      fence = nextFence;
      continue;
    }
    if (nestedOpen.test(line)) depth += 1;
    if (close.test(line)) depth -= 1;
    if (depth === 0) return index;
  }
  return -1;
}

function parseHtmlAttributes(source) {
  const attributes = {};
  const pattern = /([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
  for (const match of source.matchAll(pattern)) {
    attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? '';
  }
  return attributes;
}

function escapeMarkdownLabel(value) {
  return value.replace(/([\\[\]])/g, '\\$1');
}

function escapeMarkdownDestination(value) {
  return value.replace(/([()])/g, '\\$1');
}

function sanitizeInlineHtml(line) {
  let output = line;

  // Raw executable/style content is never passed to react-markdown.
  output = output.replace(
    /<script\b[^>]*type\s*=\s*(["'])math\/tex[^"']*\1[^>]*>([\s\S]*?)<\/script>/gi,
    '$2'
  );
  output = output.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  output = output.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');

  output = output.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (_match, rawAttributes, body) => {
    const { href } = parseHtmlAttributes(rawAttributes);
    const text = body.replace(/<[^>]+>/g, '').trim();
    if (!href) return text;
    return `[${escapeMarkdownLabel(text || href)}](${escapeMarkdownDestination(href)})`;
  });

  output = output.replace(/<img\b([^>]*)\/?\s*>/gi, (_match, rawAttributes) => {
    const { alt = '', src } = parseHtmlAttributes(rawAttributes);
    if (!src) return '';
    return `![${escapeMarkdownLabel(alt)}](${escapeMarkdownDestination(src)})`;
  });

  output = output.replace(/<br\s*\/?\s*>/gi, '  \n');
  output = output.replace(/<\/?(?:div|center|figure|figcaption|span)\b[^>]*>/gi, '');

  // Unknown raw tags remain inert text in react-markdown, but hiding the tag itself
  // avoids exposing unsafe attributes such as onerror/style in the article body.
  output = output.replace(/<\/?[a-z][^>]*>/gi, '');
  return output;
}

function normalizeSafeHtmlLines(lines) {
  const output = [];
  let fence = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const nextFence = updateFence(line, fence);
    if (fence || nextFence) {
      output.push(line);
      fence = nextFence;
      continue;
    }

    const emptyAnchor = line.match(
      /^\s*<(?:a|div)\b([^>]*)>\s*<\/(?:a|div)>\s*$/i
    );
    if (emptyAnchor) {
      const { id } = parseHtmlAttributes(emptyAnchor[1]);
      if (id) output.push(`<!-- cp-anchor:${encodeURIComponent(id)} -->`);
      continue;
    }

    const container = line.match(SAFE_CONTAINER_OPEN);
    if (container) {
      const end = findContainerEnd(lines, index, container[2]);
      if (end !== -1) {
        const inner = dedent(lines.slice(index + 1, end), container[1].length);
        output.push(...normalizeSafeHtmlLines(inner));
        index = end;
        continue;
      }
    }

    const sanitized = sanitizeInlineHtml(line);
    output.push(...sanitized.split('\n'));
  }

  return output;
}

function quoteBlock(lines, title) {
  const output = [`> **${title}**`];
  if (lines.length) output.push('>');
  for (const line of lines) output.push(line ? `> ${line}` : '>');
  return output;
}

function parseBlockTitle(payload) {
  const match = payload.match(/^(\S+)(?:\s+(["'])([\s\S]*)\2)?$/);
  const type = (match?.[1] ?? 'note').toLowerCase();
  const explicit = match?.[3]?.trim();
  return { type, title: explicit || CALLOUT_LABELS[type] || 'Izoh' };
}

function normalizeMkDocsLines(lines) {
  const output = [];
  let fence = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const nextFence = updateFence(line, fence);
    if (fence || nextFence) {
      output.push(line);
      fence = nextFence;
      continue;
    }

    const marker = line.match(MKDOCS_BLOCK);
    if (!marker) {
      output.push(line);
      continue;
    }

    const baseIndent = marker[1].length;
    let end = index + 1;
    let lastBodyLine = index;
    while (end < lines.length) {
      const candidate = lines[end];
      if (!candidate.trim()) {
        end += 1;
        continue;
      }
      if (leadingWidth(candidate) <= baseIndent) break;
      lastBodyLine = end;
      end += 1;
    }

    const rawBody = lines.slice(index + 1, Math.max(index + 1, lastBodyLine + 1));
    const body = normalizeMkDocsLines(dedent(rawBody, baseIndent));
    const { title: blockTitle } = parseBlockTitle(marker[3]);
    const tabTitle = marker[3].match(/^(["'])([\s\S]*)\1$/)?.[2]?.trim();
    const title = marker[2] === '===' ? tabTitle || marker[3].trim() : blockTitle;

    if (marker[2] === '===') {
      output.push(`${marker[1]}**${title}**`, ...body, '');
    } else {
      const detailSuffix = marker[2] === '???' ? ' — batafsil' : '';
      output.push(...quoteBlock(body, `${title}${detailSuffix}`).map((item) => `${marker[1]}${item}`));
      output.push('');
    }

    index = Math.max(index, lastBodyLine);
  }

  return output;
}

function normalizeLanguage(value) {
  const language = value.trim().toLowerCase();
  if (language === 'c++' || language === '.c++' || language === '.cpp') return 'cpp';
  return language.replace(/^\./, '');
}

function normalizeFenceInfo(lines) {
  const output = [];
  let fence = null;

  for (const line of lines) {
    if (fence) {
      output.push(line);
      fence = updateFence(line, fence);
      continue;
    }

    const match = line.match(FENCE_OPEN);
    if (!match) {
      output.push(line);
      continue;
    }

    const braceInfo = match[3].trim().match(/^\{\s*\.([^\s}]+)([\s\S]*?)\}$/);
    if (braceInfo) {
      const language = normalizeLanguage(braceInfo[1]);
      const meta = braceInfo[2].trim();
      output.push(`${match[1]}${match[2]}${language}${meta ? ` ${meta}` : ''}`);
    } else {
      const info = match[3].trim();
      const [language = '', ...meta] = info.split(/\s+/);
      output.push(
        `${match[1]}${match[2]}${language ? normalizeLanguage(language) : ''}${meta.length ? ` ${meta.join(' ')}` : ''}`
      );
    }
    fence = { marker: match[2][0], length: match[2].length };
  }

  return output;
}

function normalizeDisplayMath(lines) {
  const output = [];
  let fence = null;
  let inDisplayMath = false;

  for (const line of lines) {
    const nextFence = updateFence(line, fence);
    if (fence || nextFence) {
      output.push(line);
      fence = nextFence;
      continue;
    }

    if (!line.includes('$$')) {
      output.push(line);
      continue;
    }

    const indent = line.match(/^((?:[ \t]*>[ \t]?)*[ \t]*)/)?.[0] ?? '';
    const body = line.slice(indent.length);
    const pieces = body.split('$$');
    for (let index = 0; index < pieces.length; index += 1) {
      const piece = pieces[index];
      if (piece) output.push(`${indent}${piece}`);
      if (index < pieces.length - 1) {
        output.push(`${indent}$$`);
        inDisplayMath = !inDisplayMath;
      }
    }
  }

  // An unmatched delimiter is retained for the parser/audit to report.
  void inDisplayMath;
  return output;
}

function stripHeadingAttribute(value) {
  const match = value.match(/\s*\{\s*([^{}]*)\}\s*$/);
  if (!match || !/(?:^|\s)#[^\s}]+|data-toc-label\s*=/i.test(match[1])) {
    return { text: value.replace(/\s+#+\s*$/, '').trim(), explicitId: '', tocLabel: '' };
  }

  const attributes = match[1];
  const explicitId = attributes.match(/(?:^|\s)#([^\s}]+)/)?.[1] ?? '';
  const tocMatch = attributes.match(/data-toc-label\s*=\s*(["'])([\s\S]*?)\1/i);
  const tocLabel = tocMatch?.[2] ?? '';
  return {
    explicitId,
    tocLabel,
    text: value.slice(0, match.index).replace(/\s+#+\s*$/, '').trim(),
  };
}

function plainHeadingLabel(value) {
  return value
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, '$1')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\\(?:operatorname|mathrm|textrm|text|mathtt)\{([^{}]*)\}/g, '$1')
    .replace(/\\([a-zA-Z]+)/g, '$1')
    .replace(/[${}^_*~]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function slugifyHeading(value) {
  return plainHeadingLabel(value)
    .normalize('NFKD')
    .toLocaleLowerCase('uz')
    .replace(/[()]/g, '')
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .trim()
    .replace(/[\s_]+/g, '-');
}

function safeExplicitId(value) {
  return value.normalize('NFKC').replace(/[^\p{L}\p{N}_.:-]/gu, '');
}

function allocateId(base, usedIds) {
  const root = base || 'bolim';
  if (!usedIds.has(root)) {
    usedIds.add(root);
    return root;
  }
  let suffix = 2;
  while (usedIds.has(`${root}-${suffix}`)) suffix += 1;
  const unique = `${root}-${suffix}`;
  usedIds.add(unique);
  return unique;
}

function buildHeadingModel(lines) {
  const headings = [];
  const headingNodes = [];
  const output = [];
  const usedIds = new Set();
  let pendingAliases = [];
  let fence = null;

  for (const line of lines) {
    const nextFence = updateFence(line, fence);
    if (fence || nextFence) {
      output.push(line);
      fence = nextFence;
      continue;
    }

    const anchor = line.match(/^\s*<!-- cp-anchor:([^\s]+) -->\s*$/);
    if (anchor) {
      pendingAliases.push(decodeURIComponent(anchor[1]));
      continue;
    }

    const match = line.match(HEADING);
    if (!match) {
      output.push(line);
      continue;
    }

    const parsed = stripHeadingAttribute(match[3]);
    const visibleText = parsed.text;
    const label = plainHeadingLabel(parsed.tocLabel || visibleText) || 'Bo‘lim';
    const baseId = safeExplicitId(parsed.explicitId) || slugifyHeading(label) || 'bolim';
    const id = allocateId(baseId, usedIds);
    const aliases = [];
    for (const rawAlias of pendingAliases) {
      const alias = safeExplicitId(rawAlias);
      if (!alias || alias === id || usedIds.has(alias)) continue;
      usedIds.add(alias);
      aliases.push(alias);
    }
    pendingAliases = [];

    const level = match[2].length;
    output.push(`${match[1]}${match[2]} ${visibleText}`);
    const heading = { aliases, id, label, level };
    headingNodes.push(heading);
    if (level === 2 || level === 3) headings.push(heading);
  }

  return { headingNodes, headings, lines: output };
}

export function normalizeMarkdownDocument(markdown) {
  const stripped = stripPracticeSections(markdown);
  const htmlSafe = normalizeSafeHtmlLines(stripped.markdown.split('\n'));
  const mkDocsSafe = normalizeMkDocsLines(htmlSafe);
  const fencesNormalized = normalizeFenceInfo(mkDocsSafe);
  const displayMathNormalized = normalizeDisplayMath(fencesNormalized);
  const { headingNodes, headings, lines } = buildHeadingModel(displayMathNormalized);
  return {
    headingNodes,
    headings,
    markdown: lines.join('\n'),
    practiceLinks: stripped.practiceLinks,
    removedHeadingCount: stripped.removedHeadingCount,
  };
}

export function extractMarkdownHeadings(markdown) {
  return normalizeMarkdownDocument(markdown).headings;
}

function walk(node, visitor) {
  visitor(node);
  if (!Array.isArray(node?.children)) return;
  for (const child of node.children) walk(child, visitor);
}

export function remarkApplyMarkdownMetadata(options) {
  const headingNodes = options?.headingNodes ?? options?.headings ?? [];

  return (tree) => {
    let headingIndex = 0;
    walk(tree, (node) => {
      if (node.type === 'heading') {
        const heading = headingNodes[headingIndex];
        headingIndex += 1;
        if (!heading) return;
        node.data = node.data || {};
        node.data.hProperties = {
          ...(node.data.hProperties || {}),
          'data-heading-aliases': heading.aliases.join(' '),
          'data-heading-label': heading.label,
          id: heading.id,
        };
      }

      if (node.type === 'code') {
        node.lang = normalizeLanguage(node.lang || '');
        const filename = node.meta?.match(/(?:^|\s)file=(?:"([^"]+)"|'([^']+)'|([^\s]+))/i);
        if (!filename) return;
        node.data = node.data || {};
        node.data.hProperties = {
          ...(node.data.hProperties || {}),
          'data-filename': filename[1] ?? filename[2] ?? filename[3],
        };
      }
    });
  };
}
