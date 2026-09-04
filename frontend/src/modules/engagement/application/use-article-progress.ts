import type { EngagementStore } from './engagement-store';

import { useState, useEffect, useCallback } from 'react';

import { engagementStore } from './engagement-service';
import { useEngagementState } from './use-local-storage-list';

export function useArticleProgress(
  articleKey: string,
  headings: readonly { id: string }[],
  store: EngagementStore = engagementStore
) {
  const state = useEngagementState(store);
  const [position, setPosition] = useState({ key: articleKey, percent: 0, heading: '' });
  const readingProgress =
    state.progress.find((entry) => entry.articleSlug === articleKey)?.percent ?? 0;
  const setReadingProgress = useCallback(
    (percent: number) => {
      store.setProgress(articleKey, percent, state.owner, state.identity);
    },
    [articleKey, state.owner, state.identity, store]
  );

  useEffect(() => {
    let frame = 0;
    const measure = (save: boolean) => {
      const main = document.getElementById('reader-content');
      if (!main) return;
      const top = main.getBoundingClientRect().top + window.scrollY;
      const available = Math.max(1, main.offsetHeight - window.innerHeight);
      const percent = Math.round(
        Math.max(0, Math.min(100, ((window.scrollY - top) / available) * 100))
      );
      let heading = headings[0]?.id ?? '';
      headings.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element && element.getBoundingClientRect().top <= 160) heading = item.id;
      });
      setPosition((current) =>
        current.key === articleKey && current.percent === percent && current.heading === heading
          ? current
          : { key: articleKey, percent, heading }
      );
      if (save && state.hydrated) {
        const current = store.getSnapshot();
        const previous =
          current.progress.find((entry) => entry.articleSlug === articleKey)?.percent ?? 0;
        const rounded = Math.floor(percent / 5) * 5;
        if (current.identity === state.identity && rounded > previous) setReadingProgress(rounded);
      }
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        measure(true);
      });
    };
    measure(false);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [
    articleKey,
    headings,
    setReadingProgress,
    state.hydrated,
    state.owner,
    state.identity,
    store,
  ]);

  return {
    readingProgress,
    viewportProgress: position.key === articleKey ? position.percent : 0,
    activeSection: position.key === articleKey ? position.heading : '',
    progressReady: state.hydrated,
    isArticleCompleted: readingProgress >= 100,
    setReadingProgress,
  };
}
