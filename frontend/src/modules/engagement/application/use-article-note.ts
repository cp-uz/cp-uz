import type { EngagementStore } from './engagement-store';

import { useState } from 'react';

import { engagementStore } from './engagement-service';
import { useEngagementState } from './use-local-storage-list';

export function useArticleNote(articleKey: string, store: EngagementStore = engagementStore) {
  const state = useEngagementState(store);
  const key = `${state.identity}:${articleKey}`;
  const saved = state.notes.find((entry) => entry.articleSlug === articleKey)?.body ?? '';
  const [draft, setDraft] = useState<{ key: string; body: string } | null>(null);
  const [openKey, setOpenKey] = useState('');
  const note = draft?.key === key ? draft.body : saved;

  const saveNote = () => {
    if (store.getSnapshot().identity !== state.identity) return;
    store.saveNote(articleKey, note, state.owner, state.identity);
    setDraft(null);
    setOpenKey('');
  };

  return {
    note,
    setNote: (body: string) => setDraft({ key, body }),
    notesOpen: openKey === key,
    setNotesOpen: (open: boolean) => setOpenKey(open ? key : ''),
    saveNote,
    noteSaving: false,
    noteError: '',
  };
}
