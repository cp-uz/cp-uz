import { Seo } from 'shared/ui/Seo';
import { useMemo, useState } from 'react';
import { UiIcon } from 'shared/ui/UiIcon';
import { useAsyncData } from 'shared/hooks';
import { Link as RouterLink } from 'react-router';
import { ArticleCard } from 'modules/learning/ui/shared';
import { learningQueries as learningApi } from 'modules/learning/application';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useLocalStorageList } from '../../../application';

export default function BookmarksPage() {
  const { data: liveArticles } = useAsyncData(learningApi.listArticles, [], []);
  const bookmarks = useLocalStorageList('cpuz:bookmarks', []);
  const [query, setQuery] = useState('');
  const saved = useMemo(
    () =>
      liveArticles.filter(
        (article) =>
          bookmarks.items.includes(article.sourceId ?? article.slug) &&
          `${article.title} ${article.category}`
            .toLocaleLowerCase('uz')
            .includes(query.toLocaleLowerCase('uz'))
      ),
    [bookmarks.items, liveArticles, query]
  );
  const hasBookmarks = bookmarks.items.length > 0;
  const toggleBookmark = (slug: string) => {
    const article = liveArticles.find((item) => item.slug === slug);
    bookmarks.toggle(article?.sourceId ?? slug);
  };

  return (
    <>
      <Seo
        title="Saqlangan maqolalar"
        description="Keyinroq o‘qish uchun saqlagan algoritm darsliklaringiz."
        path="/saqlanganlar"
      />

      <Container maxWidth="lg" sx={{ pt: { xs: 5, md: 7 }, pb: { xs: 7, md: 10 } }}>
        <Box sx={{ maxWidth: 720 }}>
          <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
            Shaxsiy kutubxona
          </Typography>
          <Typography component="h1" variant="h3" sx={{ mt: 1.5 }}>
            Saqlangan maqolalar
          </Typography>
          <Typography sx={{ mt: 1.5, color: 'text.secondary' }}>
            Keyinroq o‘qish yoki qayta murojaat qilish uchun belgilagan sport dasturlash
            darsliklaringiz shu yerda jamlanadi.
          </Typography>
        </Box>

        <TextField
          fullWidth
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Saqlanganlardan qidirish"
          aria-label="Saqlangan maqolalardan qidirish"
          sx={{ mt: 4, maxWidth: 720 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <UiIcon icon="solar:magnifer-linear" width={20} />
                </InputAdornment>
              ),
              endAdornment: query ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setQuery('')} aria-label="Qidiruvni tozalash">
                    <UiIcon icon="solar:close-circle-linear" width={19} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />

        <Divider sx={{ my: { xs: 4, md: 5 } }} />

        <Stack direction="row" alignItems="baseline" justifyContent="space-between">
          <Typography variant="h5">Maqolalar</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {saved.length} ta
          </Typography>
        </Stack>

        {saved.length > 0 ? (
          <Box
            sx={{
              mt: 3,
              gap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
            }}
          >
            {saved.map((article) => (
              <ArticleCard
                key={article.sourceId ?? article.slug}
                article={article}
                bookmarked
                onBookmark={toggleBookmark}
              />
            ))}
          </Box>
        ) : (
          <Box sx={{ py: { xs: 7, md: 10 }, maxWidth: 540 }}>
            <Box sx={{ color: 'primary.main', display: 'flex' }}>
              <UiIcon
                icon={
                  hasBookmarks
                    ? 'solar:document-add-linear'
                    : 'solar:bookmark-square-minimalistic-linear'
                }
                width={38}
              />
            </Box>
            <Typography variant="h5" sx={{ mt: 2 }}>
              {hasBookmarks ? 'Qidiruv bo‘yicha maqola topilmadi' : 'Hozircha maqola saqlanmagan'}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              {hasBookmarks
                ? 'So‘rovni qisqartiring yoki qidiruvni tozalab qayta urinib ko‘ring.'
                : 'Maqola sahifasidagi xatcho‘p belgisini bosing — darslik shu ro‘yxatda paydo bo‘ladi.'}
            </Typography>
            {hasBookmarks ? (
              <Button variant="contained" onClick={() => setQuery('')} sx={{ mt: 3 }}>
                Qidiruvni tozalash
              </Button>
            ) : (
              <Button
                component={RouterLink}
                to="/algoritmlar"
                variant="contained"
                endIcon={<UiIcon icon="solar:arrow-right-linear" width={18} />}
                sx={{ mt: 3 }}
              >
                Maqolalarni ko‘rish
              </Button>
            )}
          </Box>
        )}
      </Container>
    </>
  );
}
