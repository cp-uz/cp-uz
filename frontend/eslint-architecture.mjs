import path from 'node:path';

// Resolve source imports without touching the filesystem so aliases and relative
// imports obey the same boundaries. Type-only imports remain checked as well.
function sourcePath(specifier, filename) {
  if (/^(app|modules|shared)\//.test(specifier)) return path.posix.normalize(specifier);
  if (specifier.startsWith('src/')) return path.posix.normalize(specifier.slice(4));
  if (!specifier.startsWith('.')) return null;
  const absolute = path.resolve(path.dirname(filename), specifier).replaceAll('\\', '/');
  return absolute.includes('/src/') ? absolute.split('/src/').pop() : null;
}
const rule = {
  meta: { type: 'problem', schema: [], messages: { boundary: '{{message}}' } },
  create(context) {
    const filename = context.filename.replaceAll('\\', '/');
    const from = filename.split('/src/').pop();
    const ownModule = from.match(/^modules\/([^/]+)\//)?.[1];
    const domain = /^modules\/[^/]+\/domain\//.test(from);
    const report = (node, message) =>
      context.report({ node, messageId: 'boundary', data: { message } });
    function check(node) {
      const value = node.source?.value;
      if (typeof value !== 'string') return;
      const target = sourcePath(value, filename);
      if (from.startsWith('shared/') && target && /^(app|modules)\//.test(target))
        report(node, 'shared cannot depend on app or a product module.');
      if (ownModule && target?.startsWith('app/'))
        report(node, 'A product module cannot depend on app composition.');
      if (
        domain &&
        (/^(react|react-dom|@mui\/)/.test(value) ||
          (target?.startsWith('modules/') && !/^modules\/[^/]+\/domain(?:\/|$)/.test(target)) ||
          (target && /^shared\/(api|storage|hooks|pwa|ui)(?:\/|$)/.test(target)))
      )
        report(node, 'Domain code must remain independent of UI and infrastructure.');
      const other = target?.match(/^modules\/([^/]+)\/(.*)$/);
      if (other && other[1] !== ownModule) {
        const entry = other[2].replace(/\.(tsx?|jsx?)$/, '');
        if (
          !/^(index|application(?:\/index)?|domain(?:\/index)?|pages\/[^/]+|markdown|sync-status|article-card|guest-upgrade-dialog|preview)$/.test(
            entry
          )
        )
          report(
            node,
            'Use an explicit public module entrypoint instead of another module’s internals.'
          );
      }
    }
    return {
      ImportDeclaration: check,
      ExportNamedDeclaration: check,
      ExportAllDeclaration: check,
      ImportExpression: (node) =>
        check({ source: node.source, type: node.type, loc: node.loc, range: node.range }),
      CallExpression(node) {
        const callee = node.callee;
        const directFetch = callee.type === 'Identifier' && callee.name === 'fetch';
        const globalFetch =
          callee.type === 'MemberExpression' &&
          callee.object.type === 'Identifier' &&
          ['window', 'globalThis', 'self'].includes(callee.object.name) &&
          (callee.computed ? callee.property.value === 'fetch' : callee.property.name === 'fetch');
        if (
          (domain || /^modules\/[^/]+\/(ui|application)\//.test(from)) &&
          (directFetch || globalFetch)
        )
          report(node, 'HTTP belongs in data-access, behind an application use case.');
      },
    };
  },
};
export default { rules: { boundaries: rule } };
