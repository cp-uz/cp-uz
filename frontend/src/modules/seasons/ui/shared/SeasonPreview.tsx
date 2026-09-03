import type { SeasonEvent, SeasonRoute } from '../../domain';

import { UiIcon } from 'shared/ui/UiIcon';
import { appRoutes } from 'shared/config';
import { useAsyncData } from 'shared/hooks';
import { Link as RouterLink } from 'react-router';
import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

import { seasonQueries } from '../../application';
import { SeasonSelector } from './SeasonSelector';
import { SeasonRouteMark, seasonEventLogoUrl } from './SeasonRouteMark';
import {
  isFinalSeasonEvent,
  sortedSeasonEvents,
  formatSeasonNodeDate,
  findCurrentSeasonEvent,
  seasonEventPresentation,
  SEASON_ROUTE_PRESENTATION,
} from '../../domain';

type PreviewState = 'completed' | 'live' | 'next' | 'upcoming';

type PreviewItem = {
  event: SeasonEvent;
  state: PreviewState;
  badge?: string;
};

function eventMembership(event: SeasonEvent, route: SeasonRoute) {
  return event.routeMemberships.find((membership) => membership.routeCode === route.code);
}

function todayKey() {
  const today = new Date();
  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');
}

function PreviewNodeMark({
  event,
  route,
  seasonSlug,
  state,
  size,
}: {
  event: SeasonEvent;
  route: SeasonRoute;
  seasonSlug: string;
  state: PreviewState;
  size: number;
}) {
  const membership = eventMembership(event, route);
  const finalNode = isFinalSeasonEvent(event);
  const trainingNode = membership?.nodeStyle === 'training' || event.type === 'training';
  const selectionNode = event.type === 'selection';
  const unofficialNode = event.type === 'unofficial';
  const presentation = seasonEventPresentation(event, route);
  const eventLogoUrl = seasonEventLogoUrl(event.code, seasonSlug);
  const routeIcon =
    !finalNode && !trainingNode && !unofficialNode && route.icon?.includes(':')
      ? route.icon
      : presentation.icon;
  const highlighted = state === 'live' || state === 'next';

  return (
    <Box
      sx={{
        width: size + 12,
        height: size + 12,
        display: 'grid',
        position: 'relative',
        placeItems: 'center',
        flexShrink: 0,
        zIndex: 1,
      }}
    >
      <Box
        sx={(theme) => ({
          width: size,
          height: size,
          display: 'grid',
          placeItems: 'center',
          position: 'relative',
          color: presentation.color,
          bgcolor: theme.vars.palette.background.paper,
          backgroundImage:
            state === 'completed'
              ? `linear-gradient(${alpha(presentation.color, 0.12)}, ${alpha(
                  presentation.color,
                  0.12
                )})`
              : 'none',
          border: `2px solid ${presentation.color}`,
          borderRadius: trainingNode ? 0.75 : finalNode ? 1 : selectionNode ? 1.5 : '50%',
          clipPath: unofficialNode
            ? 'polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%)'
            : 'none',
          transform: finalNode ? 'rotate(45deg)' : 'none',
          boxShadow: highlighted ? `0 0 0 5px ${alpha(presentation.color, 0.14)}` : 'none',
          transition: theme.transitions.create(['background-color', 'box-shadow']),
          ...theme.applyStyles('dark', {
            color: presentation.darkColor,
            borderColor: presentation.darkColor,
            bgcolor: theme.vars.palette.background.paper,
            backgroundImage:
              state === 'completed'
                ? `linear-gradient(${alpha(presentation.darkColor, 0.17)}, ${alpha(
                    presentation.darkColor,
                    0.17
                  )})`
                : 'none',
            boxShadow: highlighted ? `0 0 0 5px ${alpha(presentation.darkColor, 0.2)}` : 'none',
          }),
        })}
      >
        <Box sx={{ display: 'flex', transform: finalNode ? 'rotate(-45deg)' : 'none' }}>
          {eventLogoUrl ? (
            <SeasonRouteMark
              route={route}
              logoUrl={eventLogoUrl}
              fallbackIcon={presentation.icon}
              size={size >= 42 ? 18 : 16}
            />
          ) : (
            <UiIcon icon={routeIcon} width={size >= 42 ? 20 : 18} />
          )}
        </Box>
      </Box>

      {state === 'completed' && (
        <Box
          sx={(theme) => ({
            right: 0,
            bottom: 0,
            width: 17,
            height: 17,
            display: 'grid',
            placeItems: 'center',
            position: 'absolute',
            color: 'common.white',
            bgcolor: presentation.color,
            borderRadius: '50%',
            boxShadow: `0 0 0 2px ${theme.vars.palette.background.neutral}`,
            ...theme.applyStyles('dark', { bgcolor: presentation.darkColor }),
          })}
        >
          <UiIcon icon="solar:check-read-linear" width={11} />
        </Box>
      )}
    </Box>
  );
}

