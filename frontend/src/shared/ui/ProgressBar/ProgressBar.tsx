import './styles.css';

import NProgress from 'nprogress';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

function isInternalNavigation(anchor: HTMLAnchorElement) {
  const target = anchor.getAttribute('target');
  if (target === '_blank' || anchor.hasAttribute('download')) return false;
  try {
    const destination = new URL(anchor.href, window.location.origin);
    return (
      destination.origin === window.location.origin &&
      `${destination.pathname}${destination.search}` !==
        `${window.location.pathname}${window.location.search}`
    );
  } catch {
    return false;
  }
}

export function ProgressBar() {
  const location = useLocation();

  useEffect(() => {
    NProgress.configure({ showSpinner: false });
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');
      if (anchor && isInternalNavigation(anchor)) NProgress.start();
    };
    const onPopState = () => NProgress.start();
    document.addEventListener('click', onClick);
    window.addEventListener('popstate', onPopState);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', onPopState);
      NProgress.done();
    };
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => NProgress.done(), 100);
    return () => window.clearTimeout(timeout);
  }, [location.pathname, location.search]);

  return null;
}
