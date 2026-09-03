import type { LearningArticle } from 'modules/learning/domain';

import { Seo } from 'shared/ui/Seo';
import { UiIcon } from 'shared/ui/UiIcon';
import { appRoutes } from 'shared/config';
import { useAsyncData } from 'shared/hooks';
import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router';
import { roadmapStages, getArticlePath } from 'modules/learning/domain';
import { authApi, getAuthSession, subscribeAuthSession } from 'modules/auth/application';
import {
  clearGlossaryQuizLocalData,
  learningQueries as learningApi,
} from 'modules/learning/application';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import { useLocalStorageList, clearLocalEngagementData } from '../../../application';

const roadmapSlugs = roadmapStages.flatMap((stage) => stage.articleSlugs);

function matchesRoadmap(article: LearningArticle) {
  const publicParts = article.publicPath?.split('/').filter(Boolean) ?? [];
  const routeParts = article.route?.split('/').filter(Boolean) ?? [];
  const sourceParts = article.sourceId?.split('--') ?? [];
  const publicSlug = publicParts[publicParts.length - 1]?.replace(/\.html$/i, '');
  const routeSlug = routeParts[routeParts.length - 1]?.replace(/\.html$/i, '');
  const sourceSlug = sourceParts[sourceParts.length - 1];

  const normalize = (value?: string) =>
    value
      ?.toLocaleLowerCase('uz')
      .replace(/\.html$/i, '')
      .replace(/_/g, '-') ?? '';
  const candidates = [article.sourceId, article.slug, publicSlug, routeSlug, sourceSlug].map(
    normalize
  );

  return roadmapSlugs.some((slug) => candidates.includes(normalize(slug)));
}

