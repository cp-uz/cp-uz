import type { Theme, Components } from '@mui/material/styles';

const MuiContainer: Components<Theme>['MuiContainer'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      [theme.breakpoints.up('lg')]: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
      },
    }),
  },
};

export const container: Components<Theme> = { MuiContainer };
