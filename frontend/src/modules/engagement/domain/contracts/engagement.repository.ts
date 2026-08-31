import type { NoteEntry, BookmarkEntry, ProgressEntry } from '../entities';

export interface EngagementRepository {
  listBookmarks(): Promise<BookmarkEntry[]>;
  addBookmark(articleSlug: string): Promise<BookmarkEntry>;
  removeBookmark(id: number | string): Promise<void>;
  listProgress(): Promise<ProgressEntry[]>;
  setProgress(articleSlug: string, percent: number): Promise<ProgressEntry>;
  removeProgress(id: number | string): Promise<void>;
  listNotes(): Promise<NoteEntry[]>;
  saveNote(articleSlug: string, body: string, existingId?: number | string): Promise<NoteEntry>;
  removeNote(id: number | string): Promise<void>;
}
