import type { LearningArticle } from '../../../domain';

import { Seo } from 'shared/ui/Seo';
import { UiIcon } from 'shared/ui/UiIcon';
import { useAsyncData } from 'shared/hooks';
import { Link as RouterLink } from 'react-router';
import { getAuthSession } from 'modules/auth/application';
import { useLocalStorageList } from 'modules/engagement/application';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { roadmapStages, getArticlePath } from '../../../domain';
import { learningQueries as learningApi } from '../../../application';

function findRoadmapArticle(articleList: LearningArticle[], slug: string) {
  const normalizeSlug = (value: string) =>
    value
      .toLocaleLowerCase('en')
      .replace(/\.html$/i, '')
      .replace(/_/g, '-');
  const target = normalizeSlug(slug);

  return articleList.find((article) => {
    const publicParts = article.publicPath?.split('/').filter(Boolean) ?? [];
    const routeParts = article.route?.split('/').filter(Boolean) ?? [];
    const sourceParts = article.sourceId?.split('--') ?? [];
    const publicSlug = publicParts[publicParts.length - 1]?.replace(/\.html$/i, '');
    const routeSlug = routeParts[routeParts.length - 1]?.replace(/\.html$/i, '');
    const sourceSlug = sourceParts[sourceParts.length - 1];

    return [article.sourceId, article.slug, publicSlug, routeSlug, sourceSlug]
      .filter((value): value is string => Boolean(value))
      .some((value) => normalizeSlug(value) === target);
  });
}

