import 'app/styles/global.css';
import 'katex/dist/katex.min.css';

import { useLocation } from 'react-router';
import { ProgressBar } from 'shared/ui/ProgressBar';
import { themeConfig, ThemeProvider } from 'app/theme';
import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { defaultSettings, SettingsProvider } from 'app/providers/settings';
import { LoadingScreen, readBootLoadingFactIndex } from 'shared/ui/LoadingScreen';

type AppProps = { children?: React.ReactNode };

function RouteTransitionOverlay() {
  const { pathname } = useLocation();
  const [settledPath, setSettledPath] = useState<string | null>(null);
  const previousPath = useRef(pathname);
  const initialPath = useRef(pathname);
  const [loadingVariant, setLoadingVariant] = useState<'fact' | 'simple'>(() =>
    document.documentElement.dataset.loaderExperience === 'fact' ? 'fact' : 'simple'
  );
  const factIndex = useRef(readBootLoadingFactIndex());

  useLayoutEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    setLoadingVariant('simple');
  }, [pathname]);

  useEffect(() => {
    if (pathname === settledPath) return undefined;
    const isFirstFact = pathname === initialPath.current && loadingVariant === 'fact';
    const minimumVisibleTime = isFirstFact ? 1000 + Math.floor(Math.random() * 1001) : 280;
    const timer = window.setTimeout(() => setSettledPath(pathname), minimumVisibleTime);
    return () => window.clearTimeout(timer);
  }, [loadingVariant, pathname, settledPath]);

  return pathname === settledPath ? null : (
    <LoadingScreen variant={loadingVariant} initialFactIndex={factIndex.current} />
  );
}

export default function App({ children }: AppProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

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
