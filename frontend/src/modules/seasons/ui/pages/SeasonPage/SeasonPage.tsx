import type { SeasonEvent } from '../../../domain';

import { useMemo } from 'react';
import { Seo } from 'shared/ui/Seo';
import { UiIcon } from 'shared/ui/UiIcon';
import { appRoutes } from 'shared/config';
import { useAsyncData } from 'shared/hooks';
import { useParams, useNavigate, useLocation, Link as RouterLink } from 'react-router';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { seasonQueries } from '../../../application';
import { seasonEventMonthKey } from '../../../domain';
import { SeasonSelector } from '../../shared/SeasonSelector';
import { SeasonEventDetail } from '../../shared/SeasonEventDetail';
import { SeasonTimeline, SeasonMonthRail, seasonMonthGroups } from '../../shared/SeasonTimeline';

function PageSkeleton() {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      <Skeleton width={150} />
      <Skeleton width="min(520px, 80vw)" height={64} />
      <Skeleton width="min(680px, 90vw)" />
      <Box
        sx={{
          gap: 3,
          mt: 6,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '88px minmax(0, 1fr) 330px' },
        }}
      >
        <Skeleton sx={{ display: { xs: 'none', md: 'block' } }} height={240} />
        <Skeleton variant="rounded" height={620} />
        <Skeleton variant="rounded" sx={{ display: { xs: 'none', md: 'block' } }} height={520} />
      </Box>
    </Container>
  );
}

