import type { ThemeConfig } from 'app/theme/theme-config';
import type { ThemeColorPreset } from 'app/theme/with-settings';

// ----------------------------------------------------------------------

export type SettingsState = {
  version: string;
  fontSize: number;
  fontFamily: string;
  compactLayout: boolean;
  contrast: 'default' | 'high';
  primaryColor: ThemeColorPreset;
  mode: ThemeConfig['defaultMode'];
  navColor: 'integrate' | 'apparent';
  direction: ThemeConfig['direction'];
  navLayout: 'vertical' | 'horizontal' | 'mini';
};

export type SettingsContextValue = {
  state: SettingsState;
  canReset: boolean;
  onReset: () => void;
  setState: (updateValue: Partial<SettingsState>) => void;
  setField: (name: keyof SettingsState, updateValue: SettingsState[keyof SettingsState]) => void;
};

export type SettingsProviderProps = {
  defaultSettings: SettingsState;
  children: React.ReactNode;
  storageKey?: string;
};
