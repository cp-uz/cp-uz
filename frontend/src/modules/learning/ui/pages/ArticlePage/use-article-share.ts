import { useState } from 'react';

export function useArticleShare(title: string) {
  const [shareOpen, setShareOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [shareError, setShareError] = useState('');
  const canNativeShare = typeof navigator.share === 'function';

  const copyShareLink = async () => {
    setShareError('');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
    } catch {
      setShareError('Havolani nusxalab bo‘lmadi. Yuqoridagi manzilni belgilang va nusxalang.');
    }
  };

  const nativeShare = async () => {
    if (!canNativeShare) return false;
    try {
      await navigator.share({ title, url: window.location.href });
      return true;
    } catch (reason) {
      if (reason instanceof DOMException && reason.name === 'AbortError') return true;
      return false;
    }
  };

  const shareArticle = async () => {
    setShareError('');
    if (!(await nativeShare()))
      setShareError('Ulashish oynasi ochilmadi. Havolani nusxalashingiz mumkin.');
  };

  const requestShare = async () => {
    setShareCopied(false);
    setShareError('');
    const prefersNativeShare =
      canNativeShare && (window.innerWidth < 900 || window.matchMedia('(pointer: coarse)').matches);
    if (prefersNativeShare && (await nativeShare())) return;
    setShareOpen(true);
  };

  return {
    shareOpen,
    setShareOpen,
    shareCopied,
    shareError,
    canNativeShare,
    copyShareLink,
    shareArticle,
    requestShare,
  };
}
