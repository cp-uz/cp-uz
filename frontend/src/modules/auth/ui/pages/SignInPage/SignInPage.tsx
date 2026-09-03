import type { FormEvent } from 'react';

import { useState } from 'react';
import { Seo } from 'shared/ui/Seo';
import { UiIcon } from 'shared/ui/UiIcon';
import { appRoutes } from 'shared/config';
import { BrandLogo } from 'shared/ui/BrandLogo';
import { useNavigate, Link as RouterLink } from 'react-router';
import { migrateLocalEngagement } from 'modules/engagement/application';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { authApi, useAuthSession, hasSavedGuestSession } from '../../../application';

export default function SignInPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState<'login' | 'guest' | 'new-guest' | null>(null);
  const [error, setError] = useState('');
  const [guestResumeFailed, setGuestResumeFailed] = useState(false);
  const existingSession = useAuthSession();

  const complete = () => navigate(appRoutes.profile, { replace: true });

  const login = async () => {
    setError('');
    setPending('login');
    try {
      await authApi.login(username, password);
      complete();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Kirish amalga oshmadi.');
    } finally {
      setPending(null);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void login();
  };

  const continueAsGuest = async () => {
    setError('');
    setGuestResumeFailed(false);
    setPending('guest');
    try {
      const session = await authApi.continueAsGuest();
      await migrateLocalEngagement(session);
      complete();
    } catch (reason) {
      const savedGuest = hasSavedGuestSession();
      setGuestResumeFailed(savedGuest);
      setError(
        savedGuest
          ? 'Oldingi mehmon sessiyasini tiklab bo‘lmadi. Mahalliy ma’lumotlar o‘chirilmadi.'
          : reason instanceof Error
            ? reason.message
            : 'Mehmon sessiyasini yaratib bo‘lmadi.'
      );
    } finally {
      setPending(null);
    }
  };

  const startNewGuest = async () => {
    setError('');
    setGuestResumeFailed(false);
    setPending('new-guest');
    try {
      const session = await authApi.startNewGuest();
      await migrateLocalEngagement(session);
      complete();
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Yangi mehmon sessiyasini yaratib bo‘lmadi.'
      );
    } finally {
      setPending(null);
    }
  };

  return (
    <>
      <Seo
        title="Kirish"
        description="cp.uz o‘qish profilingizga kiring yoki mehmon sessiyasini davom ettiring."
        path={appRoutes.login}
        robots="noindex,nofollow"
      />
      <Box
        id="main-content"
        component="main"
        sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.default' }}
      >
        <Container
          maxWidth="sm"
          sx={{ py: { xs: 2.5, md: 3.5 }, display: 'flex', alignItems: 'center' }}
        >
          <Box sx={{ mx: 'auto', width: 1, maxWidth: 440 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: { xs: 3, md: 4 } }}
            >
              <BrandLogo />
              <Button
                component={RouterLink}
                to="/"
                color="inherit"
                size="small"
                startIcon={<UiIcon icon="solar:arrow-left-linear" width={17} />}
                sx={{ px: 0.5, fontWeight: 500, color: 'text.secondary' }}
              >
                Bosh sahifa
              </Button>
            </Stack>
            <Typography component="h1" variant="h3">
              cp.uz akkauntiga kirish
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              Saqlangan maqolalar, o‘qish holati va qaydlaringizni bir profil orqali davom ettiring.
            </Typography>

            {existingSession && (
              <Alert
                severity="info"
                icon={<UiIcon icon="solar:user-check-linear" width={20} />}
                action={
                  <Button onClick={complete} size="small">
                    Davom etish
                  </Button>
                }
                sx={{ mt: 2 }}
              >
                {existingSession.user.isGuest
                  ? 'Mehmon sessiyasi saqlangan.'
                  : `${existingSession.user.username} akkaunti saqlangan.`}
              </Alert>
            )}

            {error && (
              <Alert
                severity="error"
                sx={{ mt: 2 }}
                action={
                  guestResumeFailed ? (
                    <Button
                      color="inherit"
                      size="small"
                      disabled={Boolean(pending)}
                      onClick={() => void startNewGuest()}
                    >
                      {pending === 'new-guest'
                        ? 'Yaratilmoqda…'
                        : 'Yangi mehmon sessiyasini boshlash'}
                    </Button>
                  ) : undefined
                }
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={submit} sx={{ mt: 2.5 }}>
              <Stack spacing={2}>
                <TextField
                  required
                  fullWidth
                  label="Foydalanuvchi nomi"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <UiIcon icon="solar:user-linear" width={19} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  required
                  fullWidth
                  label="Parol"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <UiIcon icon="solar:lock-password-linear" width={19} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((shown) => !shown)}
                            edge="end"
                            aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}
                          >
                            <UiIcon
                              icon={showPassword ? 'solar:eye-closed-linear' : 'solar:eye-linear'}
                              width={19}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Button type="submit" size="large" variant="contained" disabled={Boolean(pending)}>
                  {pending === 'login' ? <CircularProgress size={20} color="inherit" /> : 'Kirish'}
                </Button>
              </Stack>
            </Box>

            <Divider sx={{ my: 2.5 }}>yoki</Divider>

            <Stack spacing={1.5}>
              <Button
                size="large"
                color="inherit"
                disabled={Boolean(pending)}
                onClick={() => void continueAsGuest()}
                startIcon={
                  pending === 'guest' ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <UiIcon icon="solar:user-id-linear" width={19} />
                  )
                }
              >
                Mehmon sifatida davom etish
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  );
}
