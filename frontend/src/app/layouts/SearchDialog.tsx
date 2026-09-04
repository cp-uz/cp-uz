import type { FormEvent } from 'react';

import { useMemo, useState } from 'react';
import { UiIcon } from 'shared/ui/UiIcon';
import { appRoutes } from 'shared/config';
import { useAsyncData, useDebouncedValue } from 'shared/hooks';
import { useNavigate, Link as RouterLink } from 'react-router';
import { filterArticles, getArticlePath } from 'modules/learning/domain';
import { learningQueries as learningApi } from 'modules/learning/application';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemButton from '@mui/material/ListItemButton';

type SearchDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function SearchDialog({ open, onClose }: SearchDialogProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);
  const { data: allArticles, error: articleLoadError } = useAsyncData(
    learningApi.listArticles,
    [],
    []
  );
  const matches = useMemo(
    () => filterArticles(allArticles, debouncedQuery).slice(0, 6),
    [allArticles, debouncedQuery]
  );

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    navigate(appRoutes.algorithmSearch(query));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={submitSearch}>
        <TextField
          autoFocus
          fullWidth
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Algoritm, mavzu yoki atama..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <UiIcon icon="solar:magnifer-linear" width={22} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button type="button" size="small" color="inherit" onClick={onClose}>
                    ESC
                  </Button>
                </InputAdornment>
              ),
              sx: { px: 1, '& fieldset': { border: 0 } },
            },
          }}
        />
        <Divider />
        <Typography
          variant="subtitle2"
          sx={{ display: 'block', px: 2.5, pt: 2, color: 'text.secondary' }}
        >
          {query ? `${matches.length} ta natija` : 'Maqolalar'}
        </Typography>
        <List sx={{ px: 1, pb: 1.5, maxHeight: 420, overflow: 'auto' }}>
          {matches.map((article) => (
            <ListItemButton
              key={article.sourceId ?? article.slug}
              component={RouterLink}
              to={getArticlePath(article)}
              onClick={onClose}
              sx={{ borderRadius: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <UiIcon icon="solar:document-text-linear" width={20} />
              </ListItemIcon>
              <ListItemText
                primary={article.title}
                secondary={`${article.category} · ${article.readTime} daqiqa`}
                slotProps={{
                  primary: { variant: 'subtitle2' },
                  secondary: { variant: 'caption' },
                }}
              />
              <UiIcon icon="solar:alt-arrow-right-linear" width={18} />
            </ListItemButton>
          ))}
          {articleLoadError && (
            <Typography variant="body2" sx={{ py: 5, textAlign: 'center', color: 'error.main' }}>
              Kutubxonani yuklab bo‘lmadi. Server bilan ulanishni tekshiring.
            </Typography>
          )}
          {!articleLoadError && !matches.length && (
            <Typography
              variant="body2"
              sx={{ py: 5, textAlign: 'center', color: 'text.secondary' }}
            >
              Bu so‘rov bo‘yicha hech narsa topilmadi.
            </Typography>
          )}
        </List>
        <Divider />
        <Stack direction="row" justifyContent="flex-end" sx={{ p: 1.5 }}>
          <Button
            type="submit"
            variant="contained"
            endIcon={<UiIcon icon="solar:arrow-right-linear" width={18} />}
          >
            Barcha natijalarni ko‘rish
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}