function PreviewEventLink({
  item,
  route,
  seasonSlug,
  mobile = false,
}: {
  item: PreviewItem;
  route: SeasonRoute;
  seasonSlug: string;
  mobile?: boolean;
}) {
  const { event, state, badge } = item;
  const presentation = seasonEventPresentation(event, route);
  const compactDate = formatSeasonNodeDate(event);
  const stateLabel =
    state === 'completed'
      ? 'Yakunlangan'
      : state === 'live'
        ? 'Hozir davom etmoqda'
        : state === 'next'
          ? 'Keyingi bosqich'
          : 'Kutilmoqda';

  if (mobile) {
    return (
      <ButtonBase
        component={RouterLink}
        to={appRoutes.seasonEvent(seasonSlug, event.slug)}
        preventScrollReset
        aria-label={`${event.title}. ${compactDate}. ${stateLabel}`}
        sx={(theme) => ({
          gap: 1.25,
          width: '100%',
          minHeight: 72,
          p: 1.25,
          display: 'grid',
          textAlign: 'left',
          border: '1px solid',
          borderColor: state === 'live' || state === 'next' ? presentation.color : 'divider',
          borderRadius: 1.5,
          gridTemplateColumns: '52px minmax(0, 1fr) auto',
          bgcolor: 'background.paper',
          transition: theme.transitions.create(['background-color', 'border-color']),
          '&:hover': { bgcolor: alpha(presentation.color, 0.06) },
          '&:focus-visible': {
            outline: `3px solid ${alpha(presentation.color, 0.3)}`,
            outlineOffset: 2,
          },
          ...theme.applyStyles('dark', {
            borderColor: state === 'live' || state === 'next' ? presentation.darkColor : 'divider',
            '&:hover': { bgcolor: alpha(presentation.darkColor, 0.1) },
          }),
        })}
      >
        <PreviewNodeMark
          event={event}
          route={route}
          seasonSlug={seasonSlug}
          state={state}
          size={state === 'live' || state === 'next' ? 38 : 34}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            sx={(theme) => ({
              fontWeight: state === 'live' || state === 'next' ? 700 : 600,
              color: state === 'live' || state === 'next' ? presentation.color : 'text.primary',
              ...theme.mixins.maxLine({ line: 2 }),
              ...theme.applyStyles('dark', {
                color:
                  state === 'live' || state === 'next'
                    ? presentation.darkColor
                    : theme.vars.palette.text.primary,
              }),
            })}
          >
            {event.shortTitle}
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.25 }}>
            <UiIcon icon="solar:calendar-minimalistic-linear" width={14} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {compactDate}
            </Typography>
          </Stack>
        </Box>
        {state !== 'next' && (
          <Typography
            variant="caption"
            sx={(theme) => ({
              px: 0.75,
              py: 0.25,
              color:
                state === 'completed'
                  ? 'success.dark'
                  : state === 'live'
                    ? presentation.color
                    : 'text.secondary',
              bgcolor:
                state === 'completed'
                  ? alpha(theme.palette.success.main, 0.1)
                  : alpha(presentation.color, 0.08),
              borderRadius: 5,
              whiteSpace: 'nowrap',
              ...theme.applyStyles('dark', {
                color:
                  state === 'completed'
                    ? theme.vars.palette.success.light
                    : state === 'live'
                      ? presentation.darkColor
                      : theme.vars.palette.text.secondary,
              }),
            })}
          >
            {badge || stateLabel}
          </Typography>
        )}
      </ButtonBase>
    );
  }

  return (
    <ButtonBase
      component={RouterLink}
      to={appRoutes.seasonEvent(seasonSlug, event.slug)}
      preventScrollReset
      aria-label={`${event.title}. ${compactDate}. ${stateLabel}`}
      sx={(theme) => ({
        mx: 0.5,
        px: 0.75,
        py: 0.5,
        width: 'calc(100% - 8px)',
        minWidth: 0,
        minHeight: 128,
        display: 'flex',
        position: 'relative',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        borderRadius: 1.5,
        transition: theme.transitions.create('background-color'),
        '&:hover': { bgcolor: alpha(presentation.color, 0.06) },
        '&:focus-visible': {
          outline: `3px solid ${alpha(presentation.color, 0.3)}`,
          outlineOffset: 2,
        },
        ...theme.applyStyles('dark', {
          '&:hover': { bgcolor: alpha(presentation.darkColor, 0.1) },
        }),
      })}
    >
      <Box sx={{ height: 54, display: 'grid', placeItems: 'center' }}>
        <PreviewNodeMark
          event={event}
          route={route}
          seasonSlug={seasonSlug}
          state={state}
          size={state === 'live' || state === 'next' ? 42 : isFinalSeasonEvent(event) ? 40 : 36}
        />
      </Box>
      <Typography
        variant="subtitle2"
        sx={(theme) => ({
          mt: 0.5,
          px: 0.5,
          lineHeight: 1.25,
          fontWeight: state === 'live' || state === 'next' ? 700 : 600,
          color: state === 'live' || state === 'next' ? presentation.color : 'text.primary',
          ...theme.mixins.maxLine({ line: 2 }),
          ...theme.applyStyles('dark', {
            color:
              state === 'live' || state === 'next'
                ? presentation.darkColor
                : theme.vars.palette.text.primary,
          }),
        })}
      >
        {event.shortTitle}
      </Typography>
      <Typography variant="caption" sx={{ mt: 0.25, color: 'text.secondary' }}>
        {compactDate}
      </Typography>
      {badge && (
        <Typography
          variant="caption"
          sx={(theme) => ({
            mt: 0.5,
            px: 0.75,
            py: 0.125,
            lineHeight: 1.5,
            color: presentation.color,
            bgcolor: alpha(presentation.color, 0.09),
            borderRadius: 5,
            ...theme.applyStyles('dark', {
              color: presentation.darkColor,
              bgcolor: alpha(presentation.darkColor, 0.13),
            }),
          })}
        >
          {badge}
        </Typography>
      )}
    </ButtonBase>
  );
}

