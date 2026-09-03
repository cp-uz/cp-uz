import type { ReactNode } from 'react';

import { useMemo } from 'react';
import { Seo } from 'shared/ui/Seo';
import { UiIcon } from 'shared/ui/UiIcon';
import { useAsyncData } from 'shared/hooks';
import { Link as RouterLink } from 'react-router';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { treeItemClasses, TreeItem as MuiTreeItem } from '@mui/x-tree-view/TreeItem';

import { problemQueries } from '../application';

function eventLogo(slug: string) {
  if (slug === 'ioi-2026') return '/assets/seasons/ioi.png';
  if (slug === 'egoi-2026') return '/assets/seasons/egoi.png';
  return undefined;
}

function TreeEndIcon() {
  return <UiIcon icon="solar:folder-bold" width={14} />;
}

const TreeItem = styled(MuiTreeItem)(({ theme }) => ({
  color: theme.vars.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    minHeight: 44,
    margin: theme.spacing(0.25, 0),
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.spacing(0.75),
    '&:hover': { backgroundColor: theme.vars.palette.action.hover },
    '&.Mui-selected, &.Mui-selected:hover': {
      color: theme.vars.palette.text.primary,
      backgroundColor: theme.vars.palette.action.selected,
    },
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    width: 22,
    height: 22,
    display: 'grid',
    flexShrink: 0,
    lineHeight: 0,
    placeItems: 'center',
    borderRadius: '50%',
    color: theme.vars.palette.primary.main,
    backgroundColor: theme.vars.palette.action.selected,
    '& svg': { display: 'block', fontSize: 16 },
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 11,
    paddingLeft: 20,
    borderLeft: `1px dashed ${theme.vars.palette.divider}`,
  },
  [`&:not([aria-expanded]) > .${treeItemClasses.content} > .${treeItemClasses.iconContainer}`]: {
    color: theme.vars.palette.primary.dark,
    backgroundColor: theme.vars.palette.primary.lighter,
  },
}));

type TreeLabelProps = {
  icon: ReactNode;
  title: string;
  stats?: Array<{
    count: number;
    icon: string;
    label: string;
  }>;
};

