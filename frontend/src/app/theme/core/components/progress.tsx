import type { Theme, Components, ComponentsVariants } from '@mui/material/styles';

import { varAlpha } from 'shared/lib/theme';

import { linearProgressClasses } from '@mui/material/LinearProgress';

import { colorKeys } from '../palette';

// ----------------------------------------------------------------------

type LinearProgressVariants = ComponentsVariants<Theme>['MuiLinearProgress'];

const baseColors = ['inherit'] as const;
const allColors = [...baseColors, ...colorKeys.palette] as const;

const LINEAR_OPACITY = { track: 0.24, dashed: 0.48 } as const;

function getColorStyle(theme: Theme, colorKey: (typeof allColors)[number]) {
  if (colorKey === 'inherit') {
    return {
      '&::before': { opacity: LINEAR_OPACITY.track },
      [`& .${linearProgressClasses.bar2}`]: { opacity: 1 },
    };
  }

  return {
    backgroundColor: varAlpha(theme.vars.palette[colorKey].mainChannel, LINEAR_OPACITY.track),
  };
}

function getBufferStyle(theme: Theme, colorKey: (typeof allColors)[number]) {
  const isInherit = colorKey === 'inherit';

  const gradientColor = isInherit ? 'currentColor' : theme.vars.palette[colorKey].mainChannel;
  const backgroundColor = isInherit
    ? 'currentColor'
    : varAlpha(theme.vars.palette[colorKey].mainChannel, LINEAR_OPACITY.track);

  return {
    [`& .${linearProgressClasses.bar2}`]: {
      backgroundColor,
      ...(isInherit && { opacity: LINEAR_OPACITY.track }),
    },
    [`& .${linearProgressClasses.dashed}`]: {
      backgroundImage: `radial-gradient(${varAlpha(gradientColor, LINEAR_OPACITY.dashed)} 0%, ${varAlpha(gradientColor, LINEAR_OPACITY.dashed)} 16%, transparent 42%)`,
    },
  };
}

/* **********************************************************************
 * 🗳️ Variants
 * **********************************************************************/
const colorVariants = [
  ...(allColors.map((colorKey) => ({
    props: (props) => props.color === colorKey && props.variant !== 'buffer',
    style: ({ theme }) => getColorStyle(theme, colorKey),
  })) satisfies LinearProgressVariants),
  ...(allColors.map((colorKey) => ({
    props: (props) => props.color === colorKey && props.variant === 'buffer',
    style: ({ theme }) => getBufferStyle(theme, colorKey),
  })) satisfies LinearProgressVariants),
] satisfies LinearProgressVariants;

/* **********************************************************************
 * 🧩 Components
 * **********************************************************************/
const MuiCircularProgress: Components<Theme>['MuiCircularProgress'] = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    color: 'inherit',
  },
};

const MuiLinearProgress: Components<Theme>['MuiLinearProgress'] = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    color: 'inherit',
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: {
      borderRadius: 16,
      variants: [...colorVariants],
    },
    bar: {
      borderRadius: 'inherit',
    },
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const progress: Components<Theme> = {
  MuiLinearProgress,
  MuiCircularProgress,
};
