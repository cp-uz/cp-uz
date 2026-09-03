import { Seo } from 'shared/ui/Seo';
import { UiIcon } from 'shared/ui/UiIcon';
import { appRoutes } from 'shared/config';
import { Link as RouterLink } from 'react-router';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function NotFoundPage() {
  return (
    <>
      <Seo
        title="Sahifa topilmadi"
        description="So‘ralgan sahifa cp.uz saytida topilmadi."
      />
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          py: { xs: 8, md: 14 },
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box>
          <Box sx={{ color: 'primary.main', display: 'flex' }}>
            <UiIcon icon="solar:map-point-wave-linear" width={38} />
          </Box>
          <Typography variant="subtitle2" sx={{ mt: 2.5, color: 'primary.main' }}>
            404 · Sahifa topilmadi
          </Typography>
          <Typography component="h1" variant="h3" sx={{ mt: 1.5 }}>
            Bu manzil mavjud emas
          </Typography>
          <Typography sx={{ mt: 1.5, maxWidth: 520, color: 'text.secondary' }}>
            Havola eskirgan yoki sahifa boshqa manzilga ko‘chirilgan bo‘lishi mumkin.
            Bosh sahifaga qayting yoki algoritmlar kutubxonasidan kerakli mavzuni toping.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 4 }}>
            <Button
              component={RouterLink}
              to="/"
              variant="contained"
              startIcon={<UiIcon icon="solar:home-2-linear" width={19} />}
            >
              Bosh sahifaga
            </Button>
            <Button component={RouterLink} to={appRoutes.algorithms} color="inherit">
              Algoritmlarni ko‘rish
            </Button>
          </Stack>
        </Box>
      </Container>
    </>
  );
}