export default function SeasonPage() {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { hash } = useLocation();
  const { seasonSlug = '', eventSlug } = useParams();
  const {
    data: season,
    loading,
    error,
  } = useAsyncData(
    () => (seasonSlug ? seasonQueries.get(seasonSlug) : seasonQueries.getFeatured()),
    null,
    [seasonSlug]
  );
  const { data: seasons } = useAsyncData(seasonQueries.list, [], []);
  const { data: fetchedEvent, loading: eventLoading } = useAsyncData(
    () => (eventSlug ? seasonQueries.getEvent(seasonSlug, eventSlug) : Promise.resolve(null)),
    null,
    [seasonSlug, eventSlug]
  );

  const graphEvent = useMemo(
    () => season?.events.find((event) => event.slug === eventSlug),
    [eventSlug, season]
  );
  const monthGroups = season ? seasonMonthGroups(season) : [];
  const navigableMonthGroups = monthGroups.filter((group) => group.key !== 'tba');
  const hashMonth = hash.startsWith('#season-month-')
    ? hash.slice('#season-month-'.length)
    : undefined;
  const defaultMonthGroup =
    navigableMonthGroups.find((group) => group.anchorKey === hashMonth) ?? navigableMonthGroups[0];
  const defaultEvent = defaultMonthGroup?.events[0];
  const matchingFetchedEvent = fetchedEvent?.slug === eventSlug ? fetchedEvent : undefined;
  const selectedEvent: SeasonEvent | undefined = eventSlug
    ? (matchingFetchedEvent ?? graphEvent)
    : defaultEvent;
  const invalidEvent = Boolean(eventSlug && !eventLoading && !selectedEvent);
  const selectedRoute = season?.routes.find((route) =>
    selectedEvent?.routeMemberships.some((membership) => membership.routeCode === route.code)
  );
  const selectedMonth = eventSlug
    ? selectedEvent
      ? seasonEventMonthKey(selectedEvent)
      : undefined
    : defaultMonthGroup?.key;

  if (loading) return <PageSkeleton />;

  if (error || !season) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
        <Alert severity="error">
          Bu mavsum ma’lumotlarini yuklab bo‘lmadi. Manzilni yoki server ulanishini tekshiring.
        </Alert>
        <Button component={RouterLink} to="/" sx={{ mt: 2 }}>
          Bosh sahifaga qaytish
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Seo
        title={`${selectedEvent && eventSlug ? `${selectedEvent.title} · ` : ''}${season.title}`}
        description={selectedEvent && eventSlug ? selectedEvent.summary : season.summary}
        path={
          eventSlug ? appRoutes.seasonEvent(season.slug, eventSlug) : appRoutes.season(season.slug)
        }
      />

      <Container maxWidth="xl" sx={{ pt: { xs: 2, md: 4 }, pb: { xs: 4, md: 6 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          justifyContent="space-between"
          alignItems={{ md: 'flex-end' }}
        >
          <Box sx={{ maxWidth: 760 }}>
            <Typography
              component="h1"
              variant="h3"
            >
              {season.title}
            </Typography>
            {season.summary && (
              <Typography sx={{ mt: 1.5, color: 'text.secondary', fontWeight: 400 }}>
                {season.summary}
              </Typography>
            )}
          </Box>

          <SeasonSelector
            label="Mavsum"
            seasons={seasons}
            value={season.slug}
            variant="standard"
            ariaLabel="Olimpiada mavsumini tanlash"
            onChange={(slug) => navigate(appRoutes.season(slug))}
          />
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1.25, sm: 3 }}
          sx={{ mt: 3, color: 'text.secondary' }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <UiIcon icon="solar:graph-up-linear" width={18} />
            <Typography variant="body2">
              {season.eventCount || season.events.length} ta voqea
            </Typography>
          </Stack>
          {season.verificationStatus && (
            <Stack direction="row" spacing={1} alignItems="center">
              <UiIcon
                icon={
                  season.verificationStatus === 'verified'
                    ? 'solar:verified-check-linear'
                    : 'solar:shield-warning-linear'
                }
                width={18}
              />
              <Typography variant="body2">
                {season.verificationStatus === 'verified'
                  ? 'Manbalar tekshirilgan'
                  : season.verificationStatus === 'disputed'
                    ? 'Manbalarda tafovut bor'
                    : season.verificationStatus === 'unverified'
                      ? 'Hali tekshirilmagan'
                      : 'Tekshiruv kutilmoqda'}
              </Typography>
            </Stack>
          )}
        </Stack>

        {invalidEvent && (
          <Alert severity="warning" sx={{ mt: 3 }}>
            Bu mavsumda “{eventSlug}” nomli musobaqa topilmadi. Grafikdagi mavjud tugunlardan birini
            tanlang.
          </Alert>
        )}

        <Divider sx={{ mt: 4, mb: { xs: 3, md: 5 } }} />

        <Box
          sx={{
            gap: { md: 2.5, lg: 3.5 },
            display: 'grid',
            alignItems: 'start',
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr)',
              md: '76px minmax(0, 1fr) minmax(290px, 330px)',
            },
          }}
        >
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <SeasonMonthRail groups={monthGroups} selectedMonth={selectedMonth} />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <SeasonTimeline
              season={season}
              selectedMonth={selectedMonth}
              selectedEventSlug={selectedEvent?.slug}
            />
          </Box>

          <Box
            component="aside"
            aria-label="Tanlangan musobaqa tafsilotlari"
            sx={{
              top: 92,
              p: 2.5,
              maxHeight: 'calc(100vh - 116px)',
              display: { xs: 'none', md: 'block' },
              position: 'sticky',
              overflowY: 'auto',
              bgcolor: 'background.neutral',
              borderRadius: 1.5,
              scrollbarWidth: 'thin',
            }}
          >
            {selectedEvent ? (
              <SeasonEventDetail
                event={selectedEvent}
                route={selectedRoute}
                seasonSlug={season.slug}
                compact
              />
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Batafsil ma’lumot uchun grafikdagi tugunni tanlang.
              </Typography>
            )}
          </Box>
        </Box>
      </Container>

      <Drawer
        anchor="bottom"
        open={mobile && Boolean(eventSlug && selectedEvent)}
        onClose={() => navigate(appRoutes.season(season.slug))}
        slotProps={{
          paper: {
            sx: {
              px: 2.5,
              pt: 1,
              pb: 4,
              maxHeight: '88dvh',
              borderRadius: '16px 16px 0 0',
              backgroundImage: 'none',
            },
          },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Box
            sx={{
              width: 38,
              height: 4,
              ml: 'calc(50% - 19px)',
              bgcolor: 'divider',
              borderRadius: 2,
            }}
          />
          <IconButton
            aria-label="Tafsilotlarni yopish"
            onClick={() => navigate(appRoutes.season(season.slug))}
          >
            <UiIcon icon="solar:close-circle-linear" width={22} />
          </IconButton>
        </Stack>
        {selectedEvent && (
          <SeasonEventDetail event={selectedEvent} route={selectedRoute} seasonSlug={season.slug} />
        )}
      </Drawer>
    </>
  );
}