export default function RoadmapPage() {
  const { data: liveArticles, loading, error } = useAsyncData(learningApi.listArticles, [], []);
  const completed = useLocalStorageList('cpuz:completed', []);
  const resolvedStages = roadmapStages.map((stage) => ({
    ...stage,
    resolvedArticles: stage.articleSlugs.flatMap((slug) => {
      const article = findRoadmapArticle(liveArticles, slug);
      return article ? [article] : [];
    }),
  }));
  const totalArticles = resolvedStages.reduce(
    (sum, stage) => sum + stage.resolvedArticles.length,
    0
  );
  const completedArticleCount = resolvedStages
    .flatMap((stage) => stage.resolvedArticles)
    .filter((article) => completed.has(article.sourceId ?? article.slug)).length;
  const completion = totalArticles
    ? Math.min(100, Math.round((completedArticleCount / totalArticles) * 100))
    : 0;
  const missingArticleSlugs = roadmapStages.flatMap((stage) =>
    stage.articleSlugs.filter((slug) => !findRoadmapArticle(liveArticles, slug))
  );
  const stageTitles = new Map(roadmapStages.map((stage) => [stage.id, stage.title]));

  return (
    <>
      <Seo
        title="O‘rganish yo‘l xaritasi"
        description="Sport dasturlashni poydevordan yuqori darajagacha tizimli o‘rganish yo‘l xaritasi."
        path="/yol-xaritasi"
      />

      <Container maxWidth="xl" sx={{ pt: { xs: 5, md: 7 }, pb: { xs: 7, md: 10 } }}>
        <Box sx={{ maxWidth: 760 }}>
          <Typography component="h1" variant="h3">
            Poydevordan mahoratgacha
          </Typography>
          <Typography sx={{ mt: 1.5, color: 'text.secondary' }}>
            Sport dasturlash mavzularini o‘zaro bog‘langan bosqichlar orqali o‘rganing. Har bir
            bosqich oldingi bilim ustiga quriladi va keyingi qadamni aniq ko‘rsatadi.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 3.5 }}>
            <Button
              component="a"
              href="#bosqichlar"
              variant="contained"
              endIcon={<UiIcon icon="solar:arrow-down-linear" width={18} />}
            >
              O‘rganishni boshlash
            </Button>
            <Button component={RouterLink} to="/algoritmlar" color="inherit">
              Mavzular kutubxonasi
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: { xs: 4, md: 5 } }} />

        {loading && (
          <Box role="status" aria-live="polite" sx={{ mb: 4 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Yo‘l xaritasidagi darsliklar yuklanmoqda…
            </Typography>
            <LinearProgress aria-label="Yo‘l xaritasi yuklanmoqda" />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            Yo‘l xaritasi darsliklarini serverdan yuklab bo‘lmadi. Ulanishni tekshirib, sahifani
            qayta oching.
          </Alert>
        )}

        {!loading && !error && missingArticleSlugs.length > 0 && (
          <Alert severity="warning" sx={{ mb: 4 }}>
            Yo‘l xaritasidagi {missingArticleSlugs.length} ta darslik topilmadi. Kontent eksporti
            bilan yo‘l xaritasini tekshirish kerak.
          </Alert>
        )}

        <Box
          sx={{
            gap: { xs: 2.5, md: 7 },
            display: 'grid',
            alignItems: 'end',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 360px' },
          }}
        >
          <Box>
            <Typography variant="h5">O‘qish holatingiz</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              {loading
                ? 'Darsliklar hisoblanmoqda.'
                : `${completedArticleCount} / ${totalArticles} ta asosiy darslik yakunlangan.`}{' '}
              Holat {getAuthSession() ? 'profilingizda' : 'shu qurilmada'} avtomatik saqlanadi.
            </Typography>
          </Box>
          <Box>
            <Stack direction="row" alignItems="baseline" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Umumiy natija
              </Typography>
              <Typography variant="h5">{completion}%</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={completion}
              aria-label={`Yo‘l xaritasi ${completion}% yakunlangan`}
              sx={{ mt: 1.25, height: 5 }}
            />
          </Box>
        </Box>

        <Box component="section" id="bosqichlar" sx={{ pt: { xs: 7, md: 9 } }}>
          <Box sx={{ maxWidth: 680, mb: { xs: 3, md: 4 } }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              {roadmapStages.length} bosqich
            </Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              Tavsiya etilgan ketma-ketlik
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              O‘zlashtirgan mavzularingizni yakunlangan deb belgilang va o‘zingizga qulay sur’atda
              davom eting.
            </Typography>
          </Box>

          <Stack divider={<Divider flexItem />}>
            {resolvedStages.map((stage) => {
              const stageArticles = stage.resolvedArticles;
              const completeCount = stageArticles.filter((article) =>
                completed.has(article.sourceId ?? article.slug)
              ).length;
              const stageDone = stageArticles.length > 0 && completeCount === stageArticles.length;
              const stageProgress = stageArticles.length
                ? (completeCount / stageArticles.length) * 100
                : 0;

              return (
                <Box
                  component="article"
                  key={stage.id}
                  sx={{
                    py: { xs: 4, md: 5 },
                    gap: { xs: 2, md: 4 },
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '64px minmax(0, 1fr)' },
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ alignSelf: 'start' }}
                  >
                    {stageDone ? (
                      <Box sx={{ color: 'success.main', display: 'flex' }}>
                        <UiIcon icon="solar:check-circle-linear" width={28} />
                      </Box>
                    ) : (
                      <Typography variant="h5" sx={{ color: 'primary.main' }}>
                        {String(stage.order).padStart(2, '0')}
                      </Typography>
                    )}
                  </Stack>

                  <Box>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={2}
                      alignItems={{ sm: 'flex-start' }}
                      justifyContent="space-between"
                    >
                      <Box sx={{ maxWidth: 680 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {stage.eyebrow}
                        </Typography>
                        <Typography component="h2" variant="h5" sx={{ mt: 0.5 }}>
                          {stage.title}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                          {stage.description}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1.25, color: 'text.primary' }}>
                          {stage.objective}
                        </Typography>
                        {stage.prerequisiteStageIds.length > 0 && (
                          <Typography variant="caption" sx={{ mt: 1.5, color: 'text.secondary' }}>
                            Oldin o‘rganing:{' '}
                            {stage.prerequisiteStageIds
                              .map((id) => stageTitles.get(id))
                              .filter(Boolean)
                              .join(' · ')}
                          </Typography>
                        )}
                      </Box>
                      <Stack direction="row" spacing={2.5} sx={{ flexShrink: 0 }}>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <UiIcon icon="solar:calendar-linear" width={17} />
                          <Typography variant="caption">{stage.duration}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <UiIcon icon="solar:book-2-linear" width={17} />
                          <Typography variant="caption">{stageArticles.length} mavzu</Typography>
                        </Stack>
                      </Stack>
                    </Stack>

                    <Stack divider={<Divider flexItem />} sx={{ mt: 3 }}>
                      {stageArticles.map((article) => {
                        const storageKey = article.sourceId ?? article.slug;
                        const isCompleted = completed.has(storageKey);
                        return (
                          <Stack
                            key={article.slug}
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                            sx={{ py: 1.5 }}
                          >
                            {isCompleted ? (
                              <Tooltip title="Yakunlangan">
                                <Box sx={{ p: 0.625, color: 'success.main', display: 'flex' }}>
                                  <UiIcon icon="solar:check-circle-bold" width={21} />
                                </Box>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Yakunlangan deb belgilash">
                                <IconButton
                                  size="small"
                                  aria-label={`“${article.title}” mavzusini yakunlangan deb belgilash`}
                                  onClick={() => completed.toggle(storageKey)}
                                >
                                  <UiIcon icon="solar:check-circle-linear" width={21} />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Box
                              component={RouterLink}
                              to={getArticlePath(article)}
                              sx={{
                                minWidth: 0,
                                flexGrow: 1,
                                color: 'text.primary',
                                textDecoration: 'none',
                                '&:hover h3': { color: 'primary.main' },
                              }}
                            >
                              <Typography component="h3" variant="subtitle2">
                                {article.title}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {article.difficulty} · {article.readTime} daqiqa
                              </Typography>
                            </Box>
                            <UiIcon icon="solar:alt-arrow-right-linear" width={18} />
                          </Stack>
                        );
                      })}
                    </Stack>

                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={2}
                      alignItems={{ sm: 'center' }}
                      justifyContent="space-between"
                      sx={{ mt: 2.5 }}
                    >
                      <Box sx={{ width: { xs: '100%', sm: 280 } }}>
                        <LinearProgress
                          variant="determinate"
                          value={stageProgress}
                          aria-label={`${stage.title} bosqichi ${Math.round(stageProgress)}% yakunlangan`}
                          sx={{ height: 4 }}
                        />
                        <Typography variant="caption" sx={{ mt: 0.75, color: 'text.secondary' }}>
                          {completeCount}/{stageArticles.length} yakunlangan
                        </Typography>
                      </Box>
                      {stageArticles[0] && (
                        <Button
                          component={RouterLink}
                          to={getArticlePath(stageArticles[0])}
                          endIcon={<UiIcon icon="solar:arrow-right-linear" width={17} />}
                        >
                          {completeCount ? 'Davom ettirish' : 'Boshlash'}
                        </Button>
                      )}
                    </Stack>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Box>

        <Divider sx={{ mt: { xs: 4, md: 6 }, mb: 4 }} />

        <Stack
          component="aside"
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ sm: 'flex-start' }}
          sx={{ maxWidth: 820 }}
        >
          <Box sx={{ color: 'primary.main', display: 'flex', mt: 0.25 }}>
            <UiIcon icon="solar:calendar-mark-linear" width={24} />
          </Box>
          <Box>
            <Typography variant="h6">Tezlik emas, izchillik muhim</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              Kuniga 30 daqiqa ajrating: 20 daqiqani darslikka, 10 daqiqani undagi tashqi mashqqa
              sarflang. Tushunmagan joyingizga qaytish — ortga ketish emas.
            </Typography>
          </Box>
        </Stack>
      </Container>
    </>
  );
}
