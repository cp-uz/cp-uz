import type { FormEvent } from 'react';
import type { LearningStats } from 'modules/learning/domain';

import { useState } from 'react';
import { UiIcon } from 'shared/ui/UiIcon';
import { appRoutes } from 'shared/config';
import { useNavigate, Link as RouterLink } from 'react-router';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { HeroIllustration } from './HeroIllustration';

const metricItems = [
  { key: 'articleCount' as const, label: 'maqola' },
  { key: 'categoryCount' as const, label: 'asosiy bo‘lim' },
  { key: 'practiceReferenceCount' as const, label: 'mashq havolasi' },
];

export function HomeHero({
  stats,
  statsLoading,
  statsError,
}: {
  stats: LearningStats;
  statsLoading: boolean;
  statsError: Error | null;
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const submit = (event: FormEvent) => {
    event.preventDefault();
    navigate(appRoutes.algorithmSearch(query));
  };
  return (
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
              slotProps={{
                htmlInput: { 'aria-label': 'Maqolalarni qidirish' },
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

        <HeroIllustration />
      </Box>
    </Container>
  );
}
