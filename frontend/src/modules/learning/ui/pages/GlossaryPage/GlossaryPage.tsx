import { Seo } from 'shared/ui/Seo';
import { UiIcon } from 'shared/ui/UiIcon';
import { useLocation } from 'react-router';
import { useMemo, useState, useEffect } from 'react';
import { useAsyncData, useDebouncedValue } from 'shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { GlossaryQuiz } from './GlossaryQuiz';
import { learningQueries as learningApi } from '../../../application';
import {
  normalizeSearchText,
  sortGlossaryByEnglish,
  getGlossaryDisplayLabels,
  getEnglishGlossaryInitial,
} from '../../../domain';

const letterAnchorId = (letter: string) => `lugat-harf-${normalizeSearchText(letter)}`;

export default function GlossaryPage() {
  const { hash } = useLocation();
  const { data, loading, error } = useAsyncData(learningApi.getGlossary, [], []);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);
  const filtered = useMemo(
    () =>
      sortGlossaryByEnglish(
        data.filter((item) => {
          const matchesQuery = normalizeSearchText(
            `${item.term} ${item.english} ${item.aliases?.join(' ') ?? ''} ${item.definition}`
          ).includes(normalizeSearchText(debouncedQuery));

          return matchesQuery;
        })
      ),
    [data, debouncedQuery]
  );
  const groups = useMemo(
    () => Array.from(new Set(filtered.map((item) => getEnglishGlossaryInitial(item.english)))),
    [filtered]
  );

  const clearSearch = () => setQuery('');

  useEffect(() => {
    if (hash !== '#mini-test' || loading || !data.length) return undefined;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById('mini-test')?.scrollIntoView({ block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [data.length, hash, loading]);

  return (
    <>
      <Seo
        title="Algoritmik atamalar lug‘ati"
        description="Sport dasturlash va algoritmlardagi atamalarning ravon o‘zbekcha izohlari."
        path="/lugat"
      />

      <Container maxWidth="xl" sx={{ pt: { xs: 5, md: 7 }, pb: { xs: 7, md: 10 } }}>
        <Box sx={{ maxWidth: 760 }}>
          <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
            Atamalar to‘plami
          </Typography>
          <Typography component="h1" variant="h3" sx={{ mt: 1.5 }}>
            Algoritmik atamalar lug‘ati
          </Typography>
          <Typography sx={{ mt: 1.5, color: 'text.secondary' }}>
            Sport dasturlash tushunchalarining o‘zbekcha izohi, inglizcha muqobili va bog‘liq
            mavzulari.
          </Typography>
          <Button
            component="a"
            href="#mini-test"
            variant="soft"
            startIcon={<UiIcon icon="solar:question-square-linear" width={19} />}
            sx={{ mt: 2.5 }}
          >
            Mini testga o‘tish
          </Button>
        </Box>

        <TextField
          fullWidth
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Atamani o‘zbekcha yoki inglizcha qidiring"
          aria-label="Atamalarni qidirish"
          sx={{ mt: 4, maxWidth: 820 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <UiIcon icon="solar:magnifer-linear" width={21} />
                </InputAdornment>
              ),
              endAdornment: query ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setQuery('')}
                    aria-label="Qidiruvni tozalash"
                  >
                    <UiIcon icon="solar:close-circle-linear" width={19} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />

        <Divider sx={{ my: { xs: 4, md: 5 } }} />

        <Box
          sx={{
            gap: { md: 5 },
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '132px minmax(0, 1fr)' },
          }}
        >
          <Box
            component="aside"
            aria-label="Lug‘at mundarijasi"
            sx={{
              top: 96,
              pr: 1.5,
              alignSelf: 'start',
              position: 'sticky',
              maxHeight: 'calc(100vh - 120px)',
              overflowY: 'auto',
              display: { xs: 'none', md: 'block' },
            }}
          >
            <Typography variant="subtitle2">Mundarija</Typography>
            <Box component="nav" aria-label="Bosh harflar" sx={{ mt: 1.25 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: 0.25,
                }}
              >
                {groups.map((group) => (
                  <Button
                    key={group}
                    component="a"
                    href={`#${letterAnchorId(group)}`}
                    color="inherit"
                    size="small"
                    sx={{ minWidth: 0, px: 0.5, color: 'text.secondary' }}
                  >
                    {group}
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>

          <Box>
            {groups.length > 0 && (
              <Box
                component="nav"
                aria-label="Bosh harflar"
                sx={{
                  mx: -1,
                  px: 1,
                  mb: 3,
                  display: { xs: 'block', md: 'none' },
                  overflowX: 'auto',
                }}
              >
                <Stack direction="row" spacing={0.25} sx={{ width: 'max-content' }}>
                  {groups.map((group) => (
                    <Button
                      key={group}
                      component="a"
                      href={`#${letterAnchorId(group)}`}
                      color="inherit"
                      size="small"
                      sx={{ minWidth: 36, color: 'text.secondary' }}
                    >
                      {group}
                    </Button>
                  ))}
                </Stack>
              </Box>
            )}

            <Stack
              direction="row"
              alignItems="baseline"
              justifyContent="space-between"
              sx={{ mb: 2 }}
            >
              <Typography variant="h5">Atamalar</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {loading ? 'Yuklanmoqda…' : `${filtered.length} natija`}
              </Typography>
            </Stack>

            {loading ? (
              <Stack alignItems="center" spacing={1.5} sx={{ py: 9 }}>
                <CircularProgress size={30} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Lug‘at yuklanmoqda…
                </Typography>
              </Stack>
            ) : error ? (
              <Box sx={{ py: { xs: 7, md: 10 }, maxWidth: 560 }}>
                <UiIcon icon="solar:server-square-cloud-linear" width={36} />
                <Typography variant="h5" sx={{ mt: 2 }}>
                  Lug‘atni yuklab bo‘lmadi
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  Server bilan ulanishni tekshirib, sahifani yangilang.
                </Typography>
              </Box>
            ) : filtered.length > 0 ? (
              <Stack divider={<Divider flexItem />}>
                {groups.map((group) => (
                  <Box
                    component="section"
                    id={letterAnchorId(group)}
                    key={group}
                    sx={{
                      py: { xs: 3, md: 4 },
                      gap: { xs: 2, md: 4 },
                      display: 'grid',
                      scrollMarginTop: '96px',
                      gridTemplateColumns: { xs: '1fr', md: '72px minmax(0, 1fr)' },
                    }}
                  >
                    <Typography component="h2" variant="h3" sx={{ color: 'primary.main' }}>
                      {group}
                    </Typography>
                    <Stack divider={<Divider flexItem />}>
                      {filtered
                        .filter((item) => getEnglishGlossaryInitial(item.english) === group)
                        .map((item) => {
                          const labels = getGlossaryDisplayLabels(item);

                          return (
                            <Box
                              component="article"
                              key={item.english}
                              sx={{ py: 2.5, '&:first-of-type': { pt: 0 } }}
                            >
                              <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={{ xs: 0.5, sm: 1.5 }}
                                alignItems={{ sm: 'baseline' }}
                              >
                                <Typography component="h3" variant="h6">
                                  {labels.primary}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                  {labels.secondary}
                                </Typography>
                              </Stack>
                              <Typography sx={{ mt: 1.25, maxWidth: 840 }}>
                                {item.definition}
                              </Typography>
                            </Box>
                          );
                        })}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Box sx={{ py: { xs: 7, md: 10 }, maxWidth: 520 }}>
                <Box sx={{ color: 'primary.main', display: 'flex' }}>
                  <UiIcon icon="solar:notebook-bookmark-linear" width={36} />
                </Box>
                <Typography variant="h5" sx={{ mt: 2 }}>
                  Atama topilmadi
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  Atamani boshqacha yozib yoki so‘rovni qisqartirib ko‘ring.
                </Typography>
                <Button variant="contained" type="button" onClick={clearSearch} sx={{ mt: 3 }}>
                  Qidiruvni tozalash
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        {!loading && !error && data.length > 0 && <GlossaryQuiz terms={data} />}

        <Divider sx={{ mt: { xs: 4, md: 6 }, mb: 4 }} />

        <Stack
          component="aside"
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ md: 'center' }}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Box sx={{ color: 'primary.main', display: 'flex', mt: 0.25 }}>
              <UiIcon icon="solar:chat-square-arrow-linear" width={23} />
            </Box>
            <Box>
              <Typography variant="subtitle1">Kerakli atamani topmadingizmi?</Typography>
              <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                Atama va uni qayerda uchratganingizni yozing — tahririyat taklifni ko‘rib chiqadi.
              </Typography>
            </Box>
          </Stack>
          <Button
            component="a"
            href="https://github.com/cp-uz/cp-uz/issues"
            target="_blank"
            rel="noreferrer"
            endIcon={<UiIcon icon="solar:arrow-right-up-linear" width={18} />}
            sx={{ flexShrink: 0 }}
          >
            Atama taklif qilish
          </Button>
        </Stack>
      </Container>
    </>
  );
}
