import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
const manifest = JSON.parse(readFileSync(resolve(dist, '.vite/manifest.json'), 'utf8'));
function staticGraph(key, found = new Set()) {
  if (found.has(key)) return found;
  assert.ok(manifest[key], `Missing manifest entry: ${key}`);
  found.add(key);
  for (const dependency of manifest[key].imports || []) staticGraph(dependency, found);
  return found;
}
function bytes(keys) {
  return [...keys].reduce(
    (total, key) => {
      const content = readFileSync(resolve(dist, manifest[key].file));
      return { raw: total.raw + content.length, gzip: total.gzip + gzipSync(content).length };
    },
    { raw: 0, gzip: 0 }
  );
}
const entry = Object.keys(manifest).find((key) => manifest[key].isEntry);
assert.ok(entry, 'Production entry must exist');
const initial = bytes(staticGraph(entry));
assert.ok(
  initial.raw < 700_000 && initial.gzip < 220_000,
  `Initial JS exceeds 700 kB / 220 kB gzip: ${JSON.stringify(initial)}`
);
for (const page of [
  'src/modules/learning/pages/catalog.ts',
  'src/modules/problems/pages/catalog.ts',
]) {
  const graph = staticGraph(page);
  assert.ok(
    ![...graph].some((key) => /RichMarkdown|PdfStatement|PdfPage|markdown/.test(key)),
    `${page} eagerly includes a statement renderer`
  );
}
// Rollup may merge a tiny re-export facade into a shared dynamic chunk and omit
// its `src`. Match its unique entry name in that case, never a guessed hash.
const detailEntries = Object.keys(manifest).filter(
  (key) => manifest[key].isDynamicEntry && manifest[key].name === 'detail'
);
assert.equal(detailEntries.length, 1, 'Problem detail must have one lazy entry');
const detail = staticGraph(detailEntries[0]);
assert.ok(
  ![...detail].some((key) => /PdfStatement|PdfPage|RichMarkdown/.test(key)),
  'Problem detail must load its chosen renderer on demand'
);
const pdf = Object.keys(manifest).find((key) => key.endsWith('/PdfStatement.tsx'));
assert.ok(pdf && manifest[pdf].isDynamicEntry, 'PDF viewer must be a lazy entry');
const pdfBytes = readFileSync(resolve(dist, manifest[pdf].file)).length;
assert.ok(pdfBytes < 1_900_000, `PDF viewer + inline worker exceeds 1.9 MB: ${pdfBytes}`);
process.stdout.write(
  `Bundle boundaries passed. Initial JS: ${initial.raw} bytes (${initial.gzip} gzip); isolated PDF: ${pdfBytes} bytes.\n`
);
