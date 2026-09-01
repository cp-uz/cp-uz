import type { SeasonParticipant } from '../../domain';

import { UiIcon } from 'shared/ui/UiIcon';
import { useAsyncData } from 'shared/hooks';
import { Link as RouterLink } from 'react-router';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
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

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase('uz'))
    .join('');
}

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

  return (
    <>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.25} alignItems={{ sm: 'center' }}>
        <Avatar
          src={participant.photoUrl}
          alt={participant.fullName}
          sx={{ width: 88, height: 88, fontSize: 28, bgcolor: 'primary.main' }}
        >
          {initials(participant.fullName)}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography component="h2" variant="h4">
            {participant.fullName}
          </Typography>
          {secondary && (
            <Typography sx={{ mt: 0.5, color: 'text.secondary' }}>{secondary}</Typography>
          )}
          {participant.countryCode && (
            <Chip size="small" variant="soft" label={participant.countryCode} sx={{ mt: 1.25 }} />
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
          <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 1 }}>
            {platformAccounts.map((account) => {
              const platform = PLATFORM_ASSETS[account.platform];
              return (
                <Tooltip key={account.id} title={platform.label} arrow>
                  <Link
                    href={account.url}
                    target="_blank"
                    rel="noreferrer"
                    underline="none"
                    aria-label={`${platform.label}: ${account.handle}`}
                    sx={{
                      py: 0.625,
                      px: 1,
                      gap: 0.75,
                      display: 'inline-flex',
                      color: 'text.primary',
                      alignItems: 'center',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 99,
                      bgcolor: 'background.paper',
                      '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                    }}
                  >
                    <Box
                      component="img"
                      src={platform.src}
                      alt=""
                      sx={{ width: 20, height: 20, objectFit: 'contain', flexShrink: 0 }}
                    />
                    <Typography variant="body2" noWrap sx={{ maxWidth: 150, fontWeight: 600 }}>
                      @{account.handle}
                    </Typography>
                    {account.verified && (
                      <UiIcon icon="solar:verified-check-bold" width={14} color="primary.main" />
                    )}
                  </Link>
                </Tooltip>
              );
            })}
          </Stack>
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
              to={`/seasons/${seasonSlug}/${result.eventSlug}`}
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
      <DialogContent sx={{ pt: 1 }}>
        {loading && <ParticipantSkeleton />}
        {error && <Alert severity="error">Ishtirokchi profilini yuklab bo‘lmadi.</Alert>}
        {!loading && !error && data && (
          <ParticipantContent participant={data} seasonSlug={seasonSlug} />
        )}
      </DialogContent>
    </Dialog>
  );
}
