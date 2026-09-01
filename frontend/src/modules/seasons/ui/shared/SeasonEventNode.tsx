import type { SeasonEvent, SeasonRoute } from '../../domain';

import { UiIcon } from 'shared/ui/UiIcon';
import { Link as RouterLink } from 'react-router';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

import { SeasonRouteMark, seasonEventLogoUrl } from './SeasonRouteMark';
import {
  isFinalSeasonEvent,
  EVENT_STATUS_LABELS,
  formatSeasonNodeDate,
  seasonEventPresentation,
} from '../../domain';

type SeasonEventNodeProps = {
  event: SeasonEvent;
  route: SeasonRoute;
  seasonSlug: string;
  selected?: boolean;
  compact?: boolean;
  centerOnPoint?: boolean;
};

export function SeasonEventNode({
  event,
  route,
  seasonSlug,
  selected = false,
  compact = false,
  centerOnPoint = false,
}: SeasonEventNodeProps) {
  const membership = event.routeMemberships.find((item) => item.routeCode === route.code);
  const finalNode = isFinalSeasonEvent(event);
  const trainingNode = membership?.nodeStyle === 'training' || event.type === 'training';
  const selectionNode = event.type === 'selection';
  const unofficialNode = event.type === 'unofficial';
  const presentation = seasonEventPresentation(event, route);
  const eventLogoUrl = seasonEventLogoUrl(event.code, seasonSlug);
  const squareEventLogo = event.code === 'G2';
  const routeIcon =
    !finalNode && !trainingNode && !unofficialNode && route.icon?.includes(':')
      ? route.icon
      : presentation.icon;
  const size = compact ? (finalNode ? 34 : 28) : finalNode ? 46 : trainingNode ? 30 : 38;
  const compactDate = formatSeasonNodeDate(event);

  return (
    <Stack
      alignItems="center"
      sx={{
        minWidth: 0,
        position: 'relative',
        zIndex: 1,
        transform: centerOnPoint ? `translateY(-${size / 2}px)` : 'none',
      }}
    >
      <ButtonBase
        component={RouterLink}
        to={`/seasons/${seasonSlug}/${event.slug}`}
        preventScrollReset
        aria-label={`${event.title}. ${event.dateLabel || EVENT_STATUS_LABELS[event.status]}`}
        aria-current={selected ? 'step' : undefined}
        sx={(theme) => ({
          width: size,
          height: size,
          color: presentation.color,
          bgcolor: theme.vars.palette.background.paper,
          border: `2px solid ${presentation.color}`,
          borderRadius: trainingNode ? 0.75 : finalNode ? 1 : selectionNode ? 1.5 : '50%',
          clipPath: unofficialNode
            ? 'polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%)'
            : 'none',
          transform: finalNode ? 'rotate(45deg)' : 'none',
          boxShadow: selected ? `0 0 0 5px ${alpha(presentation.color, 0.14)}` : 'none',
          transition: theme.transitions.create(['color', 'border-color', 'box-shadow']),
          '&:hover': {
            bgcolor: theme.vars.palette.background.paper,
            boxShadow: `0 0 0 ${selected ? 5 : 4}px ${alpha(presentation.color, 0.14)}`,
            transform: finalNode ? 'rotate(45deg)' : 'none',
          },
          '&:focus-visible': {
            outline: `3px solid ${alpha(presentation.color, 0.35)}`,
            outlineOffset: 3,
          },
          ...theme.applyStyles('dark', {
            color: presentation.darkColor,
            borderColor: presentation.darkColor,
            bgcolor: theme.vars.palette.background.paper,
            boxShadow: selected ? `0 0 0 5px ${alpha(presentation.darkColor, 0.2)}` : 'none',
            '&:hover': {
              bgcolor: theme.vars.palette.background.paper,
              boxShadow: `0 0 0 ${selected ? 5 : 4}px ${alpha(presentation.darkColor, 0.2)}`,
            },
          }),
        })}
      >
        <Box sx={{ display: 'flex', transform: finalNode ? 'rotate(-45deg)' : 'none' }}>
          {eventLogoUrl ? (
            <SeasonRouteMark
              route={route}
              logoUrl={eventLogoUrl}
              fallbackIcon={presentation.icon}
              square={squareEventLogo}
              size={squareEventLogo ? (compact ? 18 : 26) : compact ? 14 : 18}
            />
          ) : (
            <UiIcon icon={routeIcon} width={compact ? 15 : trainingNode ? 15 : 19} />
          )}
        </Box>
      </ButtonBase>

      <Box
        sx={{
          mt: compact ? 0.75 : 1,
          px: 0.5,
          py: 0.25,
          maxWidth: compact ? 112 : 134,
          textAlign: 'center',
          bgcolor: 'background.default',
        }}
      >
        <Typography
          component="span"
          variant={compact ? 'caption' : 'subtitle2'}
          sx={(theme) => ({
            color: selected ? presentation.color : 'text.primary',
            fontWeight: selected ? 600 : 500,
            lineHeight: 1.3,
            ...theme.mixins.maxLine({ line: compact ? 2 : 3 }),
            ...theme.applyStyles('dark', {
              color: selected ? presentation.darkColor : theme.vars.palette.text.primary,
            }),
          })}
        >
          {event.shortTitle}
        </Typography>
        {!compact && (
          <Typography
            variant="caption"
            sx={{ display: 'block', mt: 0.25, color: 'text.secondary' }}
          >
            {compactDate}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
