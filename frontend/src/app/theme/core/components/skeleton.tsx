import type { Theme, Components } from '@mui/material/styles';

import { varAlpha } from 'shared/lib/theme';

// ----------------------------------------------------------------------

const MuiSkeleton: Components<Theme>['MuiSkeleton'] = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    animation: 'wave',
    variant: 'rounded',
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundColor: varAlpha(theme.vars.palette.grey['400Channel'], 0.12),
    }),
    rounded: ({ theme }) => ({
      borderRadius: Number(theme.shape.borderRadius) * 2,
    }),
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const skeleton: Components<Theme> = {
  MuiSkeleton,
};
