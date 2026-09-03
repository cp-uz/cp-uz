import type { ProblemLink, ProblemDetail } from '../domain';

import { Seo } from 'shared/ui/Seo';
import { UiIcon } from 'shared/ui/UiIcon';
import { useAsyncData } from 'shared/hooks';
import { formatUzbekDate } from 'shared/lib/i18n';
import { useMemo, useState, useEffect } from 'react';
import { RichMarkdown } from 'modules/learning/ui/shared';
import { useParams, useNavigate, useSearchParams, Link as RouterLink } from 'react-router';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import GlobalStyles from '@mui/material/GlobalStyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListItemButton from '@mui/material/ListItemButton';

import { PdfStatement } from './PdfStatement';
import { problemQueries } from '../application';

function problemPath(problem: ProblemDetail, slug: string) {
  return `/masalalar/${problem.season.slug}/${problem.event.slug}/${slug}`;
}

function formatEventDate(event: ProblemDetail['event']) {
  if (event.dateLabel) return event.dateLabel;
  if (!event.startDate) return '';
  const start = formatUzbekDate(event.startDate);
  if (!event.endDate || event.endDate === event.startDate) return start;
  return `${start} — ${formatUzbekDate(event.endDate)}`;
}

function comparableUrl(value: string) {
  try {
    const url = new URL(value);
    url.hash = '';
    url.searchParams.sort();
    url.pathname = url.pathname.replace(/\/+$/, '') || '/';
    return url.toString();
  } catch {
    return value.replace(/\/+$/, '');
  }
}

function problemLinkLogo(link: ProblemLink, eventSlug: string) {
  const hostname = (() => {
    try {
      return new URL(link.url).hostname.toLowerCase();
    } catch {
      return '';
    }
  })();

  if (hostname === 'kep.uz' || hostname.endsWith('.kep.uz')) {
    return '/assets/platforms/kepuz.svg';
  }
  if (hostname === 'oj.uz' || hostname.endsWith('.oj.uz')) {
    return 'https://oj.uz/static/logo_20170205.png';
  }
  if (hostname.includes('egoi') || eventSlug.startsWith('egoi-')) {
    return '/assets/seasons/egoi.png';
  }
  if (hostname.includes('ioinformatics') || eventSlug.startsWith('ioi-')) {
    return '/assets/seasons/ioi.png';
  }
  return undefined;
}

function ProblemLinkLogo({ link, eventSlug }: { link: ProblemLink; eventSlug: string }) {
  const src = problemLinkLogo(link, eventSlug);
  if (!src) return <UiIcon icon="solar:link-circle-linear" width={18} />;
  return (
    <Box
      component="img"
      src={src}
      alt=""
      aria-hidden="true"
      sx={{ width: 18, height: 18, objectFit: 'contain' }}
    />
  );
}

