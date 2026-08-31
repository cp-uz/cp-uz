import type { AuthSession } from 'modules/auth/domain';
import type { LearningArticle } from 'modules/learning/domain';

import { learningQueries } from 'modules/learning/application';

import { engagementApi } from './engagement-service';

const BOOKMARKS_KEY = 'cpuz:bookmarks';
const COMPLETED_KEY = 'cpuz:completed';
const NOTE_PREFIX = 'cpuz:note:';

function readLocalList(key: string) {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function sourceSlugFor(value: string, articles: LearningArticle[]) {
  const article = articles.find((candidate) => candidate.sourceId === value || candidate.slug === value);
  return article?.sourceId ?? article?.slug ?? '';
}

export async function migrateLocalEngagement(session: AuthSession) {
  if (!session.user.isGuest) return;
  const marker = `cpuz:engagement-migrated:${session.user.id}`;
  if (localStorage.getItem(marker)) return;
  const articles = await learningQueries.listArticles();
  const localBookmarks = readLocalList(BOOKMARKS_KEY).map((value) => sourceSlugFor(value, articles)).filter(Boolean);
  const localCompleted = readLocalList(COMPLETED_KEY).map((value) => sourceSlugFor(value, articles)).filter(Boolean);
  const [serverBookmarks, serverProgress, serverNotes] = await Promise.all([
    engagementApi.listBookmarks(), engagementApi.listProgress(), engagementApi.listNotes(),
  ]);
  const bookmarked = new Set(serverBookmarks.map((item) => item.articleSlug));
  for (const slug of localBookmarks) if (!bookmarked.has(slug)) {
    await engagementApi.addBookmark(slug); bookmarked.add(slug);
  }
  const progressed = new Set(serverProgress.filter((item) => item.percent >= 100).map((item) => item.articleSlug));
  for (const slug of localCompleted) if (!progressed.has(slug)) {
    await engagementApi.setProgress(slug, 100); progressed.add(slug);
  }
  const noted = new Set(serverNotes.map((item) => item.articleSlug));
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key?.startsWith(NOTE_PREFIX)) continue;
    const body = localStorage.getItem(key)?.trim();
    const slug = sourceSlugFor(key.slice(NOTE_PREFIX.length), articles);
    if (body && slug && !noted.has(slug)) {
      await engagementApi.saveNote(slug, body); noted.add(slug);
    }
  }
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...bookmarked]));
  localStorage.setItem(COMPLETED_KEY, JSON.stringify([...progressed]));
  localStorage.setItem(marker, new Date().toISOString());
}
