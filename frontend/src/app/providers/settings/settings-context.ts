import type { SettingsContextValue } from './settings.types';

import { createContext } from 'react';

// ----------------------------------------------------------------------

export const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);
