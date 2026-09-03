import type { SeasonParticipant } from '../../domain';

import { UiIcon } from 'shared/ui/UiIcon';
import { appRoutes } from 'shared/config';
import { useAsyncData } from 'shared/hooks';
import { Link as RouterLink } from 'react-router';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { formatSeasonLabel } from '../../domain';
import { seasonQueries } from '../../application';
import { SeasonAwardIcon } from './SeasonAwardIcon';

type SeasonParticipantDialogProps = {
  open: boolean;
  seasonSlug: string;
  participantSlug: string;
  onClose: () => void;
};

const PLATFORM_ASSETS: Record<string, { label: string; src: string }> = {
  codeforces: { label: 'Codeforces', src: '/assets/platforms/codeforces.png' },
  atcoder: { label: 'AtCoder', src: '/assets/platforms/atcoder.png' },
  kepuz: { label: 'KEP.uz', src: '/assets/platforms/kepuz.svg' },
  robocontest: { label: 'Robocontest', src: '/assets/platforms/robocontest.png' },
};

const COUNTRY_FLAGS: Record<string, { label: string; src: string }> = {
  UZB: { label: 'O‘zbekiston', src: '/assets/countries/uz.svg' },
};

const PARTICIPANT_AVATAR_FALLBACK = '/assets/seasons/participants/participant-avatar.svg';

