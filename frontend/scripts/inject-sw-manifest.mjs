import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outputDirectory = path.join(process.cwd(), 'dist');
const serviceWorkerPath = path.join(outputDirectory, 'sw.js');
const rootIndexPath = path.join(outputDirectory, 'index.html');
const manifestToken = '/* __PRECACHE_MANIFEST__ */';
const hashToken = '__BUILD_HASH__';

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = path.join(directory, entry.name);
      return entry.isDirectory() ? listFiles(absolutePath) : [absolutePath];
    })
  );
  return nestedFiles.flat();
}

function toPublicUrl(absolutePath) {
  const relativePath = path.relative(outputDirectory, absolutePath).split(path.sep).join('/');
  return `/${relativePath
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')}`;
}

const outputFiles = (await listFiles(outputDirectory))
  .filter(
    (file) =>
      file !== serviceWorkerPath &&
      !file.endsWith('.map') &&
      (!file.endsWith(`${path.sep}index.html`) || file === rootIndexPath)
  )
  .sort();

if (outputFiles.length === 0)
  throw new Error('PWA keshiga qo‘shish uchun build fayllari topilmadi.');

const serviceWorkerTemplate = await readFile(serviceWorkerPath, 'utf8');
if (!serviceWorkerTemplate.includes(manifestToken) || !serviceWorkerTemplate.includes(hashToken)) {
  throw new Error('Service worker injection tokenlari topilmadi.');
}

const buildHash = createHash('sha256');
buildHash.update(serviceWorkerTemplate);
for (const file of outputFiles) {
  buildHash.update(toPublicUrl(file));
  buildHash.update(await readFile(file));
}

const cacheVersion = buildHash.digest('hex').slice(0, 16);
const precacheManifest = outputFiles
  .map(toPublicUrl)
  .map((url) => JSON.stringify(url))
  .join(',\n  ');
const generatedServiceWorker = serviceWorkerTemplate
  .replace(manifestToken, precacheManifest)
  .replaceAll(hashToken, cacheVersion);

await writeFile(serviceWorkerPath, generatedServiceWorker);
console.log(`PWA keshiga ${outputFiles.length} ta fayl qo‘shildi (${cacheVersion}).`);
