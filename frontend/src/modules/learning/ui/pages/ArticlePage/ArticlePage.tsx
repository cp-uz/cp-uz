import { Seo } from 'shared/ui/Seo';
import { UiIcon } from 'shared/ui/UiIcon';
import { appRoutes } from 'shared/config';
import { useAsyncData } from 'shared/hooks';
import { formatUzbekDate } from 'shared/lib/i18n';
import { useAuthSession } from 'modules/auth/application';
import { useRef, useMemo, useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router';
import { engagementApi, useLocalStorageList } from 'modules/engagement/application';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import LinearProgress from '@mui/material/LinearProgress';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { getArticlePath } from '../../../domain';
import { learningQueries as learningApi } from '../../../application';
import { CodeBlock, RichMarkdown, extractMarkdownHeadings } from '../../shared';

const cppCode = `// Birinchi true qiymatni topish
long long l = -1, r = n;
while (l + 1 < r) {
    long long m = l + (r - l) / 2;
    if (ok(m)) r = m;
    else l = m;
}`;

const pythonCode = `# Birinchi True qiymatni topish
left, right = -1, n
while left + 1 < right:
    middle = left + (right - left) // 2
    if ok(middle): right = middle
    else: left = middle`;

const binarySearchFallback = `
## Asosiy g‘oya

Tartiblangan fazoda javobni izlayotgan bo‘lsak, o‘rtadagi qiymat qidiruvning qaysi yarmini tashlash mumkinligini ko‘rsatadi. Har bir qadamdan keyin oraliq ikki baravar kamayadi:

$$n \\to n/2 \\to n/4 \\to \\dots \\to 1$$

Shu sabab qadamlar soni $\\lceil \\log_2 n \\rceil$ dan oshmaydi.

> Ikkilik qidiruv faqat massivda qidirish emas. U **yolg‘on, yolg‘on, …, rost, rost** ko‘rinishidagi istalgan monoton qaror chegarasini topadi.

## Invariant

Eng ishonchli dasturiy yechimda ikki chegaraning ma’nosi sikl davomida o‘zgarmaydi: $ok(l)=false$ va $ok(r)=true$. O‘rta nuqta $m$ tekshirilganda predikat rost bo‘lsa $r=m$, aks holda $l=m$ qilamiz.

Sikl $l+1=r$ bo‘lganda tugaydi. Invariantga ko‘ra, $r$ — birinchi rost pozitsiya.

## Javob bo‘yicha qidiruv

Ba’zan qidirilayotgan qiymat massivda yo‘q. Masalan, **k ta mahsulotni tayyorlash uchun eng kam vaqt qancha?** Vaqt $t$ berilganda yetarli mahsulot ishlab chiqarish mumkinligini tekshira olsak, javobning o‘zida qidiramiz.

Predikat monoton: agar $t$ vaqtda mumkin bo‘lsa, $t+1$ vaqtda ham mumkin. Birinchi **rost** qiymat minimal javob bo‘ladi.

## Murakkablik va xatolar

Vaqt murakkabligi $O(\\log n)$, qo‘shimcha xotira esa $O(1)$. Eng ko‘p uchraydigan xatolar:

- invariantni oldindan aniq belgilamaslik;
- sikl tugash shartini noto‘g‘ri yozish;
- monoton bo‘lmagan predikatda ikkilik qidiruv ishlatish;
- katta sonlarda **(l + r) / 2** son turining sig‘imidan oshishini unutish.
`;

function displayContributorName(name: string) {
  const automatedActor = /^(import[-_]|pipeline[-_])|openai|gpt[-_\d]|translation[-_]bot/i;
  return automatedActor.test(name.trim()) ? 'cp.uz tarjima jamoasi' : name;
}

export default function ArticlePage() {
  const session = useAuthSession();
  const hasSession = Boolean(session);
  const sessionUserId = session?.user.id;
  const { slug = 'binary-search', category } = useParams();
  const {
    data: article,
    loading: articleLoading,
    error: articleLoadError,
  } = useAsyncData(() => learningApi.getArticle(slug, category), null, [category, slug]);
  const { data: allArticles } = useAsyncData(learningApi.listArticles, [], []);
  const bookmarks = useLocalStorageList('cpuz:bookmarks', []);
  const completed = useLocalStorageList('cpuz:completed', []);
  const [viewportProgress, setViewportProgress] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);
  const [progressHydrated, setProgressHydrated] = useState(false);
  const [hydratedArticleKey, setHydratedArticleKey] = useState('');
  const progressWriteQueue = useRef<Promise<unknown>>(Promise.resolve());
  const lastQueuedProgress = useRef(0);
  const completionSyncedFor = useRef('');
  const [activeSection, setActiveSection] = useState('');
  const [notesOpen, setNotesOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [revisionsOpen, setRevisionsOpen] = useState(false);
  const [note, setNote] = useState(() => localStorage.getItem(`cpuz:note:${slug}`) ?? '');
  const [noteId, setNoteId] = useState<number | string>();
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteError, setNoteError] = useState('');
  const isBinaryFallback = article?.slug === 'binary-search' && !article.content;
  const articleKey = article?.sourceId ?? article?.slug ?? slug;
  const canNativeShare = Reflect.has(navigator, 'share');

  const readerContent = useMemo(() => {
    const content = article?.content?.replace(/^#\s+.+(?:\r?\n)+/, '').trim();
    if (content) return content;
    if (isBinaryFallback) return binarySearchFallback;
    return `## Darslik haqida\n\n${article?.summary ?? ''}\n\nDarslikning to‘liq matni yuklanmadi. Sahifani yangilab ko‘ring.`;
  }, [article?.content, article?.summary, isBinaryFallback]);

  const practices = article?.practiceReferences ?? [];

  const tocItems = useMemo(() => {
    const headings = extractMarkdownHeadings(readerContent);
    return practices.length
      ? [...headings, { id: 'mashqlar', label: 'Mashq qilish', level: 2 }]
      : headings;
  }, [practices.length, readerContent]);

  useEffect(() => {
    const onScroll = () => {
      const main = document.getElementById('reader-content');
      if (!main) return;
      const available = Math.max(1, main.offsetHeight - window.innerHeight);
      const currentProgress = Math.max(
        0,
        Math.min(100, ((window.scrollY - main.offsetTop) / available) * 100)
      );
      setViewportProgress(currentProgress);
      setReadingProgress((previous) => Math.max(previous, currentProgress));
      let current = tocItems[0]?.id ?? '';
      tocItems.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element && element.getBoundingClientRect().top <= 160) current = item.id;
      });
      setActiveSection(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [tocItems]);

  useEffect(() => {
    if (!article || !window.location.hash) return undefined;
    const targetId = decodeURIComponent(window.location.hash.slice(1));
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [article, articleKey, readerContent]);

  useEffect(() => {
    let active = true;
    const storageKey = `cpuz:reading-progress:${articleKey}`;
    const stored = Number(localStorage.getItem(storageKey) ?? 0);
    let locallyCompleted = false;
    try {
      const values = JSON.parse(localStorage.getItem('cpuz:completed') ?? '[]');
      locallyCompleted = Array.isArray(values) && values.includes(articleKey);
    } catch {
      locallyCompleted = false;
    }
    const initialProgress = Math.max(
      Number.isFinite(stored) ? Math.min(100, Math.max(0, stored)) : 0,
      locallyCompleted ? 100 : 0
    );

    setViewportProgress(0);
    setReadingProgress(initialProgress);
    setProgressHydrated(false);
    setHydratedArticleKey('');
    lastQueuedProgress.current = 0;
    completionSyncedFor.current = locallyCompleted ? articleKey : '';

    if (!hasSession) {
      setProgressHydrated(true);
      setHydratedArticleKey(articleKey);
      return () => {
        active = false;
      };
    }

    engagementApi
      .listProgress()
      .then((entries) => {
        if (!active) return;
        const saved = entries.find((item) => item.articleSlug === articleKey)?.percent ?? 0;
        lastQueuedProgress.current = saved;
        setReadingProgress((previous) => Math.max(previous, saved));
      })
      .catch(() => {
        // The anonymous/local high-water mark remains available while offline.
      })
      .finally(() => {
        if (active) {
          setProgressHydrated(true);
          setHydratedArticleKey(articleKey);
        }
      });

    return () => {
      active = false;
    };
  }, [articleKey, hasSession, sessionUserId]);

  useEffect(() => {
    const rounded = Math.min(100, Math.max(0, Math.floor(readingProgress)));
    localStorage.setItem(`cpuz:reading-progress:${articleKey}`, String(rounded));
    if (!progressHydrated || hydratedArticleKey !== articleKey) return;

    const throttled = rounded >= 100 ? 100 : Math.floor(rounded / 5) * 5;
    if (throttled <= lastQueuedProgress.current) return;
    lastQueuedProgress.current = throttled;
    progressWriteQueue.current = progressWriteQueue.current
      .catch(() => undefined)
      .then(() => engagementApi.setProgress(articleKey, throttled));
  }, [articleKey, hydratedArticleKey, progressHydrated, readingProgress]);

  useEffect(() => {
    if (readingProgress < 100 || completed.has(articleKey)) return;
    if (completionSyncedFor.current === articleKey) return;
    completionSyncedFor.current = articleKey;
    completed.toggle(articleKey);
  }, [articleKey, completed, readingProgress]);

  useEffect(() => {
    let active = true;
    const localNote =
      localStorage.getItem(`cpuz:note:${articleKey}`) ??
      localStorage.getItem(`cpuz:note:${slug}`) ??
      '';
    setNote(localNote);
    setNoteId(undefined);
    setNoteError('');

    if (hasSession) {
      engagementApi
        .listNotes()
        .then((entries) => {
          if (!active) return;
          const entry = entries.find((item) => item.articleSlug === articleKey);
          if (entry) {
            setNote(entry.body);
            setNoteId(entry.id);
          }
        })
        .catch(() => {
          // The local note remains editable while the API is unavailable.
        });
    }

    return () => {
      active = false;
    };
  }, [articleKey, hasSession, sessionUserId, slug]);

  if (!article) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <UiIcon
          icon={
            articleLoadError ? 'solar:server-square-cloud-linear' : 'solar:document-text-linear'
          }
          width={44}
        />
        <Typography component="h1" variant="h4" sx={{ mt: 2 }}>
          {articleLoading ? 'Darslik yuklanmoqda…' : 'Darslikni yuklab bo‘lmadi'}
        </Typography>
        {articleLoadError && (
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Server bilan ulanishni yoki manzil to‘g‘riligini tekshiring.
          </Typography>
        )}
      </Container>
    );
  }

  const isHumanReviewed =
    article.reviewState?.technical === 'approved' && article.reviewState?.language === 'approved';
  const reviewLabel = isHumanReviewed ? 'Tekshiruvdan o‘tgan tarjima' : 'AI-tarjima';
  const sourceLinks = [
    article.sourceUrl
      ? {
          label: 'Original maqola',
          site: 'cp-algorithms.com',
          href: article.sourceUrl,
        }
      : null,
    article.russianSourceUrl
      ? {
          label: 'Ruscha',
          site: 'e-maxx.ru',
          href: article.russianSourceUrl,
        }
      : null,
  ].filter((item): item is { label: string; site: string; href: string } => Boolean(item));
  const contributors = (article.contributors ?? [])
    .map((item) => ({ ...item, name: displayContributorName(item.name) }))
    .filter(
      (item, index, items) => items.findIndex((candidate) => candidate.name === item.name) === index
    );
  const revisions = (article.revisions ?? []).map((revision) => ({
    ...revision,
    author: displayContributorName(revision.author),
  }));
  const progressReady = progressHydrated && hydratedArticleKey === articleKey;
  const isArticleCompleted = progressReady && (readingProgress >= 100 || completed.has(articleKey));
  const related = allArticles
    .filter(
      (item) =>
        (item.sourceId ?? item.slug) !== (article.sourceId ?? article.slug) &&
        (item.categoryId === article.categoryId ||
          item.tags.some((tag) => article.tags.includes(tag)))
    )
    .slice(0, 4);

  const saveNote = async () => {
    setNoteSaving(true);
    setNoteError('');
    try {
      if (note.trim()) localStorage.setItem(`cpuz:note:${articleKey}`, note);
      else localStorage.removeItem(`cpuz:note:${articleKey}`);

      if (note.trim()) {
        const saved = await engagementApi.saveNote(articleKey, note, noteId);
        setNoteId(saved.id);
      } else if (noteId !== undefined) {
        await engagementApi.removeNote(noteId);
        setNoteId(undefined);
      }
      setNotesOpen(false);
    } catch (reason) {
      setNoteError(reason instanceof Error ? reason.message : 'Qaydni saqlab bo‘lmadi.');
    } finally {
      setNoteSaving(false);
    }
  };

  const openShare = () => {
    setShareCopied(false);
    setShareOpen(true);
  };

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
  };

  const shareArticle = async () => {
    if (!canNativeShare) return;
    try {
      await navigator.share({ title: article.title, url: window.location.href });
    } catch (reason) {
      if (!(reason instanceof DOMException && reason.name === 'AbortError')) throw reason;
    }
  };

  const requestShare = async () => {
    const prefersNativeShare =
      canNativeShare && (window.innerWidth < 900 || window.matchMedia('(pointer: coarse)').matches);
    if (prefersNativeShare) {
      try {
        await shareArticle();
        return;
      } catch {
        // Fall back to the in-site copy dialog when the platform share UI fails.
      }
    }
    openShare();
  };

  return (
    <>
      <Seo title={article.title} description={article.summary} path={getArticlePath(article)} />
      {!!article.content && (
        <LinearProgress
          variant="determinate"
          value={viewportProgress}
          aria-label="Darslikdagi joriy o‘qish joyi"
          aria-valuetext={`${Math.round(viewportProgress)} foiz joyga yetildi`}
          sx={{
            position: 'fixed',
            zIndex: (theme) => theme.zIndex.appBar + 1,
            top: 0,
            left: 0,
            right: 0,
            height: 3,
          }}
        />
      )}

      <Container maxWidth="xl" sx={{ pt: { xs: 4, md: 6 }, pb: { xs: 4, md: 5 } }}>
        <Breadcrumbs separator="/" aria-label="Sahifa yo‘li" sx={{ mb: 3 }}>
          <Link component={RouterLink} to="/" underline="hover" color="text.secondary">
            Bosh sahifa
          </Link>
          <Link
            component={RouterLink}
            to={appRoutes.algorithms}
            underline="hover"
            color="text.secondary"
          >
            Algoritmlar
          </Link>
          <Typography variant="body2" color="text.primary">
            {article.category}
          </Typography>
        </Breadcrumbs>

        <Box sx={{ maxWidth: 900 }}>
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ flexWrap: 'wrap' }}>
            <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
              {article.category}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              ·
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {article.difficulty}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              ·
            </Typography>
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 1,
                color: isHumanReviewed ? 'success.dark' : 'warning.dark',
                bgcolor: isHumanReviewed ? 'success.lighter' : 'warning.lighter',
              }}
            >
              <UiIcon
                icon={
                  isHumanReviewed ? 'solar:verified-check-linear' : 'solar:magic-stick-3-linear'
                }
                width={16}
              />
              <Typography variant="caption" sx={{ color: 'inherit', fontWeight: 600 }}>
                {reviewLabel}
              </Typography>
            </Stack>
          </Stack>

          <Typography component="h1" variant="h3" sx={{ mt: 2 }}>
            {article.title}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mt: 1.5,
              maxWidth: 820,
              color: 'text.secondary',
              fontWeight: 'fontWeightRegular',
            }}
          >
            {article.summary}
          </Typography>

          {sourceLinks.length > 0 && (
            <Stack
              direction="row"
              useFlexGap
              flexWrap="wrap"
              spacing={{ xs: 1.5, sm: 2.5 }}
              sx={{ mt: 2.25 }}
            >
              {sourceLinks.map((source) => (
                <Link
                  key={source.href}
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{
                    gap: 0.75,
                    display: 'inline-flex',
                    alignItems: 'center',
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                    textUnderlineOffset: 3,
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  <Box
                    component="img"
                    src="/assets/brands/cp-algorithms-favicon.ico"
                    alt=""
                    aria-hidden="true"
                    sx={{ width: 16, height: 16, objectFit: 'contain' }}
                  />
                  <span>
                    {source.label}: {source.site}
                  </span>
                  <UiIcon icon="solar:arrow-right-up-linear" width={15} />
                </Link>
              ))}
            </Stack>
          )}

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 2.5 }}
            alignItems={{ sm: 'center' }}
            sx={{ mt: 3 }}
          >
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              sx={{ color: 'text.secondary' }}
            >
              <UiIcon icon="solar:users-group-rounded-linear" width={18} />
              <Typography variant="body2" sx={{ color: 'inherit' }}>
                {contributors.length
                  ? contributors.map((item) => item.name).join(', ')
                  : 'cp.uz tarjima jamoasi'}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              sx={{ color: 'text.secondary' }}
            >
              <UiIcon icon="solar:clock-circle-linear" width={18} />
              <Typography variant="body2" sx={{ color: 'inherit' }}>
                {article.readTime} daqiqada o‘qiladi
              </Typography>
            </Stack>
            {article.updatedAt && (
              <Stack
                direction="row"
                spacing={0.75}
                alignItems="center"
                sx={{ color: 'text.secondary' }}
              >
                <UiIcon icon="solar:calendar-linear" width={18} />
                <Typography variant="body2" sx={{ color: 'inherit' }}>
                  Yangilangan: {formatUzbekDate(article.updatedAt)}
                </Typography>
              </Stack>
            )}
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mt: 3, flexWrap: 'wrap' }}>
            <Button
              color={bookmarks.has(articleKey) ? 'primary' : 'inherit'}
              variant="soft"
              onClick={() => bookmarks.toggle(articleKey)}
              startIcon={
                <UiIcon
                  icon={bookmarks.has(articleKey) ? 'solar:bookmark-bold' : 'solar:bookmark-linear'}
                  width={18}
                />
              }
            >
              {bookmarks.has(articleKey) ? 'Saqlangan' : 'Saqlash'}
            </Button>
            <Button
              color={note.trim() ? 'primary' : 'inherit'}
              variant="soft"
              onClick={() => setNotesOpen(true)}
              startIcon={
                <UiIcon icon={note.trim() ? 'solar:notes-bold' : 'solar:notes-linear'} width={18} />
              }
            >
              {note.trim() ? 'Qayd bor' : 'Qayd'}
            </Button>
            <Button
              color="inherit"
              onClick={() => void requestShare()}
              startIcon={<UiIcon icon="solar:share-linear" width={18} />}
            >
              Ulashish
            </Button>
          </Stack>

          {!!article.prerequisites.length && (
            <Stack direction="row" spacing={1} sx={{ mt: 3, flexWrap: 'wrap' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Oldindan bilish foydali:
              </Typography>
              {article.prerequisites.map((item) => (
                <Link
                  key={item}
                  component={RouterLink}
                  to={appRoutes.algorithmSearch(item)}
                  variant="body2"
                  underline="hover"
                >
                  {item}
                </Link>
              ))}
            </Stack>
          )}
        </Box>
      </Container>

      <Divider />

      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            gap: { md: 4, lg: 6 },
            display: 'grid',
            alignItems: 'start',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '190px minmax(0, 720px) 48px' },
            justifyContent: 'center',
          }}
        >
          <Box
            component="aside"
            sx={{
              position: 'sticky',
              top: 88,
              alignSelf: 'start',
              maxHeight: 'calc(100vh - 112px)',
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
            }}
          >
            <Typography variant="subtitle2">Mundarija</Typography>
            <Stack sx={{ mt: 1.5, minHeight: 0, overflowY: 'auto', pr: 1 }}>
              {tocItems.map((item) => (
                <Box
                  key={item.id}
                  component="a"
                  href={`#${item.id}`}
                  sx={{
                    py: 0.75,
                    pl: item.level === 3 ? 2 : 0,
                    color: activeSection === item.id ? 'primary.main' : 'text.secondary',
                    typography: 'body2',
                    fontWeight:
                      activeSection === item.id ? 'fontWeightSemiBold' : 'fontWeightRegular',
                    textDecoration: 'none',
                  }}
                >
                  {item.label}
                </Box>
              ))}
            </Stack>
            <Divider sx={{ my: 2 }} />
            {progressReady ? (
              <>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {Math.round(readingProgress)}% o‘qildi
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={readingProgress}
                  sx={{ mt: 1, height: 4 }}
                />
              </>
            ) : (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                O‘qish holati tiklanmoqda…
              </Typography>
            )}
          </Box>

          <Box component="article" id="reader-content" sx={{ minWidth: 0 }}>
            <Accordion
              disableGutters
              elevation={0}
              sx={{
                mb: 3,
                display: { md: 'none' },
                bgcolor: 'background.neutral',
                '&::before': { display: 'none' },
              }}
            >
              <AccordionSummary
                expandIcon={<UiIcon icon="solar:alt-arrow-down-linear" width={18} />}
              >
                <Typography variant="subtitle2">Mundarija</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack>
                  {tocItems.map((item) => (
                    <Link key={item.id} href={`#${item.id}`} underline="hover" sx={{ py: 0.75 }}>
                      {item.label}
                    </Link>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Box
              className="minimal-reader-markdown"
              sx={{
                '& .rich-markdown': {
                  color: 'text.primary',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  lineHeight: 1.8,
                },
                '& .rich-markdown h2': {
                  mt: 6,
                  mb: 2,
                  fontFamily: 'inherit',
                  fontSize: { xs: '1.75rem', md: '2rem' },
                  lineHeight: 1.35,
                  letterSpacing: 0,
                },
                '& .rich-markdown h3': {
                  mt: 4,
                  mb: 1.5,
                  fontFamily: 'inherit',
                  fontSize: '1.35rem',
                  lineHeight: 1.45,
                  letterSpacing: 0,
                },
                '& .rich-markdown p': { mb: 2.5, color: 'text.primary' },
                '& .rich-markdown blockquote': {
                  my: 3,
                  mx: 0,
                  py: 1,
                  pl: 2.5,
                  borderLeft: 3,
                  borderColor: 'primary.main',
                  bgcolor: 'transparent',
                },
                '& .rich-markdown pre, & .rich-markdown code': {
                  fontFamily: 'JetBrains Mono Variable, monospace',
                },
                '& .rich-markdown pre': { border: 0, boxShadow: 'none', borderRadius: 1.5 },
                '& .rich-markdown img': { borderRadius: 1 },
              }}
            >
              <RichMarkdown
                sourcePath={article.sourcePath}
                assetBaseUrl={article.assetBaseUrl}
                knownArticles={allArticles}
              >
                {readerContent}
              </RichMarkdown>
            </Box>

            {isBinaryFallback && (
              <Box component="section" sx={{ mt: 6 }}>
                <Typography variant="h4">Kod namunasi</Typography>
                <Typography variant="body2" sx={{ mt: 1, mb: 2.5, color: 'text.secondary' }}>
                  Tilni almashtirib bir xil invariant qanday ifodalanishini solishtiring.
                </Typography>
                <CodeBlock
                  samples={[
                    { language: 'cpp', label: 'C++', code: cppCode },
                    { language: 'python', label: 'Python', code: pythonCode },
                  ]}
                  title="first_true"
                />
              </Box>
            )}

            {!!practices.length && (
              <Box component="section" id="mashqlar" sx={{ mt: 7, scrollMarginTop: 1 }}>
                <Typography variant="h4">Mashq qilish</Typography>
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  Havolalar asl platformada ochiladi; masala sharti bu yerga ko‘chirilmaydi.
                </Typography>
                <Stack divider={<Divider flexItem />} sx={{ mt: 2.5 }}>
                  {practices.map((problem, index) => (
                    <Box
                      key={`${problem.url}-${index}`}
                      component="a"
                      href={problem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        py: 2,
                        gap: 2,
                        display: 'flex',
                        alignItems: 'center',
                        color: 'text.primary',
                        textDecoration: 'none',
                        '&:hover strong': { color: 'primary.main' },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          width: 26,
                          color: 'text.secondary',
                          fontFamily: 'JetBrains Mono Variable',
                        }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </Typography>
                      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                        <Typography component="strong" variant="subtitle2">
                          {problem.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ mt: 0.25, display: 'block', color: 'text.secondary' }}
                        >
                          {problem.platform} · {problem.difficulty}
                          {problem.note ? ` · ${problem.note}` : ''}
                        </Typography>
                      </Box>
                      <UiIcon icon="solar:arrow-right-up-linear" width={18} />
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            <Box sx={{ mt: 6, p: 2.5, bgcolor: 'background.neutral', borderRadius: 1.5 }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ sm: 'center' }}
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="subtitle1">
                    {isArticleCompleted ? 'Darslik yakunlandi' : 'Mavzuni o‘qib bo‘ldingizmi?'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.25, color: 'text.secondary' }}>
                    {session ? 'Holat profilingizda saqlanadi.' : 'Holat shu brauzerda saqlanadi.'}
                  </Typography>
                </Box>
                {isArticleCompleted ? (
                  <Stack
                    direction="row"
                    spacing={0.75}
                    alignItems="center"
                    sx={{ color: 'success.dark' }}
                  >
                    <UiIcon icon="solar:check-circle-linear" width={20} />
                    <Typography variant="subtitle2">Yakunlangan</Typography>
                  </Stack>
                ) : (
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => setReadingProgress(100)}
                  >
                    Yakunlandi deb belgilash
                  </Button>
                )}
              </Stack>
            </Box>

            <Divider sx={{ mt: 6, mb: 3 }} />
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="subtitle2">
                  {contributors.length
                    ? `${contributors.length} hissa qo‘shuvchi`
                    : 'Hamjamiyat tayyorlagan maqola'}
                </Typography>
                {contributors.length > 0 && (
                  <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                    {contributors
                      .map((item) => `${item.name}${item.role ? ` — ${item.role}` : ''}`)
                      .join(', ')}
                  </Typography>
                )}
              </Box>
              <Stack direction="row" spacing={1}>
                <Button
                  component="a"
                  href="https://github.com/cp-uz/cp-uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                >
                  Tahrir taklif qilish
                </Button>
                {!!revisions.length && (
                  <Button size="small" color="inherit" onClick={() => setRevisionsOpen(true)}>
                    Tarix ({revisions.length})
                  </Button>
                )}
              </Stack>
            </Stack>

            {(article.previous || article.next) && (
              <Box
                component="nav"
                aria-label="Qo‘shni darsliklar"
                sx={{
                  mt: 5,
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                }}
              >
                {article.previous ? (
                  <Box
                    component={RouterLink}
                    to={getArticlePath(article.previous)}
                    sx={{ py: 2.5, pr: 2.5, color: 'text.primary', textDecoration: 'none' }}
                  >
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      ← Oldingi
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
                      {article.previous.title}
                    </Typography>
                  </Box>
                ) : (
                  <span />
                )}
                {article.next && (
                  <Box
                    component={RouterLink}
                    to={getArticlePath(article.next)}
                    sx={{
                      py: 2.5,
                      pl: { sm: 2.5 },
                      borderLeft: { sm: 1 },
                      borderColor: 'divider',
                      color: 'text.primary',
                      textAlign: { sm: 'right' },
                      textDecoration: 'none',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Keyingi →
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
                      {article.next.title}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>

          <Box
            component="aside"
            sx={{
              position: 'sticky',
              top: 88,
              alignSelf: 'start',
              display: { xs: 'none', md: 'block' },
            }}
          >
            <Stack spacing={0.75}>
              <Tooltip title={bookmarks.has(articleKey) ? 'Saqlangan' : 'Saqlash'} placement="left">
                <IconButton
                  color={bookmarks.has(articleKey) ? 'primary' : 'default'}
                  onClick={() => bookmarks.toggle(articleKey)}
                >
                  <UiIcon
                    icon={
                      bookmarks.has(articleKey) ? 'solar:bookmark-bold' : 'solar:bookmark-linear'
                    }
                  />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={note.trim() ? 'Shaxsiy qayd saqlangan' : 'Shaxsiy qayd'}
                placement="left"
              >
                <IconButton
                  color={note.trim() ? 'primary' : 'default'}
                  onClick={() => setNotesOpen(true)}
                >
                  <UiIcon icon={note.trim() ? 'solar:notes-bold' : 'solar:notes-linear'} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Ulashish" placement="left">
                <IconButton onClick={() => void requestShare()}>
                  <UiIcon icon="solar:share-linear" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </Box>
      </Container>

      {!!related.length && (
        <Box component="section" sx={{ py: { xs: 6, md: 8 }, bgcolor: 'background.neutral' }}>
          <Container maxWidth="md">
            <Typography variant="h4">Keyingi o‘qish uchun</Typography>
            <Stack divider={<Divider flexItem />} sx={{ mt: 2.5 }}>
              {related.map((item) => (
                <Box
                  key={item.sourceId ?? item.slug}
                  component={RouterLink}
                  to={getArticlePath(item)}
                  sx={{
                    py: 2.25,
                    gap: 2,
                    display: 'flex',
                    alignItems: 'center',
                    color: 'text.primary',
                    textDecoration: 'none',
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1">{item.title}</Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                      {item.category} · {item.readTime} daqiqa
                    </Typography>
                  </Box>
                  <UiIcon icon="solar:alt-arrow-right-linear" width={18} />
                </Box>
              ))}
            </Stack>
          </Container>
        </Box>
      )}

      <Drawer
        anchor="right"
        open={notesOpen}
        onClose={() => setNotesOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: { xs: 1, sm: 440 },
              display: 'flex',
              bgcolor: 'background.paper',
              backgroundImage: 'none',
              backdropFilter: 'none',
            },
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={2}
          sx={{ p: 3 }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
              Shaxsiy qayd
            </Typography>
            <Typography variant="h5" sx={{ mt: 0.75 }}>
              {article.title}
            </Typography>
          </Box>
          <IconButton aria-label="Qaydni yopish" onClick={() => setNotesOpen(false)}>
            <UiIcon icon="solar:close-circle-linear" />
          </IconButton>
        </Stack>
        <Divider />
        <Box sx={{ p: 3, minHeight: 0, flexGrow: 1, overflowY: 'auto' }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="flex-start"
            sx={{ color: 'text.secondary' }}
          >
            <UiIcon
              icon={note.trim() ? 'solar:check-circle-linear' : 'solar:shield-user-linear'}
              width={19}
            />
            <Typography variant="body2" sx={{ color: 'inherit' }}>
              {note.trim()
                ? 'Saqlangan qaydni tahrirlayapsiz.'
                : session
                  ? 'Bu qayd profilingizda saqlanadi va faqat sizga ko‘rinadi.'
                  : 'Bu qayd shu brauzerda saqlanadi va faqat sizga ko‘rinadi.'}
            </Typography>
          </Stack>
          {noteError && (
            <Typography variant="body2" sx={{ mt: 2, color: 'error.main' }}>
              {noteError}
            </Typography>
          )}
          <TextField
            fullWidth
            multiline
            minRows={12}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Savol, formula yoki qisqa xulosa..."
            slotProps={{ htmlInput: { 'aria-label': 'Shaxsiy qayd matni' } }}
            sx={{ mt: 3 }}
          />
        </Box>
        <Divider />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{ p: 2.5 }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {note.length} belgi
          </Typography>
          <Button variant="contained" disabled={noteSaving} onClick={() => void saveNote()}>
            {noteSaving ? 'Saqlanmoqda…' : 'Qaydni saqlash'}
          </Button>
        </Stack>
      </Drawer>

      <Dialog open={shareOpen} onClose={() => setShareOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          Maqolani ulashish
          <IconButton aria-label="Ulashishni yopish" onClick={() => setShareOpen(false)}>
            <UiIcon icon="solar:close-circle-linear" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pb: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Doimiy havolani nusxalang yoki qurilmangizdagi ulashish oynasini oching.
          </Typography>
          <TextField
            fullWidth
            value={window.location.href}
            slotProps={{
              htmlInput: { readOnly: true, 'aria-label': 'Maqolaning doimiy havolasi' },
            }}
            sx={{ mt: 2.5 }}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => void copyShareLink()}
              startIcon={
                <UiIcon
                  icon={shareCopied ? 'solar:check-circle-bold' : 'solar:copy-linear'}
                  width={18}
                />
              }
            >
              {shareCopied ? 'Havola nusxalandi' : 'Havolani nusxalash'}
            </Button>
            {canNativeShare && (
              <Button
                color="inherit"
                onClick={() => void shareArticle()}
                startIcon={<UiIcon icon="solar:share-linear" width={18} />}
              >
                Qurilmada ulashish
              </Button>
            )}
          </Stack>
        </DialogContent>
      </Dialog>

      <Dialog open={revisionsOpen} onClose={() => setRevisionsOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Versiyalar tarixi</DialogTitle>
        <DialogContent>
          <Stack divider={<Divider flexItem />}>
            {revisions.map((revision) => (
              <Box key={`${revision.version}-${revision.date}`} sx={{ py: 2 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle2">{revision.version}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {formatUzbekDate(revision.date)}
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {revision.note}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ mt: 0.5, display: 'block', color: 'text.secondary' }}
                >
                  {revision.author}
                </Typography>
              </Box>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
