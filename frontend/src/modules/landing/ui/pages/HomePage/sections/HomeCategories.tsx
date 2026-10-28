import type { LearningStats, presentRootCategories } from 'modules/learning/domain';

import { UiIcon } from 'shared/ui/UiIcon';
import { appRoutes } from 'shared/config';
import { Link as RouterLink } from 'react-router';
import { AlgorithmBackdrop } from 'shared/ui/AlgorithmVisual';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export function HomeCategories({
  rootCategories,
  stats,
  statsLoading,
  statsError,
}: {
  rootCategories: ReturnType<typeof presentRootCategories>;
  stats: LearningStats;
  statsLoading: boolean;
  statsError: Error | null;
}) {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        isolation: 'isolate',
        py: { xs: 7, md: 9 },
        bgcolor: 'background.neutral',
        contentVisibility: 'auto',
        containIntrinsicSize: 'auto 900px',
      }}
    >
      <AlgorithmBackdrop variant="section" />
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ sm: 'flex-end' }}
          justifyContent="space-between"
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography component="p" variant="subtitle2" sx={{ color: 'text.secondary' }}>
              {statsLoading || statsError
                ? 'Asosiy bo‘limlar'
                : `${stats.categoryCount} asosiy bo‘lim`}
            </Typography>
            <Typography component="h2" variant="h3" sx={{ mt: 1 }}>
              Mavzular bo‘yicha o‘rganing
            </Typography>
            <Typography sx={{ mt: 1, maxWidth: 620, color: 'text.secondary' }}>
              Poydevor tushunchalaridan graf va sonli algoritmlargacha barcha materiallar yagona
              mavzular tizimida jamlangan.
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            to={appRoutes.algorithms}
            endIcon={<UiIcon icon="solar:arrow-right-linear" width={18} />}
          >
            Barcha maqolalar
          </Button>
        </Stack>

        <Box
          sx={{
            gap: { xs: 1, sm: 2 },
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(3, minmax(0, 1fr))',
              lg: 'repeat(5, minmax(0, 1fr))',
            },
          }}
        >
          {rootCategories.map((category) => (
            <Box
              key={category.id}
              className="cp-motion-card"
              component={RouterLink}
              to={appRoutes.algorithmCategory(category.id)}
              sx={{
                p: { xs: 1.5, sm: 2.5 },
                minWidth: 0,
                minHeight: { xs: 176, sm: 210 },
                position: 'relative',
                isolation: 'isolate',
                display: 'block',
                color: 'text.primary',
                borderRadius: 1.5,
                textDecoration: 'none',
                border: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                transition: (theme) =>
                  theme.transitions.create(['border-color', 'box-shadow', 'transform']),
                '&:hover, &:focus-visible': {
                  borderColor: 'primary.main',
                  boxShadow: '0 4px 20px rgba(3, 111, 220, 0.08)',
                },
              }}
            >
              <AlgorithmBackdrop variant="card" topic={category.id} />
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box sx={{ display: 'flex', color: 'primary.main' }}>
                  <UiIcon icon={category.icon} width={25} />
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {category.articleCount} maqola
                </Typography>
              </Stack>
              <Box sx={{ minWidth: 0, mt: { xs: 3, sm: 4 } }}>
                <Typography
                  component="h3"
                  variant="subtitle1"
                  sx={{ fontSize: { xs: 13, sm: 15 }, minHeight: { xs: 42, sm: 48 } }}
                >
                  {category.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={(theme) => ({
                    mt: 0.75,
                    color: 'text.secondary',
                    ...theme.mixins.maxLine({ line: 2 }),
                    display: { xs: 'none', sm: '-webkit-box' },
                  })}
                >
                  {category.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
