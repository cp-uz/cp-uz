import type { SeasonEvent, SeasonRoute, SeasonDetail } from '../../domain';

import { useRef, useMemo } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { SeasonEventNode } from './SeasonEventNode';
import { SeasonRouteMark, seasonRouteLogoUrl } from './SeasonRouteMark';
import {
  sortedSeasonEvents,
  seasonEventMonthKey,
  SEASON_ROUTE_PRESENTATION,
  seasonTimelineSlotIndexes,
  shouldDeriveSeasonRouteConnections,
} from '../../domain';

const UZBEK_MONTHS = [
  'Yanvar',
  'Fevral',
  'Mart',
  'Aprel',
  'May',
  'Iyun',
  'Iyul',
  'Avgust',
  'Sentabr',
  'Oktabr',
  'Noyabr',
  'Dekabr',
] as const;

type MonthGroup = {
  key: string;
  anchorKey: string;
  label: string;
  shortLabel: string;
  events: SeasonEvent[];
};

function monthLabel(key: string) {
  if (key === 'tba') return { label: 'Sana kutilmoqda', shortLabel: 'TBA' };
  const [year, rawMonth] = key.split('-');
  const month = UZBEK_MONTHS[Number(rawMonth) - 1];
  return {
    label: month ? `${month}, ${year}` : key,
    shortLabel: month ? month.slice(0, 3) : key,
  };
}

export function seasonMonthGroups(season: SeasonDetail): MonthGroup[] {
  const groups: MonthGroup[] = [];
  const groupByKey = new Map<string, MonthGroup>();
  sortedSeasonEvents(season)
    .filter((event) => event.type !== 'unofficial')
    .forEach((event) => {
      const key = seasonEventMonthKey(event);
      const existing = groupByKey.get(key);
      if (existing) {
        existing.events.push(event);
        return;
      }
      const group = {
        key,
        anchorKey: key,
        events: [event],
        ...monthLabel(key),
      };
      groupByKey.set(key, group);
      groups.push(group);
    });
  return groups;
}

function uniqueMonthGroups(groups: MonthGroup[]) {
  const seen = new Set<string>();
  return groups.filter((group) => {
    if (seen.has(group.key)) return false;
    seen.add(group.key);
    return true;
  });
}

function primaryRoute(event: SeasonEvent, routes: SeasonRoute[]) {
  const membership = [...event.routeMemberships].sort((left, right) => left.order - right.order)[0];
  return routes.find((route) => route.code === membership?.routeCode) ?? routes[0];
}

function graphRoute(event: SeasonEvent, routes: SeasonRoute[], season: SeasonDetail) {
  const directRoute = primaryRoute(event, routes);
  if (event.routeMemberships.some((membership) => membership.routeCode === directRoute?.code)) {
    return directRoute;
  }

  const connectedEventCode = season.relations.find(
    (relation) => relation.fromEventCode === event.code
  )?.toEventCode;
  const connectedEvent = season.events.find((item) => item.code === connectedEventCode);
  if (connectedEvent) return primaryRoute(connectedEvent, routes);
  return routes[0];
}

type SeasonMonthRailProps = {
  groups: MonthGroup[];
  selectedMonth?: string;
};

export function SeasonMonthRail({ groups, selectedMonth }: SeasonMonthRailProps) {
  const navigationGroups = uniqueMonthGroups(groups);
  return (
    <Box
      component="nav"
      aria-label="Mavsum oylari"
      sx={{ position: 'sticky', top: 96, alignSelf: 'start' }}
    >
      <Typography variant="subtitle2">Oylar</Typography>
      <Stack spacing={0.25} sx={{ mt: 1.25 }}>
        {navigationGroups.map((group) => (
          <Link
            key={group.key}
            href={`#season-month-${group.anchorKey}`}
            underline="none"
            color={selectedMonth === group.key ? 'primary.main' : 'text.secondary'}
            sx={{
              py: 0.75,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: 14,
              fontWeight: selectedMonth === group.key ? 600 : 400,
              '&:hover': { color: 'text.primary' },
            }}
          >
            <Box
              sx={{
                width: selectedMonth === group.key ? 14 : 5,
                height: '2px',
                bgcolor: selectedMonth === group.key ? 'primary.main' : 'divider',
                transition: 'width 160ms ease',
              }}
            />
            {group.shortLabel}
          </Link>
        ))}
      </Stack>
    </Box>
  );
}

type SeasonTimelineProps = {
  season: SeasonDetail;
  selectedEventSlug?: string;
};

