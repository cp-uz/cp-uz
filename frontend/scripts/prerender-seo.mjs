import fs from 'node:fs';
import path from 'node:path';

const frontendRoot = process.cwd();
const contentRoot = path.resolve(frontendRoot, '..', 'content');
const distRoot = path.join(frontendRoot, 'dist');
const templatePath = path.join(distRoot, 'index.html');
const siteUrl = 'https://cp.uz';

if (!fs.existsSync(templatePath)) {
  throw new Error(`Vite app shell topilmadi: ${templatePath}`);
}

const template = fs.readFileSync(templatePath, 'utf8');

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function canonicalPath(value) {
  const clean = String(value || '').replace(/^\/+|\/+$/g, '');
  return clean ? `/${clean}/` : '/';
}

function replaceMeta(html, attribute, key, content) {
  const matcher = new RegExp(`<meta\\s+[^>]*${attribute}=["']${key}["'][^>]*>`, 'i');
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;
  return matcher.test(html)
    ? html.replace(matcher, tag)
    : html.replace('</head>', `    ${tag}\n  </head>`);
}

function renderHtml({
  route,
  title,
  description,
  type = 'website',
  robots = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
  schema,
}) {
  const pathname = canonicalPath(route);
  const url = `${siteUrl}${pathname}`;
  const fullTitle = title.includes('cp.uz') ? title : `${title} — cp.uz`;
  let html = template.replace(/<html\s+lang=["'][^"']+["']>/i, '<html lang="uz-Latn">');
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(fullTitle)}</title>`);
  html = replaceMeta(html, 'name', 'description', description);
  html = replaceMeta(html, 'name', 'robots', robots);
  html = replaceMeta(html, 'property', 'og:title', fullTitle);
  html = replaceMeta(html, 'property', 'og:description', description);
  html = replaceMeta(html, 'property', 'og:url', url);
  html = replaceMeta(html, 'property', 'og:type', type);
  html = replaceMeta(html, 'property', 'og:locale', 'uz_UZ');
  html = replaceMeta(html, 'name', 'twitter:title', fullTitle);
  html = replaceMeta(html, 'name', 'twitter:description', description);
  html = html.replace(
    /<link\s+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${escapeHtml(url)}" />`
  );

  const pageSchema = {
    '@context': 'https://schema.org',
    ...schema,
    url,
    inLanguage: 'uz-Latn',
    isPartOf: { '@id': `${siteUrl}/#website` },
  };
  const json = JSON.stringify(pageSchema).replaceAll('<', '\\u003c');
  return html.replace(
    '</head>',
    `    <script type="application/ld+json" data-cpuz-prerender>${json}</script>\n  </head>`
  );
}

function writePage(metadata) {
  const pathname = canonicalPath(metadata.route);
  const outputDirectory = path.join(distRoot, ...pathname.split('/').filter(Boolean));
  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(path.join(outputDirectory, 'index.html'), renderHtml(metadata));
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function walk(directory, filename) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(target, filename);
    return entry.name === filename ? [target] : [];
  });
}

