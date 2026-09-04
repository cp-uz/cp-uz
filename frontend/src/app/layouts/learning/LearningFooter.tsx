import { apiUrl } from 'shared/api/http';
import { UiIcon } from 'shared/ui/UiIcon';
import { BrandLogo } from 'shared/ui/BrandLogo';
import { useLocation, Link as RouterLink } from 'react-router';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { footerItems } from './navigation-items';

export function LearningFooter() {
  const { pathname } = useLocation();
  return (
    <Box component="footer" sx={{ mt: 'auto', bgcolor: 'background.default' }}>
      <Divider />
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 5 } }}>
        <Box
          sx={{
            gap: 4,
            display: 'grid',
            alignItems: 'start',
            gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr 1fr' },
          }}
        >
          <Box>
            <BrandLogo />
            <Typography variant="body2" sx={{ mt: 2, maxWidth: 360, color: 'text.secondary' }}>
              Sport dasturlashni o‘zbek tilida tizimli o‘rganish uchun ochiq kutubxona.
            </Typography>
          </Box>
          <Stack spacing={1.25}>
            <Typography component="h2" variant="subtitle2" sx={{ color: 'text.primary' }}>
              O‘rganish
            </Typography>
            {footerItems.map((item) => {
              const selected = pathname === item.to || pathname.startsWith(`${item.to}/`);
              return (
                <Button
                  key={item.to}
                  component={RouterLink}
                  to={item.to}
                  color="inherit"
                  size="small"
                  startIcon={<UiIcon icon={item.icon} width={18} />}
                  sx={{
                    px: 0.5,
                    py: 0.625,
                    alignSelf: 'flex-start',
                    fontWeight: 400,
                    color: selected ? 'primary.main' : 'text.secondary',
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Stack>
          <Stack spacing={1.25}>
            <Typography component="h2" variant="subtitle2" sx={{ color: 'text.primary' }}>
              Loyiha
            </Typography>
            <Button
              component="a"
              href="https://github.com/cp-uz/cp-uz"
              target="_blank"
              rel="noreferrer"
              color="inherit"
              size="small"
              startIcon={<UiIcon icon="mingcute:github-line" width={18} />}
              sx={{
                px: 0.5,
                py: 0.625,
                alignSelf: 'flex-start',
                color: 'text.secondary',
                fontWeight: 400,
              }}
            >
              GitHub
            </Button>
            <Button
              component="a"
              href="https://t.me/cp_uz"
              target="_blank"
              rel="noreferrer"
              color="inherit"
              size="small"
              startIcon={<UiIcon icon="mingcute:telegram-line" width={18} />}
              sx={{
                px: 0.5,
                py: 0.625,
                alignSelf: 'flex-start',
                color: 'text.secondary',
                fontWeight: 400,
              }}
            >
              Telegram
            </Button>
            <Button
              component="a"
              href={apiUrl('/community/discord/')}
              target="_blank"
              rel="noreferrer"
              color="inherit"
              size="small"
              startIcon={<UiIcon icon="mingcute:discord-line" width={18} />}
              sx={{
                px: 0.5,
                py: 0.625,
                alignSelf: 'flex-start',
                color: 'text.secondary',
                fontWeight: 400,
              }}
            >
              Discord
            </Button>
          </Stack>
        </Box>
        <Divider sx={{ my: 4 }} />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between">
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            © 2026 cp.uz · Matnlar manba ko‘rsatilib va shu litsenziyada ulashiladi:{' '}
            <Link
              href="https://creativecommons.org/licenses/by-sa/4.0/deed.uz"
              target="_blank"
              rel="noreferrer"
              color="inherit"
            >
              CC BY-SA 4.0
            </Link>
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Ochiq manba · O‘zbekcha bilim ombori
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
