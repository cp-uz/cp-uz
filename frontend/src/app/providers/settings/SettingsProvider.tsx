import type { SettingsState, SettingsProviderProps } from './settings.types';

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
    const stored = JSON.parse(
      localStorage.getItem(storageKey) ?? 'null'
    ) as Partial<SettingsState> | null;
    if (!stored || stored.version !== defaults.version) return defaults;
    const next = { ...defaults, ...stored };
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
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);

  useEffect(() => {
    document.documentElement.style.setProperty('--boot-font-size', `${state.fontSize}px`);
  }, [state.fontSize]);

  useEffect(() => {
    void optionalFontLoaders[state.fontFamily]?.();
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
