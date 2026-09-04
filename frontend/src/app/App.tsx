import 'app/styles/global.css';

import { useLocation } from 'react-router';
import { ProgressBar } from 'shared/ui/ProgressBar';
import { useRef, useState, useEffect } from 'react';
import { themeConfig, ThemeProvider } from 'app/theme';
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
        <BootExperienceOverlay />
      </ThemeProvider>
    </SettingsProvider>
  );
}
