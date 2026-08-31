import type { Theme, SxProps } from '@mui/material/styles';

import { Fragment, useEffect } from 'react';
import { BrandLogo } from 'shared/ui/BrandLogo';

import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

const injectedFacts = Reflect.get(window, '__cpuzLoadingFacts');

export const LOADING_FACTS: readonly string[] =
  Array.isArray(injectedFacts) && injectedFacts.length > 0
    ? injectedFacts.filter(
        (value): value is string => typeof value === 'string' && Boolean(value.trim())
      )
    : ['Algoritm murakkabligini kirish hajmiga bog‘lab tahlil qiling.'];

const LOADING_FACT_STORAGE_KEY = 'cpuz:loader-last-fact';

function validFactIndex(value: number) {
  return Number.isInteger(value) && value >= 0 && value < LOADING_FACTS.length;
}

export function readBootLoadingFactIndex() {
  const value = Number(document.documentElement.dataset.loaderFactIndex);
  return validFactIndex(value) ? value : 0;
}

export function pickNextLoadingFactIndex() {
  let previous = readBootLoadingFactIndex();
  try {
    const stored = Number(localStorage.getItem(LOADING_FACT_STORAGE_KEY));
    if (validFactIndex(stored)) previous = stored;
  } catch {
    // Browser privacy settings can disable storage; the in-memory index still avoids repetition.
  }
  const next =
    (previous + 1 + Math.floor(Math.random() * (LOADING_FACTS.length - 1))) % LOADING_FACTS.length;
  document.documentElement.dataset.loaderFactIndex = String(next);
  try {
    localStorage.setItem(LOADING_FACT_STORAGE_KEY, String(next));
  } catch {
    // Loading remains functional without persistence.
  }
  return next;
}

export type LoadingScreenProps = React.ComponentProps<'div'> & {
  portal?: boolean;
  variant?: 'fact' | 'simple';
  initialFactIndex?: number;
  sx?: SxProps<Theme>;
};

export function LoadingScreen({
  portal = true,
  variant = 'fact',
  initialFactIndex,
  sx,
  ...other
}: LoadingScreenProps) {
  const PortalWrapper = portal ? Portal : Fragment;
  const factIndex =
    initialFactIndex !== undefined && validFactIndex(initialFactIndex)
      ? initialFactIndex
      : pickNextLoadingFactIndex();

  useEffect(() => {
    const htmlOverflow = document.documentElement.style.overflow;
    const bodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overflow = bodyOverflow;
    };
  }, []);

  return (
    <PortalWrapper>
      <LoadingContent role="status" aria-live="polite" sx={sx} {...other}>
        {variant === 'fact' ? (
          <>
            <Box className="cp-loading-graph" aria-hidden="true">
              <span className="cp-loading-edge cp-loading-edge--ab" />
              <span className="cp-loading-edge cp-loading-edge--bc" />
              <span className="cp-loading-edge cp-loading-edge--cd" />
              <span className="cp-loading-edge cp-loading-edge--ac" />
              <span className="cp-loading-node cp-loading-node--a" />
              <span className="cp-loading-node cp-loading-node--b" />
              <span className="cp-loading-node cp-loading-node--c" />
              <span className="cp-loading-node cp-loading-node--d" />
            </Box>
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
              Algoritmik fakt
            </Typography>
            <Typography key={factIndex} className="cp-loading-fact" variant="body1">
              {LOADING_FACTS[factIndex]}
            </Typography>
            <Box className="cp-loading-brand">
              <BrandLogo />
            </Box>
          </>
        ) : (
          <CircularProgress size={32} thickness={3.5} aria-hidden="true" />
        )}
        <span className="sr-only">Sahifa yuklanmoqda</span>
      </LoadingContent>
    </PortalWrapper>
  );
}

const LoadingContent = styled('div')(({ theme }) => ({
  position: 'fixed',
  inset: 0,
  zIndex: theme.zIndex.modal + 100,
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(5),
  fontFamily: 'inherit',
  backgroundColor: theme.vars.palette.background.default,
  '.cp-loading-graph': {
    position: 'relative',
    width: 164,
    height: 94,
    marginBottom: theme.spacing(2.5),
    animation: 'cp-loader-float 2s ease-in-out infinite',
  },
  '.cp-loading-edge': {
    position: 'absolute',
    height: 3,
    opacity: 0.24,
    backgroundColor: theme.vars.palette.primary.main,
    transformOrigin: 'left center',
    animation: 'cp-loader-edge-visit 1.6s ease-in-out infinite',
  },
  '.cp-loading-edge--ab': { top: 70, left: 15, width: 64, transform: 'rotate(-39deg)' },
  '.cp-loading-edge--bc': {
    top: 32,
    left: 70,
    width: 56,
    transform: 'rotate(35deg)',
    animationDelay: '240ms',
  },
  '.cp-loading-edge--cd': {
    top: 63,
    left: 116,
    width: 52,
    transform: 'rotate(-48deg)',
    animationDelay: '480ms',
  },
  '.cp-loading-edge--ac': {
    top: 70,
    left: 15,
    width: 108,
    height: 0,
    opacity: 0.18,
    transform: 'rotate(-5deg)',
    background: 'none',
    borderTop: `2px dashed ${theme.vars.palette.primary.main}`,
    animationDelay: '720ms',
  },
  '.cp-loading-node': {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: '50%',
    backgroundColor: theme.vars.palette.background.paper,
    boxShadow: `0 0 0 3px ${theme.vars.palette.primary.main}`,
    animation: 'cp-loader-node-visit 1.6s ease-in-out infinite',
  },
  '.cp-loading-node--a': { left: 8, top: 63 },
  '.cp-loading-node--b': { left: 63, top: 20, animationDelay: '240ms' },
  '.cp-loading-node--c': { left: 109, top: 55, animationDelay: '480ms' },
  '.cp-loading-node--d': { right: 2, top: 12, animationDelay: '720ms' },
  '.cp-loading-fact': {
    width: 'min(460px, 100%)',
    minHeight: 52,
    marginTop: theme.spacing(0.75),
    textAlign: 'center',
  },
  '.cp-loading-brand': {
    position: 'absolute',
    bottom: 'clamp(32px, 7vh, 72px)',
  },
  '@keyframes cp-loader-float': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-4px)' },
  },
  '@keyframes cp-loader-edge-visit': {
    '0%, 18%, 100%': { opacity: 0.2 },
    '34%, 52%': { opacity: 1 },
  },
  '@keyframes cp-loader-node-visit': {
    '0%, 18%, 100%': { opacity: 0.45, transform: 'scale(0.92)' },
    '34%, 52%': { opacity: 1, transform: 'scale(1.12)' },
  },
  '@media (prefers-reduced-motion: reduce)': {
    '.cp-loading-graph, .cp-loading-edge, .cp-loading-node': { animation: 'none' },
  },
}));
