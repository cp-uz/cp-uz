import type { LearningArticle } from 'modules/learning/domain';

import { UiIcon } from 'shared/ui/UiIcon';
import { appRoutes } from 'shared/config';
import { Link as RouterLink } from 'react-router';
import { roadmapStages, getArticlePath } from 'modules/learning/domain';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export function HomeLearningPaths({ liveArticles }: { liveArticles: LearningArticle[] }) {
  return (
    <Container
      component="section"
      maxWidth="xl"
      sx={{
        py: { xs: 7, md: 9 },
        contentVisibility: 'auto',
        containIntrinsicSize: 'auto 760px',
      }}
    >
      <Box
        sx={{
          gap: { xs: 6, md: 8 },
          display: 'grid',
          alignItems: 'start',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(300px, 0.8fr) minmax(0, 1.2fr)' },
        }}
      >
        <Box>
          <Typography component="p" variant="subtitle2" sx={{ color: 'text.secondary' }}>
            Tavsiya etilgan ketma-ketlik
          </Typography>
          <Typography component="h2" variant="h4" sx={{ mt: 1 }}>
            Qayerdan boshlash kerak?
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Poydevordan boshlab mavzularni tartib bilan o‘ting.
          </Typography>
          <Stack divider={<Divider flexItem />} sx={{ mt: 3 }}>
            {roadmapStages.slice(0, 4).map((stage) => (
              <Stack key={stage.id} direction="row" spacing={2} sx={{ py: 2 }}>
                <Typography
                  component="span"
                  variant="subtitle2"
                  sx={{ width: 28, color: 'primary.main' }}
                >
                  {String(stage.order).padStart(2, '0')}
                </Typography>
                <Box>
                  <Typography component="h3" variant="subtitle2">
                    {stage.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {stage.duration}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
          <Button component={RouterLink} to={appRoutes.roadmap} sx={{ mt: 2, px: 0 }}>
            Yo‘l xaritasini ko‘rish
          </Button>
        </Box>

        <Box>
          <Stack
            direction="row"
            alignItems="flex-end"
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography component="p" variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Kutubxonadan
              </Typography>
              <Typography component="h2" variant="h4" sx={{ mt: 1 }}>
                O‘qishni boshlash uchun
              </Typography>
            </Box>
            <Button
              component={RouterLink}
              to={appRoutes.algorithms}
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              Hammasi
            </Button>
          </Stack>
          <Stack divider={<Divider flexItem />}>
            {liveArticles.slice(0, 5).map((article) => (
              <Box
                key={article.sourceId ?? article.slug}
                component={RouterLink}
                to={getArticlePath(article)}
                sx={{
                  py: 2.25,
                  gap: 2,
                  display: 'flex',
                  color: 'text.primary',
                  textDecoration: 'none',
                  '&:hover h3': { color: 'primary.main' },
                }}
              >
                <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                  <Typography component="h3" variant="subtitle1">
                    {article.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={(theme) => ({
                      mt: 0.5,
                      color: 'text.secondary',
                      ...theme.mixins.maxLine({ line: 1 }),
                    })}
                  >
                    {article.summary}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ flexShrink: 0, color: 'text.secondary' }}>
                  {article.readTime} daq.
                </Typography>
                <UiIcon icon="solar:alt-arrow-right-linear" width={18} />
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
