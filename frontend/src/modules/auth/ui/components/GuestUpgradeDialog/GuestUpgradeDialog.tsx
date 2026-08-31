import type { FormEvent } from 'react';
import type { AuthSession, GuestUpgradeResult } from '../../../domain';

import { useState } from 'react';
import { UiIcon } from 'shared/ui/UiIcon';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { authApi } from '../../../application';

type GuestUpgradeDialogProps = {
  open: boolean;
  onClose: () => void;
  onUpgraded: (session: AuthSession) => void;
};

export function GuestUpgradeDialog({ open, onClose, onUpgraded }: GuestUpgradeDialogProps) {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [copyError, setCopyError] = useState('');
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<GuestUpgradeResult | null>(null);

  const resetAndClose = () => {
    if (pending) return;
    setUsername('');
    setFirstName('');
    setLastName('');
    setError('');
    setCopyError('');
    setCopied(false);
    setResult(null);
    onClose();
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setPending(true);
    try {
      const upgraded = await authApi.upgradeGuest({ username, firstName, lastName });
      setResult(upgraded);
      onUpgraded(upgraded.session);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Akkauntni saqlab bo‘lmadi.');
    } finally {
      setPending(false);
    }
  };

  const copyPassword = async () => {
    if (!result) return;
    setCopyError('');
    try {
      if (!navigator.clipboard) throw new Error('Clipboard API mavjud emas.');
      await navigator.clipboard.writeText(result.oneTimePassword);
      setCopied(true);
    } catch {
      setCopied(false);
      setCopyError('Parolni avtomatik nusxalab bo‘lmadi. Uni belgilab, qo‘lda nusxalang.');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={resetAndClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="guest-upgrade-title"
      aria-describedby="guest-upgrade-description"
    >
      <DialogTitle id="guest-upgrade-title" sx={{ pr: 6 }}>
        {result ? 'Akkaunt saqlandi' : 'Akkauntni saqlash'}
        <IconButton
          onClick={resetAndClose}
          disabled={pending}
          aria-label="Oynani yopish"
          sx={{ position: 'absolute', top: 12, right: 12 }}
        >
          <UiIcon icon="solar:close-circle-linear" width={21} />
        </IconButton>
      </DialogTitle>

      {result ? (
        <>
          <DialogContent>
            <Alert severity="success" icon={<UiIcon icon="solar:check-circle-linear" width={21} />}>
              Mehmon profilingiz undagi barcha ma’lumotlar bilan akkauntga aylantirildi.
            </Alert>
            <Typography id="guest-upgrade-description" variant="body2" sx={{ mt: 2.5 }}>
              Quyidagi yangi parol faqat shu oynada ko‘rsatiladi.
            </Typography>
            <Stack spacing={1.5} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Foydalanuvchi nomi"
                value={result.username}
                slotProps={{ input: { readOnly: true } }}
              />
              <TextField
                fullWidth
                label="Yangi parol"
                value={result.oneTimePassword}
                slotProps={{
                  input: {
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => void copyPassword()}
                          aria-label="Parolni nusxalash"
                          edge="end"
                        >
                          <UiIcon icon="solar:copy-linear" width={20} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ '& input': { fontFamily: 'JetBrains Mono Variable, monospace' } }}
              />
            </Stack>
            <Typography
              component="p"
              variant="caption"
              aria-live="polite"
              sx={{ mt: 1, minHeight: 20, color: copyError ? 'error.main' : 'success.main' }}
            >
              {copyError || (copied ? 'Parol nusxalandi.' : '')}
            </Typography>
            <Alert severity="warning" sx={{ mt: 1.5 }}>
              Parolni hozir xavfsiz joyga saqlang. Bu oynani yopgach uni qayta ko‘rib bo‘lmaydi.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={resetAndClose} variant="contained">
              Parolni saqladim
            </Button>
          </DialogActions>
        </>
      ) : (
        <Box component="form" onSubmit={submit}>
          <DialogContent>
            <Typography id="guest-upgrade-description" variant="body2" color="text.secondary">
              Yangi foydalanuvchi nomini tanlang. Saqlangan maqolalar, o‘qish holati, qaydlar va
              lug‘at natijalari shu akkauntda qoladi.
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            <Box
              sx={{
                mt: 2.5,
                gap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
              }}
            >
              <TextField
                fullWidth
                label="Ism (ixtiyoriy)"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                autoComplete="given-name"
                slotProps={{ htmlInput: { maxLength: 150 } }}
              />
              <TextField
                fullWidth
                label="Familiya (ixtiyoriy)"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                autoComplete="family-name"
                slotProps={{ htmlInput: { maxLength: 150 } }}
              />
            </Box>
            <TextField
              autoFocus
              required
              fullWidth
              label="Foydalanuvchi nomi"
              value={username}
              onChange={(event) => setUsername(event.target.value.toLowerCase())}
              autoComplete="username"
              helperText="3–30 belgi: kichik lotin harfi, raqam, pastki chiziq (_) yoki chiziqcha (-)."
              slotProps={{
                htmlInput: {
                  minLength: 3,
                  maxLength: 30,
                  pattern: '[a-z][a-z0-9_-]{2,29}',
                },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <UiIcon icon="solar:user-linear" width={19} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={resetAndClose} color="inherit" disabled={pending}>
              Bekor qilish
            </Button>
            <Button type="submit" variant="contained" disabled={pending || username.length < 3}>
              {pending ? <CircularProgress size={20} color="inherit" /> : 'Akkauntni saqlash'}
            </Button>
          </DialogActions>
        </Box>
      )}
    </Dialog>
  );
}
