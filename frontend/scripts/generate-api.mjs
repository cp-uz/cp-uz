import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import openapiTS, { astToString } from 'openapi-typescript';
import { format, resolveConfig } from 'prettier';

const frontend = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const backend = resolve(frontend, '..', 'backend');
const output = join(frontend, 'src/shared/api/generated/schema.d.ts');
const localPython = join(
  backend,
  '.venv',
  process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python'
);
const python = process.env.CPUZ_PYTHON || (existsSync(localPython) ? localPython : 'python');
const temporary = await mkdtemp(join(tmpdir(), 'cpuz-openapi-'));

try {
  const schemaFile = join(temporary, 'schema.json');
  const result = spawnSync(
    python,
    [
      'manage.py',
      'spectacular',
      '--format',
      'openapi-json',
      '--validate',
      '--fail-on-warn',
      '--file',
      schemaFile,
    ],
    {
      cwd: backend,
      encoding: 'utf8',
      env: {
        ...process.env,
        DJANGO_SETTINGS_MODULE: 'core.settings.development',
        DATABASE_URL: 'sqlite:///:memory:',
        DJANGO_DEBUG: 'False',
        PYTHONIOENCODING: 'utf-8',
      },
    }
  );
  if (result.error || result.status !== 0) {
    throw new Error(
      `OpenAPI export failed: ${result.error?.message || result.stderr || result.stdout}`
    );
  }
  const schema = JSON.parse(await readFile(schemaFile, 'utf8'));
  const ast = await openapiTS(schema, { alphabetize: true });
  const header =
    '// Generated from Django OpenAPI. Run npm run api:generate; do not edit by hand.\n';
  const generated = await format(header + astToString(ast), {
    ...(await resolveConfig(output)),
    parser: 'typescript',
    endOfLine: 'lf',
  });
  if (process.argv.includes('--check')) {
    const current = await readFile(output, 'utf8').catch(() => '');
    if (current.replace(/\r\n/g, '\n') !== generated) {
      throw new Error(
        'Generated API types are stale. Run npm run api:generate and include schema.d.ts.'
      );
    }
    process.stdout.write('Generated API contract is current.\n');
  } else {
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, generated, 'utf8');
    process.stdout.write('Generated src/shared/api/generated/schema.d.ts.\n');
  }
} finally {
  await rm(temporary, { recursive: true, force: true });
}
