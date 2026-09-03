import type { SettingsState } from 'app/providers/settings';
import type { Theme, Components } from '@mui/material/styles';

import { cardClasses } from '@mui/material/Card';

// ----------------------------------------------------------------------

export function applySettingsToComponents(settingsState?: SettingsState): {
  components: Components<Theme>;
} {
  const fontSize = settingsState?.fontSize ?? 16;

  const MuiCssBaseline: Components<Theme>['MuiCssBaseline'] = {
    styleOverrides: (theme) => ({
      html: {
        '--boot-font-size': `${fontSize}px`,
        fontSize,
      },
      body: {
        [`& .${cardClasses.root}`]: {
          ...(settingsState?.contrast === 'high' && {
            '--card-shadow': theme.vars.customShadows.z1,
          }),
        },
      },
    }),
  };

  return {
    components: {
      MuiCssBaseline,
    },
  };
}
