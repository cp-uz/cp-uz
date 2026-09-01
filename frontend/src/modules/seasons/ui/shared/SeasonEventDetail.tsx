import type { SeasonEvent, SeasonRoute } from '../../domain';

import { useState } from 'react';
import { UiIcon } from 'shared/ui/UiIcon';
import { formatUzbekDate } from 'shared/lib/i18n';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

import { SeasonAwardIcon } from './SeasonAwardIcon';
import { SeasonParticipantDialog } from './SeasonParticipantDialog';
import {
  EVENT_TYPE_LABELS,
  EVENT_STATUS_LABELS,
  RESOURCE_PRESENTATION,
  seasonEventPresentation,
} from '../../domain';

type SeasonEventDetailProps = {
  event: SeasonEvent;
  route?: SeasonRoute;
  compact?: boolean;
  seasonSlug: string;
};

function formatEventDate(event: SeasonEvent) {
  if (event.dateLabel) return event.dateLabel;
  if (event.datePrecision === 'tba' || !event.startDate) return 'Sana hali noma’lum';
  const start = formatUzbekDate(event.startDate);
  if (event.datePrecision !== 'range' || !event.endDate || event.endDate === event.startDate) {
    return start;
  }
  return `${start} — ${formatUzbekDate(event.endDate)}`;
}

function formatMode(mode: string) {
  const labels: Record<string, string> = {
    onsite: 'Joyida',
    online: 'Onlayn',
    hybrid: 'Gibrid',
    tba: 'Format e’lon qilinadi',
  };
  return labels[mode.toLocaleLowerCase('en')] ?? mode;
}

function verificationLabel(status: SeasonEvent['verificationStatus']) {
  const labels: Record<NonNullable<SeasonEvent['verificationStatus']>, string> = {
    verified: 'Tekshirilgan ma’lumot',
    pending: 'Tekshiruv kutilmoqda',
    unverified: 'Hali tekshirilmagan',
    disputed: 'Manbalarda tafovut bor',
  };
  return status ? labels[status] : '';
}

function MetaItem({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <Stack direction="row" spacing={1.25} alignItems="flex-start">
      <Box sx={{ display: 'flex', mt: 0.125, color: 'text.secondary' }}>
        <UiIcon icon={icon} width={18} />
      </Box>
      <Typography variant="body2">{children}</Typography>
    </Stack>
  );
}