function slugify(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const staticPages = [
  {
    route: '/algo',
    title: 'Algoritmlar va ma’lumotlar tuzilmalari',
    description:
      'Sport dasturlash uchun algoritmlar, ma’lumotlar tuzilmalari va masala yechish usullarini o‘zbek tilida o‘rganing.',
    schema: { '@type': 'CollectionPage', name: 'Algoritmlar kutubxonasi' },
  },
  {
    route: '/tasks',
    title: 'Olimpiada masalalari',
    description:
      'IOI, EGOI, APIO, IZhO va O‘zbekiston saralash bosqichlari masalalarining o‘zbekcha katalogi.',
    schema: { '@type': 'CollectionPage', name: 'Olimpiada masalalari' },
  },
  {
    route: '/seasons',
    title: 'Sport dasturlash mavsumlari',
    description:
      'O‘zbekiston sport dasturlash olimpiadalari, saralash bosqichlari va xalqaro musobaqalar taqvimi.',
    schema: { '@type': 'CollectionPage', name: 'Sport dasturlash mavsumlari' },
  },
  {
    route: '/roadmap',
    title: 'Sport dasturlash yo‘l xaritasi',
    description:
      'Algoritmlar va ma’lumotlar tuzilmalarini qaysi tartibda o‘rganish uchun o‘zbekcha sport dasturlash yo‘l xaritasi.',
    schema: { '@type': 'LearningResource', name: 'Sport dasturlash yo‘l xaritasi' },
  },
  {
    route: '/dict',
    title: 'Algoritmik atamalar lug‘ati',
    description:
      'Algoritmlar, ma’lumotlar tuzilmalari va competitive programming atamalarining o‘zbekcha lug‘ati.',
    schema: { '@type': 'DefinedTermSet', name: 'Algoritmik atamalar lug‘ati' },
  },
  {
    route: '/login',
    title: 'Kirish',
    description: 'cp.uz profilingizga kirish sahifasi.',
    robots: 'noindex,nofollow',
    schema: { '@type': 'WebPage', name: 'Kirish' },
  },
  {
    route: '/profile',
    title: 'Mening profilim',
    description: 'cp.uz shaxsiy profil sahifasi.',
    robots: 'noindex,nofollow',
    schema: { '@type': 'ProfilePage', name: 'Mening profilim' },
  },
  {
    route: '/saved',
    title: 'Saqlangan maqolalar',
    description: 'cp.uz shaxsiy saqlangan maqolalar sahifasi.',
    robots: 'noindex,nofollow',
    schema: { '@type': 'CollectionPage', name: 'Saqlangan maqolalar' },
  },
];

for (const page of staticPages) writePage(page);

const articleExport = readJson(path.join(contentRoot, 'exports', 'articles.v1.json'));
const rootCategories = new Map();
for (const article of articleExport.articles) {
  if (article.publication?.status !== 'ready') continue;
  const title = article.translation?.title || article.source?.title || article.id;
  const description =
    article.translation?.idea || `${title} algoritmi haqida o‘zbekcha tushuntirish.`;
  const publicPath = String(article.public_path || article.path || '')
    .replace(/\.md$/i, '')
    .replace(/^\/+|\/+$/g, '');
  writePage({
    route: `/algo/${publicPath}`,
    title,
    description,
    type: 'article',
    schema: {
      '@type': 'TechArticle',
      headline: title,
      description,
      dateModified: article.publication?.changed_at,
      about: [article.category_uz || article.category, article.subcategory_uz].filter(Boolean),
      publisher: { '@id': `${siteUrl}/#organization` },
    },
  });
  rootCategories.set(slugify(article.category), article.category_uz || article.category);
}

for (const [slug, name] of rootCategories) {
  writePage({
    route: `/algo/${slug}`,
    title: `${name} algoritmlari`,
    description: `${name} bo‘yicha o‘zbekcha algoritmlar, tushuntirishlar va sport dasturlash darsliklari.`,
    schema: { '@type': 'CollectionPage', name: `${name} algoritmlari` },
  });
}

const seasonNames = new Map();
for (const file of walk(path.join(contentRoot, 'seasons'), 'season.json')) {
  const season = readJson(file);
  if (season.publication_status !== 'published') continue;
  seasonNames.set(season.slug, season.title);
  writePage({
    route: `/seasons/${season.slug}`,
    title: season.title,
    description: season.summary,
    schema: {
      '@type': 'CollectionPage',
      name: season.title,
      description: season.summary,
      temporalCoverage: `${season.start_date}/${season.end_date}`,
    },
  });
}

for (const seasonDirectory of fs.readdirSync(path.join(contentRoot, 'seasons'), {
  withFileTypes: true,
})) {
  if (!seasonDirectory.isDirectory() || seasonDirectory.name === 'schema') continue;
  const eventsDirectory = path.join(contentRoot, 'seasons', seasonDirectory.name, 'events');
  if (!fs.existsSync(eventsDirectory)) continue;
  for (const entry of fs.readdirSync(eventsDirectory, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
    const event = readJson(path.join(eventsDirectory, entry.name));
    if (event.publication_status !== 'published') continue;
    const description = event.summary || event.description || `${event.title} haqida ma’lumot.`;
    writePage({
      route: `/seasons/${seasonDirectory.name}/${event.slug}`,
      title: `${event.short_title || event.title} · ${seasonNames.get(seasonDirectory.name) || seasonDirectory.name}`,
      description,
      schema: {
        '@type': 'Event',
        name: event.title,
        description,
        startDate: event.start_date,
        endDate: event.end_date,
        eventAttendanceMode:
          event.mode === 'online'
            ? 'https://schema.org/OnlineEventAttendanceMode'
            : 'https://schema.org/OfflineEventAttendanceMode',
        location: event.location
          ? { '@type': 'Place', name: event.venue || event.location, address: event.location }
          : undefined,
      },
    });
  }
}

const eventLabels = new Map([
  ['egoi', 'EGOI'],
  ['ioi', 'IOI'],
  ['izho', 'IZhO'],
  ['apio', 'APIO'],
]);
for (const file of walk(path.join(contentRoot, 'problems'), 'problem.json')) {
  const relative = path.relative(path.join(contentRoot, 'problems'), file).split(path.sep);
  const [seasonSlug, eventSlug] = relative;
  const problem = readJson(file);
  if (problem.publication_status !== 'published') continue;
  const title = problem.original_title || problem.title;
  const eventName =
    eventLabels.get(eventSlug.split('-')[0]) ||
    eventSlug
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  const description = `${title} — ${eventName} masalasining o‘zbekcha sharti va yechish havolalari.`;
  writePage({
    route: `/tasks/${seasonSlug}/${eventSlug}/${problem.slug}`,
    title: `${title} · ${eventName}`,
    description,
    schema: {
      '@type': 'LearningResource',
      name: title,
      description,
      learningResourceType: 'Programming problem',
      educationalLevel: problem.difficulty_label,
      about: problem.tags,
    },
  });
}

console.log(
  `SEO prerender: ${articleExport.articles.length} ta maqola, ${rootCategories.size} ta bo‘lim va public katalog sahifalari yaratildi.`
);
