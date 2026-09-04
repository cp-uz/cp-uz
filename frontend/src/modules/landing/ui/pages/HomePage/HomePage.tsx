import type { FormEvent } from 'react';
import type { LearningStats } from 'modules/learning/domain';

import { useState } from 'react';
import { Seo } from 'shared/ui/Seo';
import { UiIcon } from 'shared/ui/UiIcon';
import { appRoutes } from 'shared/config';
import { useAsyncData } from 'shared/hooks';
import { SeasonPreview } from 'modules/seasons';
import { useNavigate, Link as RouterLink } from 'react-router';
import { learningQueries as learningApi } from 'modules/learning/application';
import { roadmapStages, getArticlePath, presentRootCategories } from 'modules/learning/domain';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { FeedbackSection } from './FeedbackSection';

const emptyStats: LearningStats = {
  articleCount: 0,
  categoryCount: 0,
  practiceReferenceCount: 0,
  publishedCount: 0,
  draftCount: 0,
};

const metricItems = [
  { key: 'articleCount' as const, label: 'maqola' },
  { key: 'categoryCount' as const, label: 'asosiy bo‘lim' },
  { key: 'practiceReferenceCount' as const, label: 'mashq havolasi' },
];

type TeamMember = {
  name: string;
  role: string;
  image: string;
};