export function SeasonTimeline({ season, selectedEventSlug }: SeasonTimelineProps) {
  const headerScrollerRef = useRef<HTMLDivElement>(null);
  const bodyScrollerRef = useRef<HTMLDivElement>(null);
  const routes = useMemo(
    () =>
      [...season.routes]
        .filter((route) => ['blue', 'red', 'brown', 'teal'].includes(route.color))
        .filter((route) =>
          season.events.some((event) =>
            event.routeMemberships.some((membership) => membership.routeCode === route.code)
          )
        )
        .sort((a, b) => a.order - b.order),
    [season.events, season.routes]
  );
  const groups = useMemo(() => seasonMonthGroups(season), [season]);
  const navigationGroups = useMemo(() => uniqueMonthGroups(groups), [groups]);
  const events = useMemo(
    () => sortedSeasonEvents(season).filter((event) => event.type !== 'unofficial'),
    [season]
  );
  const unofficialEvents = useMemo(
    () => sortedSeasonEvents(season).filter((event) => event.type === 'unofficial'),
    [season]
  );
  const laneWidth = 134;
  const rowHeight = 142;
  const canvasTop = 62;
  const minGraphWidth = Math.max(routes.length * laneWidth, 560);
  const { slotByEvent, slotCount } = seasonTimelineSlotIndexes(events);
  const canvasHeight = Math.max(slotCount * rowHeight + canvasTop + 36, 360);
  const routeByCode = new Map(season.routes.map((route) => [route.code, route]));
  const pointByCode = new Map(
    events.map((event) => {
      const route = graphRoute(event, routes, season);
      const routeIndex = Math.max(
        0,
        routes.findIndex((item) => item.code === route?.code)
      );
      return [
        event.code,
        {
          x: routeIndex * laneWidth + laneWidth / 2,
          y: canvasTop + (slotByEvent.get(event.id) ?? 0) * rowHeight,
        },
      ];
    })
  );
  const groupPositions = groups.map((group) => ({
    ...group,
    top:
      canvasTop +
      Math.max(
        0,
        Math.min(...group.events.map((event) => slotByEvent.get(event.id) ?? 0)) * rowHeight - 65
      ),
  }));
  const explicitConnectors = season.relations
    .map((relation) => {
      const from = pointByCode.get(relation.fromEventCode);
      const to = pointByCode.get(relation.toEventCode);
      if (!from || !to) return null;
      return {
        key: `relation-${relation.id}`,
        pairKey: `${relation.fromEventCode}->${relation.toEventCode}`,
        from,
        to,
        route: relation.routeCode ? routeByCode.get(relation.routeCode) : undefined,
        lineStyle: relation.lineStyle,
        label: relation.label,
      };
    })
    .filter((connector): connector is NonNullable<typeof connector> => Boolean(connector));
  const explicitPairs = new Set(explicitConnectors.map((connector) => connector.pairKey));
  const derivedConnectors = routes.flatMap((route) => {
    if (!shouldDeriveSeasonRouteConnections(season, route.code)) return [];
    const members = events
      .map((event) => ({
        event,
        membership: event.routeMemberships.find((item) => item.routeCode === route.code),
      }))
      .filter(
        (item): item is { event: SeasonEvent; membership: NonNullable<typeof item.membership> } =>
          Boolean(item.membership)
      )
      .sort((left, right) => left.membership.order - right.membership.order);
    return members.slice(1).flatMap((current, index) => {
      const previous = members[index];
      const pairKey = `${previous.event.code}->${current.event.code}`;
      const from = pointByCode.get(previous.event.code);
      const to = pointByCode.get(current.event.code);
      if (!from || !to || explicitPairs.has(pairKey)) return [];
      return [
        {
          key: `derived-${route.code}-${pairKey}`,
          pairKey,
          from,
          to,
          route,
          lineStyle: route.lineStyle,
          label: undefined,
        },
      ];
    });
  });
  const connectors = [...derivedConnectors, ...explicitConnectors];

  return (
    <Box>
      <Box
        component="nav"
        aria-label="Mavsum oylariga tez o‘tish"
        sx={{
          mx: -2,
          px: 2,
          pb: 1.5,
          gap: 0.5,
          display: { xs: 'flex', md: 'none' },
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {navigationGroups.map((group) => (
          <Link
            key={group.key}
            href={`#season-month-${group.anchorKey}`}
            underline="none"
            color="text.primary"
            sx={{
              px: 1.25,
              py: 0.75,
              flexShrink: 0,
              bgcolor: 'background.neutral',
              borderRadius: 1,
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {group.shortLabel}
          </Link>
        ))}
      </Box>

      <Box
        sx={{
          top: { xs: 64, md: 72 },
          zIndex: 3,
          mx: { xs: -2, md: 0 },
          position: 'sticky',
          bgcolor: 'background.default',
        }}
      >
        <Box
          ref={headerScrollerRef}
          onScroll={(scrollEvent) => {
            if (bodyScrollerRef.current) {
              bodyScrollerRef.current.scrollLeft = scrollEvent.currentTarget.scrollLeft;
            }
          }}
          sx={{
            px: { xs: 2, md: 0 },
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <Box
            sx={(theme) => ({
              display: 'grid',
              minWidth: minGraphWidth,
              bgcolor: 'background.default',
              gridTemplateColumns: `repeat(${routes.length}, minmax(${laneWidth}px, 1fr))`,
              borderBottom: `1px solid ${theme.vars.palette.divider}`,
            })}
          >
            {routes.map((route) => {
              const presentation = SEASON_ROUTE_PRESENTATION[route.color];
              return (
                <Stack
                  key={route.code}
                  direction="row"
                  spacing={0.75}
                  alignItems="center"
                  justifyContent="center"
                  sx={{ px: 1, py: 1.5, minWidth: 0 }}
                >
                  <Box
                    sx={(theme) => ({
                      display: 'flex',
                      color: presentation.color,
                      ...theme.applyStyles('dark', { color: presentation.darkColor }),
                    })}
                  >
                    <SeasonRouteMark
                      route={route}
                      logoUrl={seasonRouteLogoUrl(route.code, season.slug)}
                      size={19}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      minWidth: 0,
                      fontWeight: 600,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {route.title}
                  </Typography>
                </Stack>
              );
            })}
          </Box>
        </Box>
      </Box>

      <Box
        ref={bodyScrollerRef}
        onScroll={(scrollEvent) => {
          if (headerScrollerRef.current) {
            headerScrollerRef.current.scrollLeft = scrollEvent.currentTarget.scrollLeft;
          }
        }}
        sx={{
          mx: { xs: -2, md: 0 },
          px: { xs: 2, md: 0 },
          pb: 1,
          overflowX: 'auto',
          overscrollBehaviorInline: 'contain',
        }}
      >
        <Box sx={{ minWidth: minGraphWidth }}>
          <Box sx={{ height: canvasHeight, position: 'relative' }}>
            {groupPositions.map((group) => (
              <Stack
                component="section"
                id={`season-month-${group.anchorKey}`}
                key={group.anchorKey}
                direction="row"
                spacing={1}
                alignItems="center"
                aria-labelledby={`season-month-heading-${group.anchorKey}`}
                sx={{
                  top: group.top,
                  left: 0,
                  right: 0,
                  zIndex: 1,
                  height: 30,
                  position: 'absolute',
                  scrollMarginTop: 148,
                  pointerEvents: 'none',
                }}
              >
                <Typography
                  id={`season-month-heading-${group.anchorKey}`}
                  variant="caption"
                  sx={{ flexShrink: 0, fontWeight: 600, color: 'text.secondary' }}
                >
                  {group.label}
                </Typography>
                <Box sx={{ height: '1px', flexGrow: 1, bgcolor: 'divider' }} />
              </Stack>
            ))}

            <Box
              component="svg"
              viewBox={`0 0 ${minGraphWidth} ${canvasHeight}`}
              preserveAspectRatio="none"
              aria-hidden
              sx={{
                inset: 0,
                width: '100%',
                height: '100%',
                position: 'absolute',
                overflow: 'visible',
              }}
            >
              <defs>
                {Object.entries(SEASON_ROUTE_PRESENTATION).map(([color, presentation]) => (
                  <marker
                    key={color}
                    id={`season-arrow-${color}`}
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="5"
                    markerHeight="5"
                    orient="auto-start-reverse"
                  >
                    <Box
                      component="path"
                      d="M 0 0 L 10 5 L 0 10 z"
                      sx={(theme) => ({
                        fill: presentation.color,
                        ...theme.applyStyles('dark', { fill: presentation.darkColor }),
                      })}
                    />
                  </marker>
                ))}
              </defs>
              {routes.map((route, index) => {
                const presentation = SEASON_ROUTE_PRESENTATION[route.color];
                return (
                  <Box
                    component="line"
                    key={`guide-${route.code}`}
                    x1={index * laneWidth + laneWidth / 2}
                    y1={canvasTop - 22}
                    x2={index * laneWidth + laneWidth / 2}
                    y2={canvasHeight - 18}
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeDasharray="3 9"
                    opacity="0.18"
                    sx={(theme) => ({
                      color: presentation.color,
                      ...theme.applyStyles('dark', { color: presentation.darkColor }),
                    })}
                  />
                );
              })}
              {connectors.map((connector) => {
                const presentation = connector.route
                  ? SEASON_ROUTE_PRESENTATION[connector.route.color]
                  : undefined;
                const midY = (connector.from.y + connector.to.y) / 2;
                const dashArray =
                  connector.lineStyle === 'dotted'
                    ? '2 7'
                    : connector.lineStyle === 'dashed'
                      ? '8 7'
                      : undefined;
                const connectorPresentation = presentation ?? SEASON_ROUTE_PRESENTATION.neutral;
                const connectorColor = connector.route?.color ?? 'neutral';
                return (
                  <Box
                    component="path"
                    key={connector.key}
                    d={`M ${connector.from.x} ${connector.from.y} C ${connector.from.x} ${midY}, ${connector.to.x} ${midY}, ${connector.to.x} ${connector.to.y}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeDasharray={dashArray}
                    markerEnd={`url(#season-arrow-${connectorColor})`}
                    opacity="0.76"
                    sx={(theme) => ({
                      color: connectorPresentation.color,
                      ...theme.applyStyles('dark', { color: connectorPresentation.darkColor }),
                    })}
                  />
                );
              })}
            </Box>

            {events.map((event) => {
              const route = graphRoute(event, routes, season);
              const point = pointByCode.get(event.code);
              if (!route || !point) return null;
              return (
                <Box
                  key={event.id}
                  sx={{
                    top: point.y,
                    left: `${(point.x / minGraphWidth) * 100}%`,
                    width: laneWidth,
                    zIndex: 2,
                    position: 'absolute',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <SeasonEventNode
                    centerOnPoint
                    event={event}
                    route={route}
                    seasonSlug={season.slug}
                    selected={event.slug === selectedEventSlug}
                  />
                </Box>
              );
            })}
          </Box>

          {unofficialEvents.length > 0 && (
            <Box component="section" aria-labelledby="unofficial-events-heading" sx={{ mt: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography
                  id="unofficial-events-heading"
                  variant="subtitle2"
                  sx={{ flexShrink: 0 }}
                >
                  Muhim mustaqil musobaqalar
                </Typography>
                <Box sx={{ height: '1px', flexGrow: 1, bgcolor: 'divider' }} />
              </Stack>
              <Box sx={{ mt: 3, minWidth: Math.max(unofficialEvents.length * 160, 360) }}>
                <Box sx={{ position: 'relative' }}>
                  <Box
                    aria-hidden
                    sx={{
                      top: 18,
                      left: '10%',
                      right: '10%',
                      height: '2px',
                      position: 'absolute',
                      bgcolor: '#7253B7',
                      opacity: 0.42,
                    }}
                  />
                  <Box
                    sx={{
                      display: 'grid',
                      position: 'relative',
                      gridTemplateColumns: `repeat(${unofficialEvents.length}, minmax(150px, 1fr))`,
                    }}
                  >
                    {unofficialEvents.map((event) => {
                      const route = season.routes.find((item) =>
                        event.routeMemberships.some(
                          (membership) => membership.routeCode === item.code
                        )
                      );
                      return route ? (
                        <SeasonEventNode
                          key={event.id}
                          event={event}
                          route={route}
                          seasonSlug={season.slug}
                          selected={event.slug === selectedEventSlug}
                        />
                      ) : null;
                    })}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      <Stack
        direction="row"
        spacing={2.5}
        useFlexGap
        flexWrap="wrap"
        sx={{ mt: 3, color: 'text.secondary' }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 24, borderTop: '2px solid', borderColor: 'text.secondary' }} />
          <Typography variant="caption">Rasmiy o‘tish</Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 24,
              borderTop: '2px dashed',
              borderColor: 'text.secondary',
            }}
          />
          <Typography variant="caption">Aloqador yoki taklif orqali</Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 10, height: 10, border: '2px solid', borderColor: 'text.secondary' }} />
          <Typography variant="caption">Tayyorgarlik</Typography>
        </Stack>
      </Stack>

      <Box
        component="section"
        aria-labelledby="season-connections-heading"
        sx={{
          width: '1px',
          height: '1px',
          p: 0,
          m: -1,
          position: 'absolute',
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        <Typography id="season-connections-heading" component="h2">
          Bosqichlar orasidagi bog‘lanishlar
        </Typography>
        <Box component="ol">
          {connectors.map((connector) => {
            const [fromCode, toCode] = connector.pairKey.split('->');
            const fromTitle =
              season.events.find((event) => event.code === fromCode)?.title ?? fromCode;
            const toTitle = season.events.find((event) => event.code === toCode)?.title ?? toCode;
            return (
              <li key={`accessible-${connector.key}`}>
                {fromTitle} dan {toTitle} ga.
                {connector.label ? ` ${connector.label}.` : ''}
              </li>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