export function SeasonPreview() {
  const [selectedSlug, setSelectedSlug] = useState('');
  const {
    data: seasons,
    loading: seasonsLoading,
    error: seasonsError,
  } = useAsyncData(seasonQueries.list, [], []);
  const {
    data: fetchedSeason,
    loading: seasonLoading,
    error: seasonError,
  } = useAsyncData(
    () => (selectedSlug ? seasonQueries.get(selectedSlug) : Promise.resolve(null)),
    null,
    [selectedSlug]
  );
  const season = fetchedSeason?.slug === selectedSlug ? fetchedSeason : null;
  const loading = seasonsLoading || seasonLoading || Boolean(selectedSlug && !season);
  const error = seasonsError || seasonError;

  useEffect(() => {
    if (selectedSlug || seasons.length === 0) return;
    const selected = seasons.find((item) => item.featured) ?? seasons[0];
    setSelectedSlug(selected?.slug || '');
  }, [seasons, selectedSlug]);

  const primaryRoute = useMemo(() => {
    if (!season) return undefined;
    return (
      season.routes.find((route) => route.code.toLocaleLowerCase('en') === 'main') ??
      season.routes.find((route) => route.kind === 'official') ??
      season.routes.find((route) => route.kind === 'selection')
    );
  }, [season]);

  const routeEvents = useMemo(() => {
    if (!season || !primaryRoute) return [];
    const candidates = sortedSeasonEvents(season).filter(
      (event) =>
        event.type !== 'unofficial' &&
        event.type !== 'training' &&
        Boolean(eventMembership(event, primaryRoute))
    );
    const finalOrder = Math.max(
      ...candidates.map((event) => eventMembership(event, primaryRoute)?.order ?? 0)
    );

    // International events can branch from the main route (for example IZhO).
    // The landing preview keeps only the actual endpoint of the selected route.
    return candidates.filter(
      (event) =>
        event.type !== 'international' || eventMembership(event, primaryRoute)?.order === finalOrder
    );
  }, [primaryRoute, season]);

  const focusEvent = useMemo(() => {
    if (!season || routeEvents.length === 0) return undefined;
    return findCurrentSeasonEvent({ ...season, events: routeEvents });
  }, [routeEvents, season]);

  const previewEvents = useMemo(() => {
    const focusIndex = focusEvent
      ? routeEvents.findIndex((event) => event.id === focusEvent.id)
      : -1;
    const start =
      focusIndex >= 0 ? Math.max(0, Math.min(focusIndex - 1, routeEvents.length - 5)) : 0;
    return routeEvents.slice(start, start + 5);
  }, [focusEvent, routeEvents]);

  const seasonFinished = Boolean(season?.endsOn && todayKey() > season.endsOn);
  const previewItems = useMemo<PreviewItem[]>(
    () =>
      previewEvents.map((event) => {
        if (event.status === 'live') return { event, state: 'live', badge: 'Hozir' };
        if (event.status === 'completed') return { event, state: 'completed' };
        if (focusEvent?.id === event.id) return { event, state: 'next' };
        return { event, state: 'upcoming' };
      }),
    [focusEvent, previewEvents]
  );
  const mobileItems = useMemo(() => {
    const focusIndex = previewItems.findIndex((item) => item.event.id === focusEvent?.id);
    const start =
      focusIndex >= 0 ? Math.max(0, Math.min(focusIndex - 1, previewItems.length - 3)) : 0;
    return previewItems.slice(start, start + 3);
  }, [focusEvent, previewItems]);
  const completedCount = routeEvents.filter((event) => event.status === 'completed').length;
  const reachedPreviewIndex = previewItems.reduce(
    (lastIndex, item, index) =>
      item.state === 'completed' || item.state === 'live' ? index : lastIndex,
    -1
  );
  const routePresentation = primaryRoute
    ? SEASON_ROUTE_PRESENTATION[primaryRoute.color]
    : SEASON_ROUTE_PRESENTATION.neutral;
  const focusSummary = seasonFinished
    ? 'Mavsum yakunlangan'
    : focusEvent?.status === 'live'
      ? `${focusEvent.shortTitle} davom etmoqda`
      : null;

  if (error) return null;

  return (
    <Box
      component="section"
      aria-labelledby="season-preview-title"
      sx={{ py: { xs: 6, md: 7.5 }, borderTop: '1px solid', borderColor: 'divider' }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ md: 'flex-end' }}
          justifyContent="space-between"
        >
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'primary.main' }}>
              <UiIcon icon="solar:calendar-mark-linear" width={19} />
              <Typography variant="subtitle2">Olimpiada mavsumi</Typography>
            </Stack>
            <Typography id="season-preview-title" component="h2" variant="h3" sx={{ mt: 1 }}>
              {loading ? <Skeleton width={270} /> : season?.title || 'Musobaqalar yo‘li'}
            </Typography>
            <Typography sx={{ mt: 1, maxWidth: 680, color: 'text.secondary' }}>
              {loading ? (
                <Skeleton width="min(520px, 80vw)" />
              ) : (
                season?.summary ||
                'Saralashlardan xalqaro olimpiadalargacha bo‘lgan yo‘l, sanalar va natijalar.'
              )}
            </Typography>
          </Box>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent={{ xs: 'space-between', sm: 'flex-start' }}
          >
            {seasons.length > 0 && (
              <SeasonSelector
                seasons={seasons}
                value={selectedSlug}
                onChange={setSelectedSlug}
                ariaLabel="Bosh sahifadagi olimpiada mavsumini tanlash"
              />
            )}
            {season && (
              <Button
                component={RouterLink}
                to={appRoutes.season(season.slug)}
                endIcon={<UiIcon icon="solar:arrow-right-linear" width={18} />}
                sx={{ whiteSpace: 'nowrap' }}
              >
                To‘liq mavsum
              </Button>
            )}
          </Stack>
        </Stack>

        {loading ? (
          <Box sx={{ mt: 4 }}>
            <Skeleton variant="rounded" height={230} />
          </Box>
        ) : (
          season &&
          primaryRoute && (
            <Box
              sx={{
                mt: 4,
                mx: { xs: -2, md: 0 },
                px: { xs: 2, md: 3 },
                py: { xs: 2.25, md: 2.5 },
                bgcolor: 'background.neutral',
                borderRadius: { xs: 0, md: 1.5 },
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                alignItems={{ sm: 'center' }}
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <UiIcon
                    icon="solar:route-linear"
                    width={18}
                    style={{ color: routePresentation.color }}
                  />
                  <Box>
                    <Typography variant="subtitle2">{primaryRoute.title}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {completedCount}/{routeEvents.length} bosqich yakunlangan
                    </Typography>
                  </Box>
                </Stack>
                {focusSummary && (
                  <Typography
                    variant="caption"
                    sx={(theme) => ({
                      alignSelf: { xs: 'flex-start', sm: 'center' },
                      px: 1,
                      py: 0.5,
                      color: routePresentation.color,
                      bgcolor: alpha(routePresentation.color, 0.08),
                      borderRadius: 5,
                      fontWeight: 600,
                      ...theme.applyStyles('dark', {
                        color: routePresentation.darkColor,
                        bgcolor: alpha(routePresentation.darkColor, 0.12),
                      }),
                    })}
                  >
                    {focusSummary}
                  </Typography>
                )}
              </Stack>

              <Box sx={{ display: { xs: 'none', md: 'block' }, mt: 2.5, position: 'relative' }}>
                <Box
                  aria-hidden
                  sx={{
                    top: 27,
                    left: `${50 / Math.max(previewItems.length, 1)}%`,
                    right: `${50 / Math.max(previewItems.length, 1)}%`,
                    position: 'absolute',
                    borderTop: '2px dashed',
                    borderColor: 'divider',
                  }}
                />
                {reachedPreviewIndex >= 0 && previewItems.length > 1 && (
                  <Box
                    aria-hidden
                    sx={(theme) => ({
                      top: 27,
                      left: `${50 / previewItems.length}%`,
                      width: `${(reachedPreviewIndex / previewItems.length) * 100}%`,
                      height: 3,
                      position: 'absolute',
                      bgcolor: routePresentation.color,
                      borderRadius: 2,
                      transform: 'translateY(-0.5px)',
                      ...theme.applyStyles('dark', { bgcolor: routePresentation.darkColor }),
                    })}
                  />
                )}
                <Box
                  sx={{
                    display: 'grid',
                    position: 'relative',
                    gridTemplateColumns: `repeat(${Math.max(previewItems.length, 1)}, minmax(0, 1fr))`,
                  }}
                >
                  {previewItems.map((item) => (
                    <PreviewEventLink
                      key={item.event.id}
                      item={item}
                      route={primaryRoute}
                      seasonSlug={season.slug}
                    />
                  ))}
                </Box>
              </Box>

              <Stack spacing={1} sx={{ display: { xs: 'flex', md: 'none' }, mt: 2 }}>
                {mobileItems.map((item) => (
                  <PreviewEventLink
                    key={item.event.id}
                    mobile
                    item={item}
                    route={primaryRoute}
                    seasonSlug={season.slug}
                  />
                ))}
              </Stack>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={0.75}
                alignItems={{ sm: 'center' }}
                justifyContent="center"
                sx={{ mt: { xs: 2, md: 1.5 }, color: 'text.secondary' }}
              >
                <Typography variant="caption">
                  EGOI, KhIMIO, APIO va mustaqil musobaqalar
                </Typography>
              </Stack>
            </Box>
          )
        )}
      </Container>
    </Box>
  );
}
