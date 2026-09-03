import type { Theme, Components } from '@mui/material/styles';

const MuiContainer: Components<Theme>['MuiContainer'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      [theme.breakpoints.up('lg')]: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
      },
    }),
    maxWidthXl: {
      maxWidth: '1440px',
    },
  },
};

export const container: Components<Theme> = { MuiContainer };
