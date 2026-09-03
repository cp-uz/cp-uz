import { Seo } from 'shared/ui/Seo';
import { UiIcon } from 'shared/ui/UiIcon';
import { useMemo, useState, useEffect } from 'react';
import { useAsyncData, useDebouncedValue } from 'shared/hooks';
import { useSearchParams, Link as RouterLink } from 'react-router';
import { useLocalStorageList } from 'modules/engagement/application';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemButton from '@mui/material/ListItemButton';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import { ArticleCard } from '../../shared';
import { learningQueries as learningApi } from '../../../application';
import { filterArticles, presentRootCategories } from '../../../domain';

const difficultyOptions = ['all', 'Boshlang‘ich', 'O‘rta', 'Yuqori'];
const ARTICLES_PER_BATCH = 10;

export default function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState(ARTICLES_PER_BATCH);
  const {
    data: allArticles,
    loading: articlesLoading,
    error: articleLoadError,
  } = useAsyncData(learningApi.listArticles, [], []);
  const {
    data: allCategories,
    loading: categoriesLoading,
    error: categoryLoadError,
  } = useAsyncData(learningApi.listCategories, [], []);
  const bookmarks = useLocalStorageList('cpuz:bookmarks', []);
  const query = params.get('q') ?? '';
  const debouncedQuery = useDebouncedValue(query, 300);
  const category = params.get('category') ?? 'all';
  const difficulty = params.get('difficulty') ?? 'all';
  const rootCategories = presentRootCategories(allCategories);
  const loading = articlesLoading || categoriesLoading;

  const results = useMemo(
    () => filterArticles(allArticles, debouncedQuery, category, difficulty),
    [allArticles, category, debouncedQuery, difficulty]
  );
  const visibleResults = results.slice(0, visibleCount);
  const hasMore = visibleResults.length < results.length;

  useEffect(() => {
    setVisibleCount(ARTICLES_PER_BATCH);
  }, [category, debouncedQuery, difficulty, view]);

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (!value || value === 'all') next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const clear = () => setParams({}, { replace: true });
  const categoryTitle = rootCategories.find((item) => item.id === category)?.title;
  const hasFilters = Boolean(query || category !== 'all' || difficulty !== 'all');

  return (
    <>
      <Seo
        title="Algoritmlar kutubxonasi"
        description="O‘zbek tilidagi algoritmlar, ma’lumotlar tuzilmalari va sport dasturlash darsliklari."
        path="/algoritmlar"
      />

      <Container maxWidth="xl" sx={{ pt: { xs: 2, md: 4 }, pb: { xs: 4, md: 6 } }}>
        <Box sx={{ maxWidth: 760 }}>
          <Typography component="h1" variant="h3">
            Algoritmlar va mavzular
          </Typography>
          <Typography sx={{ mt: 1.5, color: 'text.secondary' }}>
            {articlesLoading
              ? 'Maqolalarni mavzu, daraja yoki kalit so‘z orqali toping.'
              : `${allArticles.length} ta maqolani mavzu, daraja yoki kalit so‘z orqali toping.`}{' '}
            Har bir materialning tekshiruv holati alohida ko‘rsatiladi.
          </Typography>
        </Box>

        <TextField
          fullWidth
          value={query}
          onChange={(event) => update('q', event.target.value)}
          placeholder="Mavzu, algoritm yoki kalit so‘z bo‘yicha qidirish"
          aria-label="Maqolalarni qidirish"
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
                    onClick={() => update('q', '')}
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
            mb: 3,
            gap: 2,
            display: { xs: 'grid', md: 'none' },
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
          }}
        >
          <TextField
            select
            fullWidth
            size="small"
            label="Bo‘lim"
            value={category}
            onChange={(event) => update('category', event.target.value)}
          >
            <MenuItem value="all">
              <ListItemIcon>
                <UiIcon icon="solar:library-linear" width={18} />
              </ListItemIcon>
              Barcha mavzular ({articlesLoading ? '…' : allArticles.length})
            </MenuItem>
            {rootCategories.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                <ListItemIcon>
                  <UiIcon icon={item.icon} width={18} />
                </ListItemIcon>
                {item.title} ({item.articleCount})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            size="small"
            label="Daraja"
            value={difficulty}
            onChange={(event) => update('difficulty', event.target.value)}
          >
            {difficultyOptions.map((item) => (
              <MenuItem key={item} value={item}>
                {item === 'all' ? 'Barchasi' : item}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box
          sx={{
            gap: { md: 4, lg: 5 },
            display: 'grid',
            alignItems: 'start',
            gridTemplateColumns: { xs: '1fr', md: '240px minmax(0, 1fr)' },
          }}
        >
          <Box
            component="aside"
            sx={{
              pr: 3,
              borderRight: 1,
              borderColor: 'divider',
              display: { xs: 'none', md: 'block' },
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Bo‘limlar
            </Typography>
            <Stack spacing={0.25}>
              <ListItemButton
                selected={category === 'all'}
                onClick={() => update('category', 'all')}
                sx={{ px: 1.5, borderRadius: 1 }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 34,
                    color: category === 'all' ? 'primary.main' : 'text.secondary',
                  }}
                >
                  <UiIcon icon="solar:library-linear" width={18} />
                </ListItemIcon>
                <ListItemText
                  primary="Barcha mavzular"
                  slotProps={{
                    primary: {
                      variant: 'body2',
                      fontWeight: 600,
                      color: category === 'all' ? 'primary.main' : 'text.primary',
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {articlesLoading ? '…' : allArticles.length}
                </Typography>
              </ListItemButton>
              {rootCategories.map((item) => (
                <ListItemButton
                  key={item.id}
                  selected={category === item.id}
                  onClick={() => update('category', item.id)}
                  sx={{ px: 1.5, borderRadius: 1 }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 34,
                      color: category === item.id ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    <UiIcon icon={item.icon} width={18} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    slotProps={{
                      primary: {
                        variant: 'body2',
                        color: category === item.id ? 'primary.main' : 'text.primary',
                        fontWeight: category === item.id ? 600 : 400,
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {item.articleCount}
                  </Typography>
                </ListItemButton>
              ))}
            </Stack>

            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle2">Daraja</Typography>
            <RadioGroup
              value={difficulty}
              onChange={(event) => update('difficulty', event.target.value)}
              sx={{ mt: 1 }}
            >
              {difficultyOptions.map((item) => (
                <FormControlLabel
                  key={item}
                  value={item}
                  control={<Radio size="small" />}
                  label={item === 'all' ? 'Barchasi' : item}
                  slotProps={{ typography: { variant: 'body2' } }}
                />
              ))}
            </RadioGroup>

            <Divider sx={{ my: 3 }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Qayerdan boshlashni bilmaysizmi?
            </Typography>
            <Button component={RouterLink} to="/yol-xaritasi" size="small" sx={{ mt: 1, px: 0 }}>
              Yo‘l xaritasini ochish
            </Button>
          </Box>

          <Box>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ sm: 'center' }}
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="h5">
                  {query ? `“${query}” natijalari` : (categoryTitle ?? 'Barcha maqolalar')}
                </Typography>
                <Typography
                  variant="body2"
                  aria-live="polite"
                  sx={{ mt: 0.5, color: 'text.secondary' }}
                >
                  {loading
                    ? 'Kutubxona yuklanmoqda…'
                    : results.length
                      ? `${visibleResults.length} / ${results.length} ta maqola ko‘rsatilmoqda`
                      : '0 ta maqola topildi'}
                </Typography>
              </Box>
              <Stack direction="row" spacing={0.5}>
                <IconButton
                  color={view === 'grid' ? 'primary' : 'default'}
                  onClick={() => setView('grid')}
                  aria-label="Katakli ko‘rinish"
                >
                  <UiIcon icon="solar:widget-2-linear" width={20} />
                </IconButton>
                <IconButton
                  color={view === 'list' ? 'primary' : 'default'}
                  onClick={() => setView('list')}
                  aria-label="Ro‘yxat ko‘rinish"
                >
                  <UiIcon icon="solar:list-linear" width={20} />
                </IconButton>
              </Stack>
            </Stack>

            {hasFilters && (
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ mt: 2.5, flexWrap: 'wrap' }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {[query && `qidiruv: ${query}`, categoryTitle, difficulty !== 'all' && difficulty]
                    .filter(Boolean)
                    .join(' · ')}
                </Typography>
                <Button size="small" color="primary" onClick={clear}>
                  Filtrlarni tozalash
                </Button>
              </Stack>
            )}

            {loading && (
              <Stack alignItems="center" spacing={1.5} sx={{ py: 9 }}>
                <CircularProgress size={30} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Kutubxona yuklanmoqda…
                </Typography>
              </Stack>
            )}

            {!loading && (articleLoadError || categoryLoadError) && (
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <UiIcon icon="solar:server-square-cloud-linear" width={40} />
                <Typography variant="h5" sx={{ mt: 2 }}>
                  Kutubxonani yuklab bo‘lmadi
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  Server bilan ulanishni tekshirib, sahifani yangilang.
                </Typography>
              </Box>
            )}

            {!loading && !articleLoadError && !categoryLoadError && results.length > 0 ? (
              <Box
                sx={{
                  mt: 3,
                  gap: 2,
                  display: 'grid',
                  gridTemplateColumns:
                    view === 'list' ? '1fr' : { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                }}
              >
                {visibleResults.map((article) => (
                  <ArticleCard
                    key={article.sourceId ?? article.slug}
                    article={article}
                    compact={view === 'list'}
                    bookmarked={bookmarks.has(article.sourceId ?? article.slug)}
                    onBookmark={bookmarks.toggle}
                  />
                ))}
              </Box>
            ) : !loading && !articleLoadError && !categoryLoadError ? (
              <Box sx={{ py: 10, textAlign: 'center' }}>
                <UiIcon icon="solar:document-add-linear" width={40} />
                <Typography variant="h5" sx={{ mt: 2 }}>
                  Hech narsa topilmadi
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  So‘rovni qisqartiring yoki filtrlarni tozalab qayta urinib ko‘ring.
                </Typography>
                <Button variant="contained" onClick={clear} sx={{ mt: 3 }}>
                  Filtrlarni tozalash
                </Button>
              </Box>
            ) : null}

            {!loading && !articleLoadError && !categoryLoadError && hasMore && (
              <Stack alignItems="center" sx={{ mt: 4 }}>
                <Button
                  type="button"
                  variant="soft"
                  onClick={() => setVisibleCount((current) => current + ARTICLES_PER_BATCH)}
                  endIcon={<UiIcon icon="solar:alt-arrow-down-linear" width={18} />}
                >
                  Yana yuklash
                </Button>
              </Stack>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
}
