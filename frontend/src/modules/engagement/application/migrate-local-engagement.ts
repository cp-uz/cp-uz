import type { AuthSession } from 'modules/auth/domain';
import type { LearningArticle } from 'modules/learning/domain';

import { learningQueries } from 'modules/learning/application';

import { engagementRepository } from '../data-access';

const BOOKMARKS_KEY = 'cpuz:bookmarks';
const COMPLETED_KEY = 'cpuz:completed';
const NOTE_PREFIX = 'cpuz:note:';
const READING_PROGRESS_PREFIX = 'cpuz:reading-progress:';

function readLocalList(key: string) {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
}

function sourceSlugFor(value: string, articles: LearningArticle[]) {
  const article = articles.find(
    (candidate) => candidate.sourceId === value || candidate.slug === value
  );
  return article?.sourceId ?? article?.slug ?? '';
}

export async function migrateLocalEngagement(session: AuthSession) {
  if (!session.user.isGuest) return;
  const marker = `cpuz:engagement-migrated:${session.user.id}`;
  if (localStorage.getItem(marker)) return;
  const articles = await learningQueries.listArticles();
  const localBookmarks = readLocalList(BOOKMARKS_KEY)
    .map((value) => sourceSlugFor(value, articles))
    .filter(Boolean);
  const localCompleted = readLocalList(COMPLETED_KEY)
    .map((value) => sourceSlugFor(value, articles))
    .filter(Boolean);
  const localProgress = new Map<string, number>();
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key?.startsWith(READING_PROGRESS_PREFIX)) continue;
    const slug = sourceSlugFor(key.slice(READING_PROGRESS_PREFIX.length), articles);
    const percent = Number(localStorage.getItem(key));
    if (slug && Number.isFinite(percent) && percent > 0) {
      localProgress.set(slug, Math.min(100, Math.max(0, Math.floor(percent))));
    }
  }
  localCompleted.forEach((slug) => localProgress.set(slug, 100));
  const [serverBookmarks, serverProgress, serverNotes] = await Promise.all([
    engagementRepository.listBookmarks(),
    engagementRepository.listProgress(),
    engagementRepository.listNotes(),
  ]);
  const bookmarked = new Set(serverBookmarks.map((item) => item.articleSlug));
  for (const slug of localBookmarks)
    if (!bookmarked.has(slug)) {
      await engagementRepository.addBookmark(slug);
      bookmarked.add(slug);
    }
  const progressed = new Map(serverProgress.map((item) => [item.articleSlug, item.percent]));
  for (const [slug, percent] of localProgress) {
    if ((progressed.get(slug) ?? 0) >= percent) continue;
    await engagementRepository.setProgress(slug, percent);
    progressed.set(slug, percent);
  }
  const noted = new Set(serverNotes.map((item) => item.articleSlug));
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key?.startsWith(NOTE_PREFIX)) continue;
    const body = localStorage.getItem(key)?.trim();
    const slug = sourceSlugFor(key.slice(NOTE_PREFIX.length), articles);
    if (body && slug && !noted.has(slug)) {
      await engagementRepository.saveNote(slug, body);
      noted.add(slug);
    }
  }
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...bookmarked]));
  localStorage.setItem(
    COMPLETED_KEY,
    JSON.stringify([...progressed].filter(([, percent]) => percent >= 100).map(([slug]) => slug))
  );
  localStorage.setItem(marker, new Date().toISOString());
}
