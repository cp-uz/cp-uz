import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const pdfStatementSource = readFileSync(
  new URL('../src/modules/problems/ui/PdfStatement.tsx', import.meta.url),
  'utf8'
);
const problemPageSource = readFileSync(
  new URL('../src/modules/problems/ui/ProblemPage.tsx', import.meta.url),
  'utf8'
);
const problemCatalogSource = readFileSync(
  new URL('../src/modules/problems/ui/ProblemCatalogPage.tsx', import.meta.url),
  'utf8'
);

test('problem PDFs use an inline worker that client filters cannot block', () => {
  assert.match(pdfStatementSource, /pdf\.worker\.min\.mjs\?worker&inline/);
  assert.doesNotMatch(pdfStatementSource, /pdf\.worker\.min\.mjs\?url/);
  assert.doesNotMatch(pdfStatementSource, /GlobalWorkerOptions\.workerSrc/);
});

test('problem detail omits taxonomy chips below the statement', () => {
  assert.doesNotMatch(problemPageSource, /problem\.tags\.map/);
});

test('problem catalog uses APIO and IZhO event logos', () => {
  assert.match(problemCatalogSource, /slug\.startsWith\('apio-'\).*apio-2026\.png/);
  assert.match(problemCatalogSource, /slug\.startsWith\('izho-'\).*izho\.png/);
});

test('IZhO problem codes and PDF files refer to the same official task', () => {
  const cases = [
    ['day-1/little-efnesh-and-monitor', 'A', '/day-1/fixed-tour/statement.pdf'],
    ['day-1/fixed-tour', 'B', '/day-1/game/statement.pdf'],
    ['day-1/game', 'C', '/day-1/little-efnesh-and-monitor/statement.pdf'],
    ['day-2/greedy-arrays', 'A', '/day-2/another-turtle-problem/statement.pdf'],
    ['day-2/another-turtle-problem', 'B', '/day-2/greedy-arrays/statement.pdf'],
    ['day-2/light-bulbs', 'C', '/day-2/light-bulbs/statement.pdf'],
  ];

  for (const [problemPath, code, pdfSuffix] of cases) {
    const problem = JSON.parse(
      readFileSync(
        new URL(
          `../../content/problems/2025-2026/izho-2026/${problemPath}/problem.json`,
          import.meta.url
        ),
        'utf8'
      )
    );

    assert.equal(problem.code, code);
    assert.ok(problem.statement_pdf.url.endsWith(pdfSuffix));
  }
});