function ReadingList({ items }: { items: LearningArticle[] }) {
  return (
    <Stack divider={<Divider flexItem />}>
      {items.map((article) => (
        <Stack
          key={article.sourceId ?? article.slug}
          component={RouterLink}
          to={getArticlePath(article)}
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{
            py: 2,
            color: 'text.primary',
            textDecoration: 'none',
            '&:hover h3': { color: 'primary.main' },
          }}
        >
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography component="h3" variant="subtitle2">
              {article.title}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {article.category} · {article.readTime} daqiqa
            </Typography>
          </Box>
          <UiIcon icon="solar:alt-arrow-right-linear" width={18} />
        </Stack>
      ))}
    </Stack>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [session, setSession] = useState(() => getAuthSession());
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deletePending, setDeletePending] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const { data: liveArticles } = useAsyncData(learningApi.listArticles, [], []);
  const completed = useLocalStorageList('cpuz:completed', []);
  const bookmarks = useLocalStorageList('cpuz:bookmarks', []);
  const roadmapArticles = liveArticles.filter(matchesRoadmap);
  const completedRoadmapCount = roadmapArticles.filter((article) =>
    completed.has(article.sourceId ?? article.slug)
  ).length;
  const completedArticles = liveArticles.filter((article) =>
    completed.has(article.sourceId ?? article.slug)
  );
  const bookmarkedArticles = liveArticles.filter((article) =>
    bookmarks.has(article.sourceId ?? article.slug)
  );
  const progress = roadmapArticles.length
    ? Math.min(100, Math.round((completedRoadmapCount / roadmapArticles.length) * 100))
    : 0;
  const sessionLabel = session
    ? session.user.isGuest
      ? `Mehmon sessiyasi · ${session.user.username}`
      : `@${session.user.username}`
    : 'Mahalliy o‘qish holati';

  useEffect(() => subscribeAuthSession(setSession), []);

  const closeDelete = () => {
    if (deletePending) return;
    setDeleteOpen(false);
    setDeleteConfirmation('');
    setDeletePassword('');
    setDeleteError('');
  };

  const deleteAccount = async () => {
    if (
      deleteConfirmation !== 'O‘CHIRISH' ||
      (session && !session.user.isGuest && !deletePassword)
    ) {
      return;
    }
    setDeletePending(true);
    setDeleteError('');
    try {
      await authApi.deleteAccount({
        confirmation: 'O‘CHIRISH',
        ...(deletePassword ? { password: deletePassword } : {}),
      });
      clearLocalEngagementData();
      clearGlossaryQuizLocalData();
      navigate('/', { replace: true });
    } catch (reason) {
      setDeleteError(reason instanceof Error ? reason.message : 'Akkauntni o‘chirib bo‘lmadi.');
    } finally {
      setDeletePending(false);
    }
  };

  return (
    <>
      <Seo
        title="Mening profilim"
        description="O‘qish holati, yakunlangan darsliklar va saqlangan maqolalar."
        path={appRoutes.profile}
        robots="noindex,nofollow"
      />

      <Container maxWidth="xl" sx={{ pt: { xs: 5, md: 7 }, pb: { xs: 7, md: 10 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ sm: 'flex-start' }}
          justifyContent="space-between"
        >
          <Box sx={{ maxWidth: 720 }}>
            <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
              {sessionLabel}
            </Typography>
            <Typography component="h1" variant="h3" sx={{ mt: 1.5 }}>
              O‘qish holati
            </Typography>
            <Typography sx={{ mt: 1.5, color: 'text.secondary' }}>
              Sport dasturlash darsliklaridagi yakunlangan mavzular va saqlangan maqolalar shu yerda
              ko‘rsatiladi.
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            to={appRoutes.login}
            color="inherit"
            startIcon={
              <UiIcon
                icon={session ? 'solar:settings-linear' : 'solar:login-2-linear'}
                width={19}
              />
            }
            sx={{ flexShrink: 0 }}
          >
            {session ? 'Sessiyani boshqarish' : 'Kirish yoki mehmon sifatida davom etish'}
          </Button>
        </Stack>

        <Divider sx={{ my: { xs: 4, md: 5 } }} />

        <Box
          sx={{
            gap: { xs: 3, md: 7 },
            display: 'grid',
            alignItems: 'center',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(300px, 0.65fr)' },
          }}
        >
          <Box>
            <Stack direction="row" alignItems="baseline" justifyContent="space-between">
              <Box>
                <Typography variant="h5">Yo‘l xaritasi</Typography>
                <Typography variant="body2" sx={{ mt: 0.75, color: 'text.secondary' }}>
                  {completedRoadmapCount} / {roadmapArticles.length} ta asosiy darslik yakunlangan
                </Typography>
              </Box>
              <Typography variant="h4">{progress}%</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progress}
              aria-label={`O‘qish yo‘li ${progress}% yakunlangan`}
              sx={{ mt: 2, height: 6 }}
            />
          </Box>
          <Box sx={{ pl: { md: 5 }, borderLeft: { md: 1 }, borderColor: { md: 'divider' } }}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <Box sx={{ color: 'primary.main', display: 'flex', mt: 0.25 }}>
                <UiIcon
                  icon={session ? 'solar:user-check-linear' : 'solar:cloud-linear'}
                  width={23}
                />
              </Box>
              <Box>
                <Typography variant="subtitle1">
                  {session
                    ? session.user.isGuest
                      ? 'Mehmon sessiyasi faol'
                      : 'Akkauntga kirgansiz'
                    : 'Akkauntga kirmagansiz'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                  {session
                    ? session.user.isGuest
                      ? `Mehmon sessiyasi ${session.user.username} nomi bilan saqlangan.`
                      : `O‘qish holati @${session.user.username} akkauntida saqlanmoqda.`
                    : 'Hozirgi holat faqat shu brauzerning mahalliy xotirasida saqlanmoqda.'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.75, color: 'text.secondary' }}>
                  {bookmarkedArticles.length} ta maqola saqlangan.
                </Typography>
              </Box>
            </Stack>
            <Button
              component={RouterLink}
              to={appRoutes.roadmap}
              endIcon={<UiIcon icon="solar:arrow-right-linear" width={17} />}
              sx={{ mt: 1.5 }}
            >
              Yo‘l xaritasini ochish
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            pt: { xs: 7, md: 9 },
            gap: { xs: 6, md: 8 },
            display: 'grid',
            alignItems: 'start',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          }}
        >
          <Box component="section">
            <Stack direction="row" alignItems="baseline" justifyContent="space-between">
              <Typography variant="h5">Yakunlangan mavzular</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {completedArticles.length} ta
              </Typography>
            </Stack>
            <Divider sx={{ mt: 2 }} />

            {completedArticles.length > 0 ? (
              <ReadingList items={completedArticles} />
            ) : (
              <Box sx={{ py: 5 }}>
                <Box sx={{ color: 'primary.main', display: 'flex' }}>
                  <UiIcon icon="solar:check-circle-linear" width={30} />
                </Box>
                <Typography variant="subtitle1" sx={{ mt: 1.5 }}>
                  Hozircha yakunlangan mavzu yo‘q
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.75, color: 'text.secondary' }}>
                  Darslikni o‘qib bo‘lgach, “Yakunlandi” tugmasini bosing.
                </Typography>
                <Button component={RouterLink} to={appRoutes.roadmap} sx={{ mt: 1.5, px: 0 }}>
                  Birinchi bosqichni ko‘rish
                </Button>
              </Box>
            )}
          </Box>

          <Box component="section">
            <Stack direction="row" alignItems="baseline" justifyContent="space-between">
              <Typography variant="h5">Saqlangan maqolalar</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {bookmarkedArticles.length} ta
              </Typography>
            </Stack>
            <Divider sx={{ mt: 2 }} />

            {bookmarkedArticles.length > 0 ? (
              <>
                <ReadingList items={bookmarkedArticles.slice(0, 6)} />
                <Button
                  component={RouterLink}
                  to={appRoutes.saved}
                  endIcon={<UiIcon icon="solar:arrow-right-linear" width={17} />}
                  sx={{ mt: 2, px: 0 }}
                >
                  Barcha saqlanganlarni ko‘rish
                </Button>
              </>
            ) : (
              <Box sx={{ py: 5 }}>
                <Box sx={{ color: 'primary.main', display: 'flex' }}>
                  <UiIcon icon="solar:bookmark-linear" width={30} />
                </Box>
                <Typography variant="subtitle1" sx={{ mt: 1.5 }}>
                  Hozircha maqola saqlanmagan
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.75, color: 'text.secondary' }}>
                  Kerakli darslik yonidagi xatcho‘p belgisini bosing.
                </Typography>
                <Button component={RouterLink} to={appRoutes.algorithms} sx={{ mt: 1.5, px: 0 }}>
                  Kutubxonani ochish
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        {session && (
          <Box
            component="section"
            aria-labelledby="delete-account-title"
            sx={{ pt: { xs: 7, md: 9 } }}
          >
            <Divider sx={{ mb: { xs: 4, md: 5 } }} />
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ sm: 'center' }}
              justifyContent="space-between"
            >
              <Box sx={{ maxWidth: 680 }}>
                <Typography id="delete-account-title" variant="h5">
                  Akkauntni butunlay o‘chirish
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  Profil, o‘qish holati, saqlangan maqolalar, shaxsiy qaydlar va mini test
                  natijalari qayta tiklab bo‘lmaydigan tarzda o‘chiriladi.
                </Typography>
              </Box>
              <Button
                color="error"
                startIcon={<UiIcon icon="solar:trash-bin-trash-linear" width={19} />}
                onClick={() => setDeleteOpen(true)}
                sx={{ flexShrink: 0 }}
              >
                Akkauntni o‘chirish
              </Button>
            </Stack>
          </Box>
        )}
      </Container>

      <Dialog open={deleteOpen} onClose={closeDelete} fullWidth maxWidth="xs">
        <DialogTitle>Akkauntni butunlay o‘chirish</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Bu amalni bekor qilib bo‘lmaydi. Tasdiqlash uchun quyidagi maydonga
            <strong> O‘CHIRISH</strong> deb yozing.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Tasdiqlash"
            value={deleteConfirmation}
            onChange={(event) => setDeleteConfirmation(event.target.value)}
            disabled={deletePending}
            autoComplete="off"
            sx={{ mt: 2.5 }}
          />
          {session && !session.user.isGuest && (
            <TextField
              fullWidth
              type="password"
              label="Joriy parol"
              value={deletePassword}
              onChange={(event) => setDeletePassword(event.target.value)}
              disabled={deletePending}
              autoComplete="current-password"
              sx={{ mt: 2 }}
            />
          )}
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={closeDelete} disabled={deletePending}>
            Bekor qilish
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={
              deleteConfirmation !== 'O‘CHIRISH' ||
              Boolean(session && !session.user.isGuest && !deletePassword) ||
              deletePending
            }
            onClick={() => void deleteAccount()}
            startIcon={deletePending ? <CircularProgress size={17} color="inherit" /> : undefined}
          >
            Butunlay o‘chirish
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
