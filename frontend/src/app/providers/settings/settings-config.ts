import type { SettingsState } from './settings.types';

import { APP_CONFIG } from 'app/config';
import { themeConfig } from 'app/theme/theme-config';

// ----------------------------------------------------------------------

export const SETTINGS_STORAGE_KEY: string = 'app-settings';

export const FONT_FAMILY_OPTIONS = [
  { value: 'Public Sans Variable', label: 'Public Sans' },
  { value: 'Inter Variable', label: 'Inter' },
  { value: 'IBM Plex Sans Variable', label: 'IBM Plex Sans' },
  { value: 'Source Sans 3 Variable', label: 'Source Sans 3' },
] as const;

export const defaultSettings: SettingsState = {
  mode: themeConfig.defaultMode,
  direction: themeConfig.direction,
  contrast: 'default',
  navLayout: 'vertical',
  primaryColor: 'default',
  navColor: 'integrate',
  compactLayout: true,
  fontSize: 16,
  fontFamily: themeConfig.fontFamily.primary,
  version: APP_CONFIG.version,
};
