import 'app/styles/global.css';
import 'katex/dist/katex.min.css';

import { useLocation } from 'react-router';
import { ProgressBar } from 'shared/ui/ProgressBar';
import { themeConfig, ThemeProvider } from 'app/theme';
import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { defaultSettings, SettingsProvider } from 'app/providers/settings';
import { LoadingScreen, readBootLoadingFactIndex } from 'shared/ui/LoadingScreen';

type AppProps = { children?: React.ReactNode };

function routeViewKey(pathname: string) {
  const seasonMatch = pathname.match(/^\/seasons\/([^/]+)(?:\/[^/]+)?\/?$/);
  return seasonMatch ? `/seasons/${seasonMatch[1]}` : pathname;
}

function RouteTransitionOverlay() {
  const { pathname } = useLocation();
  const viewKey = routeViewKey(pathname);
  const [settledPath, setSettledPath] = useState<string | null>(null);
  const previousPath = useRef(viewKey);
  const initialPath = useRef(viewKey);
  const [loadingVariant, setLoadingVariant] = useState<'fact' | 'simple'>(() =>
    document.documentElement.dataset.loaderExperience === 'fact' ? 'fact' : 'simple'
  );
  const factIndex = useRef(readBootLoadingFactIndex());

  useLayoutEffect(() => {
    if (previousPath.current === viewKey) return;
    previousPath.current = viewKey;
    setLoadingVariant('simple');
  }, [viewKey]);

  useEffect(() => {
    if (viewKey === settledPath) return undefined;
    const isFirstFact = viewKey === initialPath.current && loadingVariant === 'fact';
    const minimumVisibleTime = isFirstFact ? 1000 + Math.floor(Math.random() * 1001) : 280;
    const timer = window.setTimeout(() => setSettledPath(viewKey), minimumVisibleTime);
    return () => window.clearTimeout(timer);
  }, [loadingVariant, settledPath, viewKey]);

  return viewKey === settledPath ? null : (
    <LoadingScreen variant={loadingVariant} initialFactIndex={factIndex.current} />
  );
}

export default function App({ children }: AppProps) {
  const { pathname } = useLocation();
  const viewKey = routeViewKey(pathname);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [viewKey]);

  return (
    <SettingsProvider defaultSettings={defaultSettings}>
      <ThemeProvider
        modeStorageKey={themeConfig.modeStorageKey}
        defaultMode={themeConfig.defaultMode}
      >
        <ProgressBar />
        {children}
        <RouteTransitionOverlay />
      </ThemeProvider>
    </SettingsProvider>
  );
}
