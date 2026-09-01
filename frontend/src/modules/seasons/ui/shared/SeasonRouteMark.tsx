import type { SeasonRoute } from '../../domain';

import { UiIcon } from 'shared/ui/UiIcon';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';

import { SEASON_ROUTE_PRESENTATION } from '../../domain';

type SeasonRouteMarkProps = {
  route: SeasonRoute;
  logoUrl?: string;
  fallbackIcon?: string;
  size?: number;
};

export function seasonRouteLogoUrl(routeCode: string, seasonSlug: string) {
  const logos: Record<string, string> = {
    main: '/assets/seasons/ioi.png',
    egoi: '/assets/seasons/egoi.png',
    khimio: '/assets/seasons/khimio.png',
  };
  if (routeCode === 'apio' && seasonSlug === '2025-2026') {
    return '/assets/seasons/apio-2026.png';
  }
  return logos[routeCode];
}

export function seasonEventLogoUrl(eventCode: string, seasonSlug: string) {
  const logos: Record<string, string> = {
    G1: '/assets/seasons/ioi.png',
    G2: '/assets/seasons/izho.png',
    G3: '/assets/seasons/egoi.png',
    G4: '/assets/seasons/khimio.png',
    U1: '/assets/seasons/vkoshp.ico',
    U2: '/assets/seasons/info1cup.png',
  };
  if (eventCode === 'G5' && seasonSlug === '2025-2026') {
    return '/assets/seasons/apio-2026.png';
  }
  return logos[eventCode];
}

export function SeasonRouteMark({ route, logoUrl, fallbackIcon, size = 20 }: SeasonRouteMarkProps) {
  const presentation = SEASON_ROUTE_PRESENTATION[route.color];
  const resolvedFallbackIcon =
    fallbackIcon ?? (route.icon?.includes(':') ? route.icon : presentation.icon);
  const resolvedLogoUrl = logoUrl ?? route.logoUrl;
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => setLogoFailed(false), [resolvedLogoUrl]);

  if (resolvedLogoUrl && !logoFailed) {
    return (
      <Box
        sx={{
          p: '2px',
          width: size * 1.7,
          height: size + 4,
          display: 'flex',
          flexShrink: 0,
          borderRadius: 0.5,
          alignItems: 'center',
          bgcolor: 'common.white',
          justifyContent: 'center',
        }}
      >
        <Box
          component="img"
          src={resolvedLogoUrl}
          alt=""
          onError={() => setLogoFailed(true)}
          sx={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
        />
      </Box>
    );
  }

  return <UiIcon icon={resolvedFallbackIcon} width={size} />;
}
