import type { LearningStats, presentRootCategories } from 'modules/learning/domain';

import { UiIcon } from 'shared/ui/UiIcon';
import { appRoutes } from 'shared/config';
import { Link as RouterLink } from 'react-router';

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
        py: { xs: 7, md: 9 },
        bgcolor: 'background.neutral',
        contentVisibility: 'auto',
        containIntrinsicSize: 'auto 900px',
      }}
    >
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
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          }}
        >
          {rootCategories.map((category) => (
            <Box
              key={category.id}
              component={RouterLink}
              to={appRoutes.algorithmCategory(category.id)}
              sx={{
                p: 2,
                gap: 1.75,
                display: 'flex',
                color: 'text.primary',
                borderRadius: 1.5,
                textDecoration: 'none',
                '&:hover': { bgcolor: 'background.paper' },
              }}
            >
              <Box sx={{ mt: 0.25, color: 'primary.main' }}>
                <UiIcon icon={category.icon} width={22} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="baseline"
                  justifyContent="space-between"
                >
                  <Typography component="h3" variant="subtitle1">
                    {category.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {category.articleCount}
                  </Typography>
                </Stack>
                <Typography
                  variant="body2"
                  sx={(theme) => ({
                    mt: 0.75,
                    color: 'text.secondary',
                    ...theme.mixins.maxLine({ line: 2 }),
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
