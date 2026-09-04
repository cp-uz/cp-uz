import type { SettingsState, SettingsProviderProps } from './settings.types';

import { safeStorage, readStoredJson } from 'shared/storage';
import { useMemo, useState, useEffect, useCallback } from 'react';

import { SettingsContext } from './settings-context';
import { FONT_FAMILY_OPTIONS, SETTINGS_STORAGE_KEY } from './settings-config';

const optionalFontLoaders: Record<string, () => Promise<unknown>> = {
  'Inter Variable': () => import('@fontsource-variable/inter/index.css'),
  'IBM Plex Sans Variable': () => import('@fontsource-variable/ibm-plex-sans/index.css'),
  'Source Sans 3 Variable': () => import('@fontsource-variable/source-sans-3/index.css'),
};

function readSettings(storageKey: string, defaults: SettingsState) {
  try {
    const stored = readStoredJson(safeStorage, storageKey) as Partial<SettingsState> | null;
    if (!stored || stored.version !== defaults.version) return defaults;
    const next: SettingsState = {
      ...defaults,
      mode: stored.mode === 'light' || stored.mode === 'dark' ? stored.mode : defaults.mode,
      direction:
        stored.direction === 'ltr' || stored.direction === 'rtl'
          ? stored.direction
          : defaults.direction,
      contrast:
        stored.contrast === 'default' || stored.contrast === 'high'
          ? stored.contrast
          : defaults.contrast,
      navLayout:
        stored.navLayout === 'vertical' ||
        stored.navLayout === 'horizontal' ||
        stored.navLayout === 'mini'
          ? stored.navLayout
          : defaults.navLayout,
      navColor:
        stored.navColor === 'integrate' || stored.navColor === 'apparent'
          ? stored.navColor
          : defaults.navColor,
      compactLayout:
        typeof stored.compactLayout === 'boolean' ? stored.compactLayout : defaults.compactLayout,
      primaryColor:
        typeof stored.primaryColor === 'string' &&
        /^(default|preset[1-5])$/.test(stored.primaryColor)
          ? stored.primaryColor
          : defaults.primaryColor,
      fontFamily: typeof stored.fontFamily === 'string' ? stored.fontFamily : defaults.fontFamily,
      fontSize:
        typeof stored.fontSize === 'number' && Number.isFinite(stored.fontSize)
          ? Math.min(22, Math.max(14, stored.fontSize))
          : defaults.fontSize,
    };
    return FONT_FAMILY_OPTIONS.some((option) => option.value === next.fontFamily)
      ? next
      : { ...next, fontFamily: defaults.fontFamily };
  } catch {
    return defaults;
  }
}

export function SettingsProvider({
  children,
  defaultSettings,
  storageKey = SETTINGS_STORAGE_KEY,
}: SettingsProviderProps) {
  const [state, setStateValue] = useState<SettingsState>(() =>
    readSettings(storageKey, defaultSettings)
  );

  useEffect(() => {
    safeStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);

  useEffect(() => {
    document.documentElement.style.setProperty('--boot-font-size', `${state.fontSize}px`);
  }, [state.fontSize]);

  useEffect(() => {
    void optionalFontLoaders[state.fontFamily]?.().catch(() => undefined);
  }, [state.fontFamily]);

  const setState = useCallback((updateValue: Partial<SettingsState>) => {
    setStateValue((current) => ({ ...current, ...updateValue }));
  }, []);

  const setField = useCallback(
    (name: keyof SettingsState, updateValue: SettingsState[keyof SettingsState]) => {
      setStateValue((current) => ({ ...current, [name]: updateValue }));
    },
    []
  );

  const onReset = useCallback(() => setStateValue(defaultSettings), [defaultSettings]);
  const canReset = JSON.stringify(state) !== JSON.stringify(defaultSettings);

  const value = useMemo(
    () => ({ state, canReset, onReset, setState, setField }),
    [canReset, onReset, setField, setState, state]
  );

  return <SettingsContext value={value}>{children}</SettingsContext>;
}
