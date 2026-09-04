import { UiIcon } from 'shared/ui/UiIcon';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export function ContributionBanner({ articleCount }: { articleCount: number }) {
  return (
    <Box
      component="section"
      sx={{
        pb: { xs: 7, md: 9 },
        contentVisibility: 'auto',
        containIntrinsicSize: 'auto 180px',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={(theme) => ({
            px: { xs: 2.5, md: 3 },
            py: 2.5,
            color: 'primary.darker',
            bgcolor: 'primary.lighter',
            borderRadius: 1.5,
            ...theme.applyStyles('dark', {
              color: 'primary.lighter',
              bgcolor: 'primary.darker',
            }),
          })}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems={{ md: 'center' }}
            justifyContent="space-between"
          >
            <Box>
              <Typography component="h2" variant="subtitle1">
                Tahrir holati ochiq ko‘rsatiladi
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 0.5, maxWidth: 800, color: 'inherit', opacity: 0.8 }}
              >
                Kutubxonadagi {articleCount || 'barcha'} maqola nashr qilingan. Hamjamiyat
                tekshiruvi va tuzatish takliflari doim ochiq.
              </Typography>
            </Box>
            <Button
              component="a"
              href="https://github.com/cp-uz/cp-uz"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              endIcon={<UiIcon icon="solar:arrow-right-up-linear" width={18} />}
            >
              Hissa qo‘shish
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