function ParticipantSkeleton() {
  return (
    <Stack spacing={2} sx={{ py: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Skeleton variant="circular" width={72} height={72} />
        <Box sx={{ flex: 1 }}>
          <Skeleton width="60%" height={34} />
          <Skeleton width="42%" />
        </Box>
      </Stack>
      <Skeleton variant="rounded" height={86} />
      <Skeleton variant="rounded" height={180} />
    </Stack>
  );
}

function ParticipantContent({
  participant,
  seasonSlug,
}: {
  participant: SeasonParticipant;
  seasonSlug: string;
}) {
  const secondary = [participant.school, participant.region].filter(Boolean).join(' · ');
  const platformAccounts = participant.platformAccounts.filter(
    (account) => PLATFORM_ASSETS[account.platform]
  );
  const country = participant.countryCode ? COUNTRY_FLAGS[participant.countryCode] : undefined;

  return (
    <>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.25} alignItems={{ sm: 'center' }}>
        <Avatar
          src={participant.photoUrl || PARTICIPANT_AVATAR_FALLBACK}
          alt={participant.fullName}
          sx={{ width: 88, height: 88, bgcolor: 'background.neutral' }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography component="h2" variant="h4">
            {participant.fullName}
          </Typography>
          {secondary && (
            <Typography sx={{ mt: 0.5, color: 'text.secondary' }}>{secondary}</Typography>
          )}
          {country && (
            <Tooltip title={country.label} arrow>
              <Box
                component="img"
                src={country.src}
                alt={country.label}
                sx={{ mt: 1.25, width: 28, height: 18, display: 'block', borderRadius: 0.5 }}
              />
            </Tooltip>
          )}
        </Box>
      </Stack>

      {participant.bio && (
        <Typography sx={{ mt: 2.5, color: 'text.secondary', whiteSpace: 'pre-line' }}>
          {participant.bio}
        </Typography>
      )}

      {platformAccounts.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2">Platformalar</Typography>
          <Box
            sx={{
              mt: 1,
              gap: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            }}
          >
            {platformAccounts.map((account) => {
              const platform = PLATFORM_ASSETS[account.platform];
              return (
                <Link
                  key={account.id}
                  href={account.url}
                  target="_blank"
                  rel="noreferrer"
                  underline="none"
                  aria-label={`${platform.label}: ${account.handle}`}
                  sx={{
                    p: 1,
                    gap: 0.75,
                    minWidth: 0,
                    minHeight: 56,
                    display: 'grid',
                    alignItems: 'center',
                    color: 'text.primary',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1.5,
                    bgcolor: 'background.paper',
                    gridTemplateColumns: '28px minmax(0, 1fr) 14px',
                    transition: (theme) =>
                      theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'action.hover',
                      boxShadow: (theme) => `0 0 0 1px ${theme.palette.primary.main}`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      display: 'grid',
                      borderRadius: 1,
                      placeItems: 'center',
                      bgcolor: 'background.neutral',
                    }}
                  >
                    <Box
                      component="img"
                      src={platform.src}
                      alt=""
                      sx={{ width: 20, height: 20, objectFit: 'contain' }}
                    />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      noWrap
                      sx={{ display: 'block', color: 'text.secondary' }}
                    >
                      {platform.label}
                    </Typography>
                    <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                      @{account.handle}
                    </Typography>
                  </Box>
                  {account.verified ? (
                    <Tooltip title="Tasdiqlangan akkaunt" arrow>
                      <UiIcon icon="solar:verified-check-bold" width={12} color="primary.main" />
                    </Tooltip>
                  ) : (
                    <Box aria-hidden sx={{ width: 12 }} />
                  )}
                </Link>
              );
            })}
          </Box>
        </Box>
      )}

      <Divider sx={{ my: 3 }} />
      <Typography variant="subtitle2">
        {formatSeasonLabel(seasonSlug)} mavsumidagi natijalar
      </Typography>
      {participant.results.length > 0 ? (
        <Stack divider={<Divider flexItem />} sx={{ mt: 1 }}>
          {participant.results.map((result) => (
            <Box
              key={result.id}
              component={RouterLink}
              to={appRoutes.seasonEvent(seasonSlug, result.eventSlug)}
              onClick={(event) => event.stopPropagation()}
              sx={{
                py: 1.5,
                gap: { xs: 1, sm: 1.5 },
                display: 'grid',
                alignItems: 'center',
                color: 'text.primary',
                textDecoration: 'none',
                gridTemplateColumns: {
                  xs: 'minmax(0, 1fr) 58px 72px 24px',
                  sm: 'minmax(0, 1fr) 72px 92px 28px',
                },
                '&:hover': { color: 'primary.main' },
              }}
            >
              <Typography variant="subtitle2" sx={{ minWidth: 0 }}>
                {result.eventShortTitle || result.eventTitle}
              </Typography>
              <Stack alignItems="flex-end">
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  O‘rin
                </Typography>
                <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                  {result.rank || '—'}
                </Typography>
              </Stack>
              <Stack alignItems="flex-end">
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Ball
                </Typography>
                <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                  {result.score || '—'}
                </Typography>
              </Stack>
              <SeasonAwardIcon award={result.award} size={24} focusable={false} reserveSpace />
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Bu mavsum uchun ochiq natija topilmadi.
        </Typography>
      )}
    </>
  );
}

export function SeasonParticipantDialog({
  open,
  seasonSlug,
  participantSlug,
  onClose,
}: SeasonParticipantDialogProps) {
  const { data, loading, error } = useAsyncData(
    () => seasonQueries.getParticipant(seasonSlug, participantSlug),
    null,
    [seasonSlug, participantSlug]
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="season-participant-dialog-title"
      slotProps={{
        paper: {
          sx: {
            m: { xs: 1.25, sm: 2 },
            width: { xs: 'calc(100% - 20px)', sm: 'calc(100% - 32px)' },
          },
        },
      }}
    >
      <DialogTitle id="season-participant-dialog-title" sx={{ pr: 7 }}>
        Ishtirokchi profili
      </DialogTitle>
      <IconButton
        aria-label="Ishtirokchi profilini yopish"
        onClick={onClose}
        sx={{ position: 'absolute', top: 12, right: 12 }}
      >
        <UiIcon icon="solar:close-circle-linear" width={22} />
      </IconButton>
      <DialogContent sx={{ px: { xs: 2, sm: 3 }, pt: 1 }}>
        {loading && <ParticipantSkeleton />}
        {error && <Alert severity="error">Ishtirokchi profilini yuklab bo‘lmadi.</Alert>}
        {!loading && !error && data && (
          <ParticipantContent participant={data} seasonSlug={seasonSlug} />
        )}
      </DialogContent>
    </Dialog>
  );
}