function TreeLabel({ icon, title, stats = [] }: TreeLabelProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.25} sx={{ minWidth: 0, width: 1 }}>
      <Box
        sx={{
          width: 24,
          height: 24,
          display: 'grid',
          flexShrink: 0,
          placeItems: 'center',
          color: 'text.secondary',
        }}
      >
        {icon}
      </Box>
      <Typography variant="body2" sx={{ minWidth: 0, color: 'text.primary', fontWeight: 600 }}>
        {title}
      </Typography>
      {stats.length > 0 && (
        <Stack direction="row" spacing={0.75} sx={{ ml: 'auto !important', flexShrink: 0 }}>
          {stats.map((stat) => (
            <Tooltip key={stat.label} title={stat.label} arrow>
              <Chip
                size="small"
                variant="soft"
                label={stat.count}
                icon={<UiIcon icon={stat.icon} width={15} />}
                aria-label={`${stat.count} ${stat.label}`}
                sx={{
                  height: 26,
                  '& .MuiChip-label': { px: 0.75, fontWeight: 600 },
                  '& .MuiChip-icon': { ml: 0.75, color: 'primary.main' },
                }}
              />
            </Tooltip>
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export default function ProblemCatalogPage() {
  const { data, loading, error } = useAsyncData(problemQueries.catalog, null, []);
  const seasons = useMemo(
    () =>
      data?.seasons.map((season) => ({
        season,
        events: data.events.filter((item) => item.season.slug === season.slug),
      })) ?? [],
    [data]
  );
  const defaultExpandedItems = useMemo(
    () => [
      ...seasons.map(({ season }) => `season:${season.slug}`),
      ...seasons.flatMap(({ season, events }) =>
        events.map(({ event }) => `event:${season.slug}:${event.slug}`)
      ),
    ],
    [seasons]
  );

  return (
    <>
      <Seo
        title="Olimpiada masalalari"
        description="Olimpiada mavsumi, musobaqa va bosqichlar bo‘yicha o‘zbekcha masalalar katalogi."
        path="/masalalar"
      />
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        <Box sx={{ maxWidth: 1040 }}>
          <Typography component="h1" variant="h3">
            Masalalar
          </Typography>
          <Typography sx={{ mt: 1, color: 'text.secondary' }}>
            Olimpiada masalalari mavsum va bosqich bo‘yicha tartiblangan.
          </Typography>

          {loading && (
            <Stack spacing={1} sx={{ mt: 4 }}>
              {[0, 1, 2].map((item) => (
                <Skeleton key={item} variant="rounded" height={48} />
              ))}
            </Stack>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 4 }}>
              Masalalar katalogini yuklab bo‘lmadi. Server ulanishini tekshiring.
            </Alert>
          )}

          {!loading && !error && data && seasons.length === 0 && (
            <Typography sx={{ mt: 4, color: 'text.secondary' }}>
              Masalalar hali qo‘shilmagan.
            </Typography>
          )}

          {!loading && !error && data && seasons.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <SimpleTreeView
                aria-label="Olimpiada masalalari katalogi"
                defaultExpandedItems={defaultExpandedItems}
                slots={{ endIcon: TreeEndIcon }}
                sx={{ width: 1, overflowX: 'hidden' }}
              >
                {seasons.map(({ season, events }) => {
                  const problemCount = events.reduce((total, item) => total + item.problemCount, 0);

                  return (
                    <TreeItem
                      key={season.slug}
                      itemId={`season:${season.slug}`}
                      label={
                        <TreeLabel
                          title={season.slug}
                          icon={<UiIcon icon="solar:calendar-linear" width={20} />}
                          stats={[
                            {
                              count: events.length,
                              icon: 'solar:cup-star-linear',
                              label: 'Musobaqalar soni',
                            },
                            {
                              count: problemCount,
                              icon: 'solar:code-square-linear',
                              label: 'Masalalar soni',
                            },
                          ]}
                        />
                      }
                    >
                      {events.map(({ event, sets, problemCount: eventProblemCount }) => {
                        const logo = eventLogo(event.slug);

                        return (
                          <TreeItem
                            key={event.slug}
                            itemId={`event:${season.slug}:${event.slug}`}
                            label={
                              <TreeLabel
                                title={event.shortTitle || event.title}
                                stats={[
                                  {
                                    count: sets.length,
                                    icon: 'solar:folder-linear',
                                    label: 'Bosqichlar soni',
                                  },
                                  {
                                    count: eventProblemCount,
                                    icon: 'solar:code-square-linear',
                                    label: 'Masalalar soni',
                                  },
                                ]}
                                icon={
                                  logo ? (
                                    <Box
                                      component="img"
                                      src={logo}
                                      alt=""
                                      aria-hidden="true"
                                      sx={{ width: 22, height: 22, objectFit: 'contain' }}
                                    />
                                  ) : (
                                    <UiIcon icon="solar:cup-star-linear" width={19} />
                                  )
                                }
                              />
                            }
                          >
                            {sets.map((set) => {
                              const firstProblem = set.problems[0];
                              const setPath = firstProblem
                                ? `/masalalar/${season.slug}/${event.slug}/${firstProblem.slug}`
                                : `/masalalar/${season.slug}/${event.slug}`;

                              return (
                                <TreeItem
                                  key={set.slug}
                                  itemId={`set:${season.slug}:${event.slug}:${set.slug}`}
                                  label={
                                    <Box
                                      component={RouterLink}
                                      to={setPath}
                                      onClick={(treeEvent) => treeEvent.stopPropagation()}
                                      sx={{
                                        gap: 1.25,
                                        width: 1,
                                        minWidth: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: 'inherit',
                                        textDecoration: 'none',
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        sx={{ color: 'text.primary', fontWeight: 500 }}
                                      >
                                        {set.title}
                                      </Typography>
                                      {set.dateLabel && (
                                        <Typography
                                          variant="caption"
                                          sx={{ color: 'text.secondary' }}
                                        >
                                          {set.dateLabel}
                                        </Typography>
                                      )}
                                      <Tooltip title="Masalalar soni" arrow>
                                        <Chip
                                          size="small"
                                          variant="soft"
                                          label={set.problems.length}
                                          icon={
                                            <UiIcon icon="solar:code-square-linear" width={15} />
                                          }
                                          aria-label={`${set.problems.length} ta masala`}
                                          sx={{
                                            ml: 'auto',
                                            height: 26,
                                            '& .MuiChip-label': { px: 0.75, fontWeight: 600 },
                                            '& .MuiChip-icon': {
                                              ml: 0.75,
                                              color: 'primary.main',
                                            },
                                          }}
                                        />
                                      </Tooltip>
                                      <UiIcon icon="solar:arrow-right-linear" width={17} />
                                    </Box>
                                  }
                                />
                              );
                            })}
                          </TreeItem>
                        );
                      })}
                    </TreeItem>
                  );
                })}
              </SimpleTreeView>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
}
