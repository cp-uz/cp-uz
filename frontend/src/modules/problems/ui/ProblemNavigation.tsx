import type { ProblemDetail } from '../domain';

import { appRoutes } from 'shared/config';
import { UiIcon } from 'shared/ui/UiIcon';
import { Link as RouterLink } from 'react-router';
import { formatUzbekDate } from 'shared/lib/i18n';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';

export function problemPath(problem: ProblemDetail, slug: string) {
  return appRoutes.task(problem.season.slug, problem.event.slug, slug);
}

function formatEventDate(event: ProblemDetail['event']) {
  if (event.dateLabel) return event.dateLabel;
  if (!event.startDate) return '';
  const start = formatUzbekDate(event.startDate);
  if (!event.endDate || event.endDate === event.startDate) return start;
  return `${start} — ${formatUzbekDate(event.endDate)}`;
}

export function ProblemNavigation({ problem }: { problem: ProblemDetail }) {
  return (
    <Box component="nav" aria-label="Event masalalari">
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="overline" sx={{ color: 'primary.main' }}>
            {problem.season.title}
          </Typography>
          <Typography variant="h6">{problem.event.shortTitle || problem.event.title}</Typography>
        </Box>
        <Tooltip title="Mavsum sahifasini ochish">
          <Button
            component={RouterLink}
            to={appRoutes.seasonEvent(problem.season.slug, problem.event.slug)}
            color="inherit"
            aria-label="Mavsumdagi event tafsilotlarini ochish"
            sx={{ minWidth: 40, p: 1 }}
          >
            <UiIcon icon="solar:calendar-search-linear" width={21} />
          </Button>
        </Tooltip>
      </Stack>
      {problem.event.summary && (
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          {problem.event.summary}
        </Typography>
      )}
      <Stack spacing={0.75} sx={{ mt: 2 }}>
        {formatEventDate(problem.event) && (
          <Stack direction="row" spacing={1} alignItems="center">
            <UiIcon icon="solar:calendar-date-linear" width={17} />
            <Typography variant="caption">{formatEventDate(problem.event)}</Typography>
          </Stack>
        )}
        {(problem.event.venue || problem.event.location) && (
          <Stack direction="row" spacing={1} alignItems="center">
            <UiIcon icon="solar:map-point-linear" width={17} />
            <Typography variant="caption">
              {[problem.event.venue, problem.event.location].filter(Boolean).join(' · ')}
            </Typography>
          </Stack>
        )}
      </Stack>

      <Divider sx={{ my: 2.5 }} />
      <Typography variant="subtitle2">Barcha masalalar</Typography>
      <Stack spacing={2} sx={{ mt: 1.5 }}>
        {problem.sets.map((set) => (
          <Box key={set.slug}>
            <Typography variant="caption" sx={{ px: 1, color: 'text.secondary', fontWeight: 700 }}>
              {set.title}
            </Typography>
            <Stack sx={{ mt: 0.5 }}>
              {set.problems.map((item) => {
                const selected = item.slug === problem.slug;
                return (
                  <ListItemButton
                    key={item.slug}
                    component={RouterLink}
                    to={problemPath(problem, item.slug)}
                    selected={selected}
                    aria-current={selected ? 'page' : undefined}
                    sx={{
                      px: 1,
                      py: 0.75,
                      gap: 1,
                      minHeight: 42,
                      borderRadius: 1,
                      '&.Mui-selected': { bgcolor: 'primary.lighter', color: 'primary.dark' },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ width: 20, flexShrink: 0, color: 'primary.main', fontWeight: 700 }}
                    >
                      {item.code}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: selected ? 700 : 500 }}>
                      {item.originalTitle || item.title}
                    </Typography>
                  </ListItemButton>
                );
              })}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
