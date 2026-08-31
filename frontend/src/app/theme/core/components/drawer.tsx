import type { Theme, Components } from '@mui/material/styles';

import { varAlpha } from 'shared/lib/theme';

// ----------------------------------------------------------------------

const MuiDrawer: Components<Theme>['MuiDrawer'] = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    paper: {
      variants: [
        {
          props: (props) => props.variant === 'temporary' && props.anchor === 'left',
          style: ({ theme }) => ({
            backgroundColor: theme.vars.palette.background.paper,
            backgroundImage: 'none',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            boxShadow: `40px 40px 80px -8px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.24)}`,
            ...theme.applyStyles('dark', {
              boxShadow: `40px 40px 80px -8px  ${varAlpha(theme.vars.palette.common.blackChannel, 0.24)}`,
            }),
          }),
        },
        {
          props: (props) => props.variant === 'temporary' && props.anchor === 'right',
          style: ({ theme }) => ({
            backgroundColor: theme.vars.palette.background.paper,
            backgroundImage: 'none',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            boxShadow: `-40px 40px 80px -8px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.24)}`,
            ...theme.applyStyles('dark', {
              boxShadow: `-40px 40px 80px -8px ${varAlpha(theme.vars.palette.common.blackChannel, 0.24)}`,
            }),
          }),
        },
      ],
    },
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const drawer: Components<Theme> = {
  MuiDrawer,
};
