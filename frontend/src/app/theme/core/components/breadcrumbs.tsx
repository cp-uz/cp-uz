import type { Theme, Components } from '@mui/material/styles';

// ----------------------------------------------------------------------

const MuiBreadcrumbs: Components<Theme>['MuiBreadcrumbs'] = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      [theme.breakpoints.down('sm')]: { display: 'none' },
    }),
    ol: ({ theme }) => ({
      rowGap: theme.spacing(0.5),
      columnGap: theme.spacing(2),
    }),
    li: ({ theme }) => ({
      display: 'inline-flex',
      '& > *': { ...theme.typography.body2 },
    }),
    separator: { margin: 0 },
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const breadcrumbs: Components<Theme> = {
  MuiBreadcrumbs,
};