function ProblemNavigation({ problem }: { problem: ProblemDetail }) {
  return (
    <Box component="nav" aria-label="Event masalalari">
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="overline" sx={{ color: 'primary.main' }}>
            {problem.season.title}
          </Typography>
          <Typography variant="h6">{problem.event.shortTitle || problem.event.title}</Typography>
        </Box>
        <Tooltip title="Mavsum sahifasini ochish">
          <Button
            component={RouterLink}
            to={`/seasons/${problem.season.slug}/${problem.event.slug}`}
            color="inherit"
            aria-label="Mavsumdagi event tafsilotlarini ochish"
            sx={{ minWidth: 40, p: 1 }}
          >
            <UiIcon icon="solar:calendar-search-linear" width={21} />
          </Button>
        </Tooltip>
      </Stack>
      {problem.event.summary && (
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          {problem.event.summary}
        </Typography>
      )}
      <Stack spacing={0.75} sx={{ mt: 2 }}>
        {formatEventDate(problem.event) && (
          <Stack direction="row" spacing={1} alignItems="center">
            <UiIcon icon="solar:calendar-date-linear" width={17} />
            <Typography variant="caption">{formatEventDate(problem.event)}</Typography>
          </Stack>
        )}
        {(problem.event.venue || problem.event.location) && (
          <Stack direction="row" spacing={1} alignItems="center">
            <UiIcon icon="solar:map-point-linear" width={17} />
            <Typography variant="caption">
              {[problem.event.venue, problem.event.location].filter(Boolean).join(' · ')}
            </Typography>
          </Stack>
        )}
      </Stack>

      <Divider sx={{ my: 2.5 }} />
      <Typography variant="subtitle2">Barcha masalalar</Typography>
      <Stack spacing={2} sx={{ mt: 1.5 }}>
        {problem.sets.map((set) => (
          <Box key={set.slug}>
            <Typography variant="caption" sx={{ px: 1, color: 'text.secondary', fontWeight: 700 }}>
              {set.title}
            </Typography>
            <Stack sx={{ mt: 0.5 }}>
              {set.problems.map((item) => {
                const selected = item.slug === problem.slug;
                return (
                  <ListItemButton
                    key={item.slug}
                    component={RouterLink}
                    to={problemPath(problem, item.slug)}
                    selected={selected}
                    aria-current={selected ? 'page' : undefined}
                    sx={{
                      px: 1,
                      py: 0.75,
                      gap: 1,
                      minHeight: 42,
                      borderRadius: 1,
                      '&.Mui-selected': { bgcolor: 'primary.lighter', color: 'primary.dark' },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ width: 20, flexShrink: 0, color: 'primary.main', fontWeight: 700 }}
                    >
                      {item.code}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: selected ? 700 : 500 }}>
                      {item.originalTitle || item.title}
                    </Typography>
                  </ListItemButton>
                );
              })}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export default function ProblemPage() {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [navigationOpen, setNavigationOpen] = useState(false);
  const { seasonSlug = '', eventSlug = '', problemSlug } = useParams();
  const {
    data: eventDetail,
    loading: eventLoading,
    error: eventError,
  } = useAsyncData(
    () => (problemSlug ? Promise.resolve(null) : problemQueries.event(seasonSlug, eventSlug)),
    null,
    [eventSlug, problemSlug, seasonSlug]
  );
  const {
    data: problem,
    loading: problemLoading,
    error: problemError,
  } = useAsyncData(
    () =>
      problemSlug
        ? problemQueries.detail(seasonSlug, eventSlug, problemSlug)
        : Promise.resolve(null),
    null,
    [eventSlug, problemSlug, seasonSlug]
  );

  useEffect(() => {
    if (problemSlug || !eventDetail) return;
    const first = eventDetail.sets.flatMap((set) => set.problems)[0];
    if (first) {
      navigate(`/masalalar/${seasonSlug}/${eventSlug}/${first.slug}`, { replace: true });
    }
  }, [eventDetail, eventSlug, navigate, problemSlug, seasonSlug]);

  const orderedProblems = useMemo(
    () => problem?.sets.flatMap((set) => set.problems) ?? [],
    [problem]
  );
  const selectedIndex = orderedProblems.findIndex((item) => item.slug === problem?.slug);
  const previous = selectedIndex > 0 ? orderedProblems[selectedIndex - 1] : undefined;
  const next = selectedIndex >= 0 ? orderedProblems[selectedIndex + 1] : undefined;
  const loading = problemSlug ? problemLoading : eventLoading;
  const error = problemSlug ? problemError : eventError;

  if (loading || (!problemSlug && eventDetail)) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Skeleton width={260} />
        <Skeleton width="min(560px, 90vw)" height={70} />
        <Box sx={{ display: 'grid', gap: 4, mt: 4, gridTemplateColumns: { xl: '1fr 340px' } }}>
          <Skeleton variant="rounded" height={620} />
          <Skeleton variant="rounded" height={520} />
        </Box>
      </Container>
    );
  }

  if (error || !problem) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
        <Alert severity="error">Masala topilmadi yoki uni yuklab bo‘lmadi.</Alert>
        <Button component={RouterLink} to="/masalalar" sx={{ mt: 2 }}>
          Masalalar katalogiga qaytish
        </Button>
      </Container>
    );
  }

  const displayTitle = problem.originalTitle || problem.title;
  const showDifficulty = problem.event.slug !== 'ioi-2026-saralash-4';

  if (searchParams.get('pdf-export') === '1') {
    return (
      <>
        <Seo
          title={`${displayTitle} · ${problem.event.shortTitle || problem.event.title}`}
          description={`${problem.event.shortTitle || problem.event.title}: ${problem.title} masalasi.`}
          path={`/masalalar/${problem.season.slug}/${problem.event.slug}/${problem.slug}`}
        />
        <GlobalStyles
          styles={{
            '@page': { size: 'A4', margin: '14mm 15mm 16mm' },
            '@media print': {
              'html, body, #root': { backgroundColor: '#fff !important' },
              'body > #root header, body > #root footer': { display: 'none !important' },
              'body > #root main': { minHeight: '0 !important', padding: '0 !important' },
            },
          }}
        />
        <Box
          id="problem-pdf-export"
          data-ready="true"
          sx={{
            width: '100%',
            mx: 'auto',
            color: '#17202a',
            bgcolor: '#fff',
            fontFamily: 'Inter, Arial, sans-serif',
          }}
        >
          <Box sx={{ pb: '6mm', mb: '9mm', borderBottom: '2px solid #0877e1' }}>
            <Typography
              sx={{ color: '#0877e1', fontSize: 13, fontWeight: 800, letterSpacing: '.04em' }}
            >
              cp.uz
            </Typography>
            <Typography
              sx={{
                mt: '2mm',
                color: '#657786',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '.08em',
              }}
            >
              {problem.season.title.toUpperCase()}
            </Typography>
            <Typography
              component="h1"
              sx={{ mt: '4mm', mb: '2mm', fontSize: 27, fontWeight: 800, lineHeight: 1.15 }}
            >
              {displayTitle}
            </Typography>
            <Typography sx={{ m: 0, color: '#657786', fontSize: 11 }}>
              {problem.event.shortTitle || problem.event.title} · {problem.problemSet.title} ·{' '}
              {problem.code}
            </Typography>
          </Box>
          <Box
            id="problem-statement"
            sx={{
              '& p, & li': { fontSize: '11.2px !important', lineHeight: '1.55 !important' },
              '& h2': {
                mt: '7mm !important',
                mb: '3mm !important',
                fontSize: '19px !important',
                breakAfter: 'avoid',
              },
              '& h3': {
                mt: '5mm !important',
                mb: '2mm !important',
                fontSize: '15px !important',
                breakAfter: 'avoid',
              },
              '& img, & svg': { maxWidth: '100% !important', height: 'auto !important' },
              '& pre, & table, & blockquote': { breakInside: 'avoid' },
              '& table': { fontSize: '9.5px !important' },
              '& button': { display: 'none !important' },
              '& a': { color: 'inherit !important', textDecoration: 'none !important' },
            }}
          >
            <RichMarkdown sourcePath={problem.sourcePath}>{problem.statementMarkdown}</RichMarkdown>
          </Box>
        </Box>
      </>
    );
  }

  const practiceLinks = problem.links.filter((link) => link.kind === 'practice');
  const practiceUrls = new Set(practiceLinks.map((link) => comparableUrl(link.url)));
  const originalLinks = problem.links.filter(
    (link) => link.kind === 'original' && !practiceUrls.has(comparableUrl(link.url))
  );
  const statementPdfAttachment = problem.attachments.find(
    (attachment) => attachment.contentType?.toLowerCase() === 'application/pdf'
  );
  const statementPdf = problem.statementPdf ?? statementPdfAttachment;
  const supplementalAttachments = problem.attachments.filter(
    (attachment) => attachment.contentType?.toLowerCase() !== 'application/pdf'
  );

  return (
    <>
      <Seo
        title={`${displayTitle} · ${problem.event.shortTitle || problem.event.title}`}
        description={`${problem.season.title} ${problem.problemSet.title}: ${problem.title} masalasining o‘zbekcha sharti.`}
        path={`/masalalar/${problem.season.slug}/${problem.event.slug}/${problem.slug}`}
      />
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 3 }}
        >
          <Breadcrumbs>
            <Link component={RouterLink} to="/masalalar" color="inherit" underline="hover">
              Masalalar
            </Link>
            <Link
              component={RouterLink}
              to={`/masalalar/${problem.season.slug}/${problem.event.slug}`}
              color="inherit"
              underline="hover"
            >
              {problem.event.shortTitle || problem.event.title}
            </Link>
            <Typography color="text.primary">{displayTitle}</Typography>
          </Breadcrumbs>
          <Button
            color="inherit"
            onClick={() => setNavigationOpen(true)}
            startIcon={<UiIcon icon="solar:list-bold" width={18} />}
            sx={{ display: { xs: 'inline-flex', xl: 'none' }, flexShrink: 0 }}
          >
            Masalalar ro‘yxati
          </Button>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gap: { xs: 3, xl: 5 },
            alignItems: 'start',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', xl: 'minmax(0, 1fr) 340px' },
          }}
        >
          <Box component="main" sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                size="small"
                label={problem.translationStatusLabel}
                color={problem.translationStatus === 'reviewed_translation' ? 'success' : 'default'}
                icon={<UiIcon icon="solar:document-add-linear" width={16} />}
              />
              <Chip size="small" label={`${problem.problemSet.title} · ${problem.code}`} />
              {showDifficulty && problem.difficultyLabel && (
                <Chip size="small" label={problem.difficultyLabel} />
              )}
              {showDifficulty && problem.rating && (
                <Chip size="small" label={`${problem.rating} reyting`} />
              )}
            </Stack>

            <Typography
              component="h1"
              variant="h2"
              sx={{ mt: 2, fontSize: { xs: 36, sm: 44, md: 52 } }}
            >
              {displayTitle}
            </Typography>

            <Stack direction="row" spacing={2.5} flexWrap="wrap" useFlexGap sx={{ mt: 2.5 }}>
              {practiceLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{
                    gap: 0.75,
                    display: 'inline-flex',
                    alignItems: 'center',
                    color: 'text.primary',
                    fontWeight: 700,
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  <ProblemLinkLogo link={link} eventSlug={problem.event.slug} />
                  {link.title}
                  <UiIcon icon="solar:arrow-right-up-linear" width={16} />
                </Link>
              ))}
              {originalLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{
                    gap: 0.75,
                    display: 'inline-flex',
                    alignItems: 'center',
                    color: 'text.secondary',
                    fontWeight: 700,
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  <ProblemLinkLogo link={link} eventSlug={problem.event.slug} />
                  {link.title}
                  <UiIcon icon="solar:arrow-right-up-linear" width={16} />
                </Link>
              ))}
            </Stack>

            <Stack
              direction="row"
              spacing={{ xs: 2, sm: 3 }}
              flexWrap="wrap"
              useFlexGap
              sx={{ mt: 3, color: 'text.secondary' }}
            >
              {problem.timeLimitMs && (
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <UiIcon icon="solar:clock-circle-linear" width={17} />
                  <Typography variant="body2">{problem.timeLimitMs / 1000} soniya</Typography>
                </Stack>
              )}
              {problem.memoryLimitMb && (
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <UiIcon icon="solar:server-square-linear" width={17} />
                  <Typography variant="body2">{problem.memoryLimitMb} MB</Typography>
                </Stack>
              )}
              {problem.maxScore && (
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <UiIcon icon="solar:cup-star-linear" width={17} />
                  <Typography variant="body2">{Number(problem.maxScore)} ball</Typography>
                </Stack>
              )}
              {problem.problemType !== 'standard' && (
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <UiIcon icon="solar:code-circle-linear" width={17} />
                  <Typography variant="body2">{problem.problemTypeLabel}</Typography>
                </Stack>
              )}
            </Stack>

            {statementPdf ? (
              <PdfStatement source={statementPdf.url} title={displayTitle} />
            ) : (
              <Paper
                id="problem-statement"
                variant="outlined"
                sx={{ mt: 4, p: { xs: 2.25, sm: 3.5, md: 5 }, borderRadius: 2 }}
              >
                <RichMarkdown sourcePath={problem.sourcePath}>
                  {problem.statementMarkdown}
                </RichMarkdown>
              </Paper>
            )}

            {(supplementalAttachments.length > 0 || problem.tags.length > 0) && (
              <Paper variant="outlined" sx={{ mt: 3, p: { xs: 2, sm: 3 } }}>
                {supplementalAttachments.length > 0 && (
                  <>
                    <Typography variant="subtitle2">Qo‘shimcha fayllar</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                      {supplementalAttachments.map((attachment) => (
                        <Button
                          key={attachment.id}
                          component="a"
                          href={attachment.url}
                          target="_blank"
                          rel="noreferrer"
                          size="small"
                          variant="outlined"
                          startIcon={<UiIcon icon="solar:paperclip-linear" width={16} />}
                        >
                          {attachment.title}
                        </Button>
                      ))}
                    </Stack>
                  </>
                )}
                {problem.tags.length > 0 && (
                  <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
                    {problem.tags.map((tag) => (
                      <Chip key={tag} size="small" variant="outlined" label={tag} />
                    ))}
                  </Stack>
                )}
              </Paper>
            )}

            <Stack direction="row" justifyContent="space-between" sx={{ mt: 4 }}>
              {previous ? (
                <Button
                  component={RouterLink}
                  to={problemPath(problem, previous.slug)}
                  startIcon={<UiIcon icon="solar:arrow-left-linear" width={18} />}
                >
                  {previous.originalTitle || previous.title}
                </Button>
              ) : (
                <span />
              )}
              {next && (
                <Button
                  component={RouterLink}
                  to={problemPath(problem, next.slug)}
                  endIcon={<UiIcon icon="solar:arrow-right-linear" width={18} />}
                >
                  {next.originalTitle || next.title}
                </Button>
              )}
            </Stack>
          </Box>

          <Paper
            component="aside"
            variant="outlined"
            sx={{
              top: 88,
              p: 2.5,
              display: { xs: 'none', xl: 'block' },
              maxHeight: 'calc(100vh - 112px)',
              position: 'sticky',
              overflowY: 'auto',
              borderRadius: 2,
              scrollbarWidth: 'thin',
            }}
          >
            <ProblemNavigation problem={problem} />
          </Paper>
        </Box>
      </Container>
      <Drawer
        anchor={mobile ? 'bottom' : 'right'}
        open={navigationOpen}
        onClose={() => setNavigationOpen(false)}
        slotProps={{
          paper: {
            sx: mobile
              ? {
                  width: '100%',
                  maxHeight: '88dvh',
                  borderRadius: '16px 16px 0 0',
                  pb: 'max(8px, env(safe-area-inset-bottom))',
                }
              : { width: 380 },
          },
        }}
      >
        {mobile && (
          <Box
            aria-hidden="true"
            sx={{ width: 38, height: 4, mx: 'auto', mt: 1, bgcolor: 'divider', borderRadius: 2 }}
          />
        )}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
          <Typography variant="h6">Masalalar ro‘yxati</Typography>
          <IconButton
            aria-label="Masalalar ro‘yxatini yopish"
            onClick={() => setNavigationOpen(false)}
          >
            <UiIcon icon="solar:close-circle-linear" width={23} />
          </IconButton>
        </Stack>
        <Divider />
        <Box sx={{ p: 2.5 }} onClick={() => setNavigationOpen(false)}>
          <ProblemNavigation problem={problem} />
        </Box>
      </Drawer>
    </>
  );
}