export function SeasonEventDetail({
  event,
  route,
  seasonSlug,
  compact = false,
}: SeasonEventDetailProps) {
  const [participantSlug, setParticipantSlug] = useState('');
  const presentation = seasonEventPresentation(event, route);
  const localResults = event.results.filter((result) => result.local);
  const visibleResults = localResults.length ? localResults : event.results;
  const primarySources = event.sources.filter((source) => source.primary);
  const otherSources = event.sources.filter((source) => !source.primary);

  return (
    <Box>
      <Stack direction="row" spacing={1.25} alignItems="center">
        <Box
          sx={(theme) => ({
            width: 8,
            height: 24,
            flexShrink: 0,
            borderRadius: 0.5,
            bgcolor: presentation.color,
            ...theme.applyStyles('dark', {
              bgcolor: presentation.darkColor,
            }),
          })}
        />
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {EVENT_TYPE_LABELS[event.type]}
        </Typography>
      </Stack>

      <Typography component="h2" variant={compact ? 'h4' : 'h3'} sx={{ mt: 2 }}>
        {event.title}
      </Typography>
      {event.summary && (
        <Typography sx={{ mt: 1, color: 'text.secondary' }}>{event.summary}</Typography>
      )}

      <Box
        sx={(theme) => ({
          mt: 2.5,
          px: 1.5,
          py: 1.25,
          bgcolor: 'background.neutral',
          borderRadius: 1.25,
          color:
            event.status === 'live'
              ? 'success.dark'
              : event.status === 'cancelled'
                ? 'error.dark'
                : 'text.primary',
          ...theme.applyStyles('dark', {
            color:
              event.status === 'live'
                ? theme.vars.palette.success.light
                : event.status === 'cancelled'
                  ? theme.vars.palette.error.light
                  : theme.vars.palette.text.primary,
          }),
        })}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <UiIcon
            icon={
              event.status === 'completed'
                ? 'solar:check-circle-linear'
                : 'solar:clock-circle-linear'
            }
            width={19}
          />
          <Typography variant="subtitle2">{EVENT_STATUS_LABELS[event.status]}</Typography>
        </Stack>
      </Box>

      <Stack spacing={1.5} sx={{ mt: 2.5 }}>
        <MetaItem icon="solar:calendar-date-linear">{formatEventDate(event)}</MetaItem>
        {(event.venue || event.location) && (
          <MetaItem icon="solar:map-point-linear">
            {[event.venue, event.location].filter(Boolean).join(' · ')}
          </MetaItem>
        )}
        {event.mode && <MetaItem icon="solar:laptop-linear">{formatMode(event.mode)}</MetaItem>}
        {event.organizer && <MetaItem icon="solar:buildings-2-linear">{event.organizer}</MetaItem>}
        {(event.gradeMin || event.gradeMax) && (
          <MetaItem icon="solar:square-academic-cap-linear">
            {event.gradeMin && event.gradeMax
              ? `${event.gradeMin}–${event.gradeMax}-sinflar`
              : `${event.gradeMin || event.gradeMax}-sinf`}
          </MetaItem>
        )}
      </Stack>

      {(event.description || event.eligibility) && <Divider sx={{ my: 3 }} />}
      {event.description && (
        <Box>
          <Typography variant="subtitle2">Musobaqa haqida</Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1, color: 'text.secondary', whiteSpace: 'pre-line' }}
          >
            {event.description}
          </Typography>
        </Box>
      )}
      {event.eligibility && (
        <Box sx={{ mt: event.description ? 2.5 : 0 }}>
          <Typography variant="subtitle2">Kimlar qatnashadi?</Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            {event.eligibility}
          </Typography>
        </Box>
      )}

      {(event.resources.length > 0 || event.platform) && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle2">Resurslar</Typography>
          <Stack spacing={0.5} sx={{ mt: 1 }}>
            {event.platform && (
              <Stack direction="row" spacing={1.25} sx={{ px: 1, py: 1 }}>
                <UiIcon icon="solar:monitor-smartphone-linear" width={19} />
                <Typography variant="body2">Platforma: {event.platform}</Typography>
              </Stack>
            )}
            {event.resources.map((resource) => {
              const resourcePresentation = RESOURCE_PRESENTATION[resource.type];
              return (
                <Button
                  key={resource.id}
                  component="a"
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  color="inherit"
                  startIcon={<UiIcon icon={resourcePresentation.icon} width={19} />}
                  endIcon={<UiIcon icon="solar:arrow-right-up-linear" width={16} />}
                  sx={{ px: 1, py: 1, justifyContent: 'flex-start', fontWeight: 500 }}
                >
                  {resource.title || resourcePresentation.label}
                </Button>
              );
            })}
          </Stack>
        </>
      )}

      {visibleResults.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle2">
            {localResults.length ? 'O‘zbekistonlik ishtirokchilar' : 'Natijalar'}
          </Typography>
          <Stack divider={<Divider flexItem />} sx={{ mt: 1 }}>
            {visibleResults.map((result) => (
              <Box key={result.id} sx={{ py: 1.5 }}>
                <Box
                  sx={{
                    display: 'grid',
                    alignItems: 'center',
                    columnGap: { xs: 0.75, sm: 1 },
                    gridTemplateColumns: {
                      xs: '34px minmax(0, 1fr) 22px 58px 18px',
                      sm: '38px minmax(0, 1fr) 24px 72px 20px',
                    },
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ color: 'primary.main', fontVariantNumeric: 'tabular-nums' }}
                  >
                    {result.rank || '—'}
                  </Typography>
                  <Box sx={{ minWidth: 0 }}>
                    {result.participantSlug ? (
                      <ButtonBase
                        onClick={() => setParticipantSlug(result.participantSlug || '')}
                        sx={{
                          maxWidth: '100%',
                          display: 'flex',
                          borderRadius: 0.5,
                          textAlign: 'left',
                          justifyContent: 'flex-start',
                          '&:hover': { color: 'primary.main' },
                          '&:focus-visible': {
                            outline: '2px solid',
                            outlineColor: 'primary.main',
                            outlineOffset: 2,
                          },
                        }}
                      >
                        <Typography variant="subtitle2">{result.participantName}</Typography>
                      </ButtonBase>
                    ) : (
                      <Typography variant="subtitle2">
                        {result.participantName || result.teamName}
                      </Typography>
                    )}
                    {result.teamName && result.participantName && (
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {result.teamName}
                      </Typography>
                    )}
                    {result.teamMembers && result.teamMembers.length > 0 && (
                      <Typography
                        variant="caption"
                        sx={{ display: 'block', color: 'text.secondary' }}
                      >
                        {result.teamMembers.join(', ')}
                      </Typography>
                    )}
                    {result.category && (
                      <Typography
                        variant="caption"
                        sx={{ display: 'block', color: 'text.secondary' }}
                      >
                        {result.category}
                      </Typography>
                    )}
                  </Box>
                  <SeasonAwardIcon award={result.award} size={18} reserveSpace />
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      textAlign: 'right',
                      whiteSpace: 'nowrap',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {result.score || ''}
                  </Typography>
                  {result.sourceUrl ? (
                    <Link
                      href={result.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${result.participantName || result.teamName} natijasi manbasi`}
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        flexShrink: 0,
                      }}
                    >
                      <UiIcon icon="solar:arrow-right-up-linear" width={16} />
                    </Link>
                  ) : (
                    <Box />
                  )}
                </Box>
              </Box>
            ))}
          </Stack>
        </>
      )}

      {(primarySources.length > 0 || otherSources.length > 0) && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle2">Ma’lumot manbalari</Typography>
          <Stack spacing={1.25} sx={{ mt: 1.5 }}>
            {[...primarySources, ...otherSources].map((source) => (
              <Stack key={source.id} direction="row" spacing={1.25} alignItems="flex-start">
                <Box sx={{ mt: 0.25, color: source.primary ? 'primary.main' : 'text.secondary' }}>
                  <UiIcon
                    icon={source.primary ? 'solar:verified-check-linear' : 'solar:link-linear'}
                    width={18}
                  />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Link
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    underline="hover"
                    color="text.primary"
                    variant="body2"
                    sx={{ fontWeight: 500 }}
                  >
                    {source.title}
                  </Link>
                  {source.publisher && (
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', color: 'text.secondary' }}
                    >
                      {source.publisher}
                    </Typography>
                  )}
                  {source.notes && (
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', mt: 0.25, color: 'text.secondary' }}
                    >
                      {source.notes}
                    </Typography>
                  )}
                </Box>
              </Stack>
            ))}
          </Stack>
        </>
      )}

      {(event.verificationStatus || event.verifiedAt) && (
        <Typography variant="caption" sx={{ display: 'block', mt: 3, color: 'text.secondary' }}>
          {verificationLabel(event.verificationStatus)}
          {event.verifiedAt ? ` · ${formatUzbekDate(event.verifiedAt)}` : ''}
        </Typography>
      )}

      {participantSlug && (
        <SeasonParticipantDialog
          open
          seasonSlug={seasonSlug}
          participantSlug={participantSlug}
          onClose={() => setParticipantSlug('')}
        />
      )}
    </Box>
  );
}
