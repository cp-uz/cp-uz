import { Seo } from 'shared/ui/Seo';
import { UiIcon } from 'shared/ui/UiIcon';
import { useAsyncData } from 'shared/hooks';
import { Link as RouterLink } from 'react-router';
import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import Accordion from '@mui/material/Accordion';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import { problemQueries } from '../application';

export default function ProblemCatalogPage() {
  const { data, loading, error } = useAsyncData(problemQueries.catalog, null, []);
  const [seasonSlug, setSeasonSlug] = useState('');

  useEffect(() => {
    if (!seasonSlug && data?.seasons[0]) setSeasonSlug(data.seasons[0].slug);
  }, [data, seasonSlug]);

  const events = useMemo(
    () => data?.events.filter((item) => !seasonSlug || item.season.slug === seasonSlug) ?? [],
    [data, seasonSlug]
  );

  return (
    <>
      <Seo
        title="Olimpiada masalalari"
        description="Olimpiada mavsumi, musobaqa va bosqichlar bo‘yicha o‘zbekcha masalalar katalogi."
        path="/masalalar"
      />
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 7 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          alignItems={{ md: 'flex-end' }}
          justifyContent="space-between"
        >
          <Box sx={{ maxWidth: 720 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'primary.main' }}>
              <UiIcon icon="solar:documents-minimalistic-linear" width={20} />
              <Typography variant="subtitle2">Masalalar katalogi</Typography>
            </Stack>
            <Typography
              component="h1"
              variant="h2"
              sx={{ mt: 1.5, fontSize: { xs: 36, sm: 44, md: 52 } }}
            >
              Olimpiada masalalari
            </Typography>
            <Typography variant="h6" sx={{ mt: 1.5, color: 'text.secondary', fontWeight: 400 }}>
              Mavsum, musobaqa va kun bo‘yicha tartiblangan o‘zbekcha shartlar. Masalani shu yerda
              o‘qing, mavjud platformada esa yechimini yuboring.
            </Typography>
          </Box>

          {data && data.seasons.length > 0 && (
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Typography component="label" variant="caption" sx={{ mb: 0.75, fontWeight: 600 }}>
                Mavsum
              </Typography>
              <Select
                value={seasonSlug}
                onChange={(event) => setSeasonSlug(event.target.value)}
                inputProps={{ 'aria-label': 'Masalalar mavsumini tanlash' }}
              >
                {data.seasons.map((season) => (
                  <MenuItem key={season.slug} value={season.slug}>
                    {season.slug}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Stack>

        {loading && (
          <Stack spacing={2} sx={{ mt: 5 }}>
            {[0, 1].map((item) => (
              <Skeleton key={item} variant="rounded" height={180} />
            ))}
          </Stack>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 5 }}>
            Masalalar katalogini yuklab bo‘lmadi. Server ulanishini tekshiring.
          </Alert>
        )}

        {!loading && !error && data && events.length === 0 && (
          <Paper variant="outlined" sx={{ mt: 5, p: { xs: 3, md: 5 }, textAlign: 'center' }}>
            <UiIcon icon="solar:folder-error-linear" width={42} />
            <Typography variant="h5" sx={{ mt: 1.5 }}>
              Bu mavsum uchun masalalar hali qo‘shilmagan
            </Typography>
          </Paper>
        )}

        <Stack spacing={2} sx={{ mt: 5 }}>
          {events.map(({ event, season, sets, problemCount }, eventIndex) => (
            <Accordion
              key={`${season.slug}:${event.slug}`}
              defaultExpanded={eventIndex === 0}
              disableGutters
              sx={{
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '12px !important',
                boxShadow: 'none',
                '&::before': { display: 'none' },
              }}
            >
              <AccordionSummary
                expandIcon={<UiIcon icon="solar:alt-arrow-down-linear" width={20} />}
                sx={{ px: { xs: 2, sm: 3 }, py: 1.25 }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 0.5, sm: 2 }}
                  alignItems={{ sm: 'center' }}
                  sx={{ minWidth: 0, flexGrow: 1 }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      flexShrink: 0,
                      display: { xs: 'none', sm: 'grid' },
                      placeItems: 'center',
                      color: 'primary.main',
                      bgcolor: 'primary.lighter',
                      borderRadius: 1.25,
                    }}
                  >
                    <UiIcon icon="solar:cup-star-linear" width={23} />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h6">{event.shortTitle || event.title}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {sets.length} ta bosqich · {problemCount} ta masala
                    </Typography>
                  </Box>
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ px: { xs: 2, sm: 3 }, pt: 0, pb: 3 }}>
                {event.summary && (
                  <Typography variant="body2" sx={{ mb: 2.5, color: 'text.secondary' }}>
                    {event.summary}
                  </Typography>
                )}
                <Box
                  role="tree"
                  aria-label={`${event.title} bosqichlari`}
                  sx={{
                    position: 'relative',
                    display: 'grid',
                    gap: { xs: 1.25, md: 2 },
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, minmax(0, 1fr))',
                      lg: `repeat(${Math.min(Math.max(sets.length, 1), 4)}, minmax(0, 1fr))`,
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 27,
                      left: 28,
                      right: 28,
                      height: 2,
                      display: { xs: 'none', sm: 'block' },
                      bgcolor: 'divider',
                    },
                  }}
                >
                  {sets.map((set, setIndex) => {
                    const firstSetProblem = set.problems[0];
                    const setPath = firstSetProblem
                      ? `/masalalar/${season.slug}/${event.slug}/${firstSetProblem.slug}`
                      : `/masalalar/${season.slug}/${event.slug}`;
                    return (
                      <Paper
                        key={set.slug}
                        role="treeitem"
                        variant="outlined"
                        component={RouterLink}
                        to={setPath}
                        sx={{
                          p: 2,
                          zIndex: 1,
                          minHeight: 132,
                          display: 'flex',
                          color: 'inherit',
                          textDecoration: 'none',
                          flexDirection: 'column',
                          bgcolor: 'background.paper',
                          transition: (theme) =>
                            theme.transitions.create(['border-color', 'transform', 'box-shadow']),
                          '&:hover': {
                            borderColor: 'primary.main',
                            boxShadow: (theme) => theme.vars.customShadows.z8,
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 54,
                            height: 54,
                            display: 'grid',
                            placeItems: 'center',
                            color: 'primary.main',
                            bgcolor: 'primary.lighter',
                            border: '2px solid',
                            borderColor: 'primary.main',
                            borderRadius: '50%',
                          }}
                        >
                          <UiIcon icon="solar:folder-with-files-linear" width={24} />
                        </Box>
                        <Stack
                          direction="row"
                          alignItems="flex-end"
                          justifyContent="space-between"
                          sx={{ mt: 1.5 }}
                        >
                          <Box>
                            <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                              {setIndex + 1}-bosqich
                            </Typography>
                            <Typography variant="subtitle1">{set.title}</Typography>
                            {set.dateLabel && (
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {set.dateLabel}
                              </Typography>
                            )}
                          </Box>
                          <Stack
                            direction="row"
                            spacing={0.75}
                            alignItems="center"
                            sx={{ color: 'primary.main' }}
                          >
                            <Typography variant="caption" sx={{ fontWeight: 700 }}>
                              {set.problems.length} ta masala
                            </Typography>
                            <UiIcon icon="solar:arrow-right-linear" width={17} />
                          </Stack>
                        </Stack>
                      </Paper>
                    );
                  })}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Container>
    </>
  );
}