const teamMembers: readonly TeamMember[] = [
  {
    name: 'Asadullo Ganiev',
    role: 'Founder',
    image: '/assets/team/asadullo-ganiev.webp',
  },
  {
    name: 'Dilshodbek Khujaev',
    role: 'Content maker & Coordinator',
    image: '/assets/team/dilshodbek-khujaev.webp?v=20260904-2',
  },
  {
    name: 'Nazarbek Baltabaev',
    role: 'Developer',
    image: '/assets/team/nazarbek-baltabaev.webp',
  },
  {
    name: 'Davlatbek Mirakilov',
    role: 'Content maker, Developer',
    image: '/assets/team/davlatbek-mirakilov.webp',
  },
  {
    name: 'Dilyorbek Valijanov',
    role: 'Developer, Hacker',
    image: '/assets/team/dilyorbek-valijanov.webp?v=20260904-2',
  },
  {
    name: 'Ulugbek Abdimanabov',
    role: 'Content maker',
    image: '/assets/team/ulugbek-abdimanabov.webp',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
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

  const submit = (event: FormEvent) => {
    event.preventDefault();
    navigate(appRoutes.algorithmSearch(query));
  };

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

      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 9 } }}>
        <Box
          sx={{
            gap: { md: 6, lg: 8 },
            display: 'grid',
            alignItems: 'center',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.45fr) minmax(300px, 0.55fr)' },
          }}
        >
          <Box sx={{ maxWidth: 760 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
              <Typography component="span" variant="subtitle2" sx={{ color: 'primary.dark' }}>
                Ochiq tekshiruv · O‘zbekcha bilim ombori
              </Typography>
            </Stack>
            <Typography component="h1" variant="h2" sx={{ mt: 2.5, maxWidth: 780 }}>
              cp uz; o‘zbek sport dasturchilari hamjamiyati
            </Typography>
            <Typography
              component="p"
              variant="h6"
              sx={{
                mt: 2,
                maxWidth: 720,
                color: 'text.secondary',
                fontWeight: 'fontWeightRegular',
              }}
            >
              Algoritmlar, ma’lumotlar tuzilmalari, olimpiada masalalari, mavsumlar va O‘zbekiston
              ishtirokchilarining rasmiy natijalari — barchasi o‘zbek tilida.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1.5, maxWidth: 720, color: 'text.secondary' }}>
              cp.uz musobaqa o‘tkazmaydi, yechimlarni qabul qilmaydi va ishtirokchilar reytingini
              yuritmaydi; masalalar tashqi judge platformalarda ishlanadi.
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              sx={{ mt: 4, alignItems: { sm: 'center' } }}
            >
              <Button
                component={RouterLink}
                to={appRoutes.algorithms}
                size="large"
                variant="contained"
                endIcon={<UiIcon icon="solar:arrow-right-linear" width={19} />}
              >
                Kutubxonani ochish
              </Button>
              <Button component={RouterLink} to={appRoutes.roadmap} size="large" color="inherit">
                Yo‘l xaritasidan boshlash
              </Button>
            </Stack>

            <Box component="form" onSubmit={submit} sx={{ mt: 5, maxWidth: 720 }}>
              <TextField
                fullWidth
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Masalan: segment daraxti, BFS yoki modul arifmetika"
                aria-label="Maqolalarni qidirish"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <UiIcon icon="solar:magnifer-linear" width={21} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton type="submit" color="primary" aria-label="Qidirish">
                          <UiIcon icon="solar:arrow-right-linear" width={20} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              sx={{ mt: 4, flexWrap: 'wrap', rowGap: 2 }}
            >
              {metricItems.map((item) => (
                <Box key={item.key} sx={{ pr: 3, '&:not(:first-of-type)': { px: 3 } }}>
                  <Typography component="p" variant="h4">
                    {statsLoading || statsError ? '—' : stats[item.key]}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.25, color: 'text.secondary' }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box
            aria-hidden
            sx={{
              height: 360,
              display: { xs: 'none', md: 'block' },
              position: 'relative',
              color: 'text.secondary',
              '& .cp-grid-line': { stroke: 'var(--palette-divider)' },
              '& .cp-axis-line': { stroke: 'var(--palette-text-secondary)' },
              '& .cp-graph-line': { stroke: 'var(--palette-primary-main)' },
              '& .cp-graph-node': {
                fill: 'var(--palette-background-paper)',
                stroke: 'var(--palette-primary-main)',
              },
              '& .cp-graph-node-muted': {
                fill: 'var(--palette-background-paper)',
                stroke: 'var(--palette-text-secondary)',
              },
              '& .cp-token': {
                fill: 'var(--palette-text-secondary)',
                fontSize: 13,
                fontFamily: 'JetBrains Mono Variable, monospace',
              },
              '& .cp-token-primary': { fill: 'var(--palette-primary-main)' },
            }}
          >
            <Box
              component="svg"
              viewBox="0 0 360 360"
              role="presentation"
              sx={{ width: '100%', height: '100%', overflow: 'visible' }}
            >
              <g className="cp-grid-line" fill="none" strokeWidth="1">
                {[52, 104, 156, 208, 260, 312].map((position) => (
                  <path key={`vertical-${position}`} d={`M ${position} 28 V 332`} />
                ))}
                {[48, 100, 152, 204, 256, 308].map((position) => (
                  <path key={`horizontal-${position}`} d={`M 28 ${position} H 332`} />
                ))}
              </g>
              <g className="cp-axis-line" fill="none" strokeWidth="1.2">
                <path d="M 28 308 H 338" />
                <path d="M 52 332 V 22" />
                <path d="m 331 303 7 5-7 5" />
                <path d="m 47 29 5-7 5 7" />
              </g>
              <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path
                  className="cp-graph-line"
                  d="M 91 239 L 143 160 L 218 202 L 286 111"
                  strokeWidth="1.8"
                />
                <path
                  className="cp-grid-line"
                  d="M 91 239 L 218 202 M 143 160 L 286 111"
                  strokeWidth="1.2"
                />
                <path
                  className="cp-grid-line"
                  d="M 218 202 L 297 257"
                  strokeWidth="1.2"
                  strokeDasharray="5 6"
                />
              </g>
              <g strokeWidth="2">
                <circle className="cp-graph-node" cx="91" cy="239" r="7" />
                <circle className="cp-graph-node" cx="143" cy="160" r="7" />
                <circle className="cp-graph-node" cx="218" cy="202" r="7" />
                <circle className="cp-graph-node" cx="286" cy="111" r="7" />
                <circle className="cp-graph-node-muted" cx="297" cy="257" r="6" />
              </g>
              <g className="cp-token">
                <text x="64" y="269">
                  (1, 2)
                </text>
                <text className="cp-token-primary" x="110" y="135">
                  dp[i]
                </text>
                <text x="233" y="195">
                  O(log n)
                </text>
                <text className="cp-token-primary" x="255" y="86">
                  {'{ u, v }'}
                </text>
                <text x="306" y="281">
                  ∞
                </text>
              </g>
            </Box>
          </Box>
        </Box>
      </Container>

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

      <SeasonPreview />

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

      <Box
        component="section"
        sx={{
          pb: { xs: 7, md: 9 },
          contentVisibility: 'auto',
          containIntrinsicSize: 'auto 180px',
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={(theme) => ({
              px: { xs: 2.5, md: 3 },
              py: 2.5,
              color: 'primary.darker',
              bgcolor: 'primary.lighter',
              borderRadius: 1.5,
              ...theme.applyStyles('dark', {
                color: 'primary.lighter',
                bgcolor: 'primary.darker',
              }),
            })}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ md: 'center' }}
              justifyContent="space-between"
            >
              <Box>
                <Typography component="h2" variant="subtitle1">
                  Tahrir holati ochiq ko‘rsatiladi
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 0.5, maxWidth: 800, color: 'inherit', opacity: 0.8 }}
                >
                  Kutubxonadagi {stats.articleCount || 'barcha'} maqola nashr qilingan. Hamjamiyat
                  tekshiruvi va tuzatish takliflari doim ochiq.
                </Typography>
              </Box>
              <Button
                component="a"
                href="https://github.com/cp-uz/cp-uz"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                endIcon={<UiIcon icon="solar:arrow-right-up-linear" width={18} />}
              >
                Hissa qo‘shish
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Box
        component="section"
        aria-labelledby="team-heading"
        sx={{
          py: { xs: 7, md: 9 },
          bgcolor: 'background.neutral',
          contentVisibility: 'auto',
          containIntrinsicSize: 'auto 1700px',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: { xs: 4, md: 5 }, maxWidth: 640 }}>
            <Typography component="span" variant="subtitle2" sx={{ color: 'primary.dark' }}>
              Platforma ortidagi insonlar
            </Typography>
            <Typography id="team-heading" component="h2" variant="h3" sx={{ mt: 1 }}>
              cp uz; jamoasi
            </Typography>
            <Typography sx={{ mt: 1.5, color: 'text.secondary' }}>
              O‘zbek sport dasturlash hamjamiyatini birga rivojlantirayotgan jamoa.
            </Typography>
          </Box>

          <Box
            sx={{
              gap: { xs: 4, sm: 3, md: 3.5 },
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(3, minmax(0, 1fr))',
              },
            }}
          >
            {teamMembers.map((member) => (
              <Box component="article" key={member.name}>
                <Box
                  component="img"
                  src={member.image}
                  alt={`${member.name} portreti`}
                  width={640}
                  height={640}
                  loading="lazy"
                  decoding="async"
                  sx={{
                    width: '100%',
                    display: 'block',
                    aspectRatio: '1 / 1',
                    objectFit: 'cover',
                    bgcolor: 'background.paper',
                  }}
                />
                <Typography component="h3" variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
                  {member.name}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                  {member.role}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <FeedbackSection />
    </>
  );
}
