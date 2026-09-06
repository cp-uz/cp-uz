import 'app/styles/global.css';

import { ProgressBar } from 'shared/ui/ProgressBar';
import { useRef, useState, useEffect } from 'react';
import { matchPath, useLocation } from 'react-router';
import { themeConfig, ThemeProvider } from 'app/theme';
import { appRoutes, appRoutePatterns } from 'shared/config';
import { defaultSettings, SettingsProvider } from 'app/providers/settings';
import { LoadingScreen, readBootLoadingFactIndex } from 'shared/ui/LoadingScreen';

type AppProps = { children?: React.ReactNode };

function BootExperienceOverlay() {
  const [visible, setVisible] = useState(
    () => document.documentElement.dataset.loaderExperience === 'fact'
  );
  const factIndex = useRef(readBootLoadingFactIndex());

  useEffect(() => {
    if (!visible) return undefined;
    const timer = window.setTimeout(() => setVisible(false), 2000);
    return () => window.clearTimeout(timer);
  }, [visible]);

  return visible ? <LoadingScreen variant="fact" initialFactIndex={factIndex.current} /> : null;
}

export default function App({ children }: AppProps) {
  const { pathname } = useLocation();
  const seasonMatch =
    matchPath(appRoutePatterns.seasonEvent, pathname) ??
    matchPath(appRoutePatterns.season, pathname);
  // Event details belong to the same timeline, including when closed or reached via Back.
  const scrollKey = seasonMatch?.params.seasonSlug
    ? appRoutes.season(seasonMatch.params.seasonSlug)
    : pathname;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [scrollKey]);

  return (
    <SettingsProvider defaultSettings={defaultSettings}>
      <ThemeProvider
        modeStorageKey={themeConfig.modeStorageKey}
        defaultMode={themeConfig.defaultMode}
      >
        <ProgressBar />
        {children}
        <BootExperienceOverlay />
      </ThemeProvider>
    </SettingsProvider>
  );
}
