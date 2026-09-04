import type { LearningStats } from 'modules/learning/domain';

import { Seo } from 'shared/ui/Seo';
import { lazy, Suspense } from 'react';
import { useAsyncData } from 'shared/hooks';
import { presentRootCategories } from 'modules/learning/domain';
import { learningQueries as learningApi } from 'modules/learning/application';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { HomeHero } from './sections/HomeHero';
import { HomeTeam } from './sections/HomeTeam';
import { HomeCategories } from './sections/HomeCategories';
import { DeferredViewport } from './sections/DeferredViewport';
import { HomeLearningPaths } from './sections/HomeLearningPaths';
import { ContributionBanner } from './sections/ContributionBanner';

const SeasonPreview = lazy(() =>
  import('modules/seasons/preview').then((module) => ({
    default: module.SeasonPreview,
  }))
);
const FeedbackSection = lazy(() =>
  import('./FeedbackSection').then((module) => ({ default: module.FeedbackSection }))
);

const emptyStats: LearningStats = {
  articleCount: 0,
  categoryCount: 0,
  practiceReferenceCount: 0,
  publishedCount: 0,
  draftCount: 0,
};

export default function HomePage() {
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
  } = useAsyncData(learningApi.getStats, emptyStats, []);
  const { data: liveCategories, error: categoryLoadError } = useAsyncData(
    learningApi.listCategories,
    [],
    []
  );
  const { data: liveArticles, error: articleLoadError } = useAsyncData(
    learningApi.listArticles,
    [],
    []
  );
  const rootCategories = presentRootCategories(liveCategories);

  return (
    <>
      <Seo
        title="cp uz; o‘zbek sport dasturchilari hamjamiyati"
        description="cp.uz — algoritmlar, olimpiada masalalari, mavsumlar va O‘zbekiston ishtirokchilarining rasmiy natijalari jamlangan o‘zbekcha ochiq bilim ombori."
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Organization',
              '@id': 'https://cp.uz/#organization',
              name: 'cp.uz',
              url: 'https://cp.uz/',
              logo: 'https://cp.uz/assets/brand/cpuz-logo.png',
            },
            {
              '@type': 'WebSite',
              '@id': 'https://cp.uz/#website',
              name: 'cp.uz',
              alternateName: ['cp uz', 'O‘zbek sport dasturlash hamjamiyati'],
              url: 'https://cp.uz/',
              inLanguage: 'uz-Latn',
              publisher: { '@id': 'https://cp.uz/#organization' },
              description:
                'Algoritmlar, olimpiada masalalari, mavsumlar va O‘zbekiston ishtirokchilarining rasmiy natijalari jamlangan o‘zbekcha bilim ombori. cp.uz musobaqa o‘tkazmaydi, yechim qabul qilmaydi va ishtirokchilar reytingini yuritmaydi.',
              keywords: [
                'sport dasturlash',
                'algoritmlar',
                'ma’lumotlar tuzilmalari',
                'olimpiada masalalari',
                'O‘zbekiston olimpiada natijalari',
              ],
            },
          ],
        }}
      />
      <HomeHero stats={stats} statsLoading={statsLoading} statsError={statsError} />
      {(statsError || categoryLoadError || articleLoadError) && (
        <Container maxWidth="xl" sx={{ pb: 3 }}>
          <Box
            sx={{
              px: 2.5,
              py: 2,
              bgcolor: 'error.lighter',
              color: 'error.darker',
              borderRadius: 1,
            }}
          >
            <Typography variant="body2">
              Kutubxona ma’lumotlarini yuklab bo‘lmadi. Server bilan ulanishni tekshirib, sahifani
              yangilang.
            </Typography>
          </Box>
        </Container>
      )}

      <DeferredViewport minHeight={760}>
        {() => (
          <Suspense fallback={<Box sx={{ minHeight: 760 }} />}>
            <SeasonPreview />
          </Suspense>
        )}
      </DeferredViewport>
      <DeferredViewport minHeight={2600}>
        {() => (
          <>
            <HomeCategories
              rootCategories={rootCategories}
              stats={stats}
              statsLoading={statsLoading}
              statsError={statsError}
            />
            <HomeLearningPaths liveArticles={liveArticles} />
            <ContributionBanner articleCount={stats.articleCount} />
          </>
        )}
      </DeferredViewport>
      <DeferredViewport minHeight={2100}>
        {() => (
          <>
            <HomeTeam />
            <Suspense fallback={<Box sx={{ minHeight: 520 }} />}>
              <FeedbackSection />
            </Suspense>
          </>
        )}
      </DeferredViewport>
    </>
  );
}
