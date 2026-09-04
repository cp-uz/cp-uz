import type { FormEvent, ChangeEvent } from 'react';

import { useRef, useState } from 'react';
import { apiUrl } from 'shared/api/http';
import { UiIcon } from 'shared/ui/UiIcon';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024;
const ACCEPTED_ATTACHMENT_TYPES = '.jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.txt';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

function errorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;
  const error = 'error' in payload ? payload.error : null;
  if (!error || typeof error !== 'object' || !('detail' in error)) return null;
  return typeof error.detail === 'string' ? error.detail : null;
}

export function FeedbackSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState('');
  const [contact, setContact] = useState('');
  const [note, setNote] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentError, setAttachmentError] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [submitError, setSubmitError] = useState('');

  const selectAttachment = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (file && file.size > MAX_ATTACHMENT_SIZE) {
      setAttachment(null);
      setAttachmentError('Fayl hajmi 5 MB dan oshmasligi kerak.');
      event.target.value = '';
      return;
    }
    setAttachment(file);
    setAttachmentError('');
  };

  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (attachmentError) return;

    setStatus('submitting');
    setSubmitError('');
    const body = new FormData();
    body.append('full_name', fullName.trim());
    body.append('contact', contact.trim());
    body.append('note', note.trim());
    if (attachment) body.append('attachment', attachment);

    try {
      const response = await fetch(apiUrl('/api/v1/feedback/'), { method: 'POST', body });
      const payload: unknown = await response.json().catch(() => null);
      if (!response.ok) throw new Error(errorMessage(payload) ?? 'Murojaatni yuborib bo‘lmadi.');

      setFullName('');
      setContact('');
      setNote('');
      removeAttachment();
      setStatus('success');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Murojaatni yuborib bo‘lmadi.');
      setStatus('error');
    }
  };

  return (
    <Box
      component="section"
      id="feedback"
      aria-labelledby="feedback-heading"
      sx={{
        py: { xs: 7, md: 9 },
        contentVisibility: 'auto',
        containIntrinsicSize: 'auto 720px',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            gap: { xs: 4, md: 8 },
            display: 'grid',
            alignItems: 'start',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(280px, 0.72fr) minmax(0, 1.28fr)' },
          }}
        >
          <Box sx={{ maxWidth: 460 }}>
            <Typography component="span" variant="subtitle2" sx={{ color: 'primary.dark' }}>
              Aloqa
            </Typography>
            <Typography id="feedback-heading" component="h2" variant="h3" sx={{ mt: 1 }}>
              Fikringizni qoldiring
            </Typography>
            <Typography sx={{ mt: 1.5, color: 'text.secondary' }}>
              Xato topdingizmi, yangi material yoki imkoniyat taklif qilmoqchimisiz? Jamoamizga
              to‘g‘ridan-to‘g‘ri yozing.
            </Typography>
          </Box>

          <Box component="form" onSubmit={submit} noValidate>
            <Box
              sx={{
                gap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
              }}
            >
              <TextField
                required
                fullWidth
                label="Ism-familiya"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                slotProps={{ htmlInput: { maxLength: 160 } }}
              />
              <TextField
                fullWidth
                label="Aloqa (ixtiyoriy)"
                placeholder="Telegram, telefon yoki email"
                value={contact}
                onChange={(event) => setContact(event.target.value)}
                slotProps={{ htmlInput: { maxLength: 255 } }}
              />
              <TextField
                required
                fullWidth
                multiline
                minRows={5}
                label="Izoh"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                sx={{ gridColumn: '1 / -1' }}
                slotProps={{ htmlInput: { maxLength: 3000 } }}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <input
                ref={fileInputRef}
                hidden
                type="file"
                accept={ACCEPTED_ATTACHMENT_TYPES}
                onChange={selectAttachment}
              />
              {attachment ? (
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minHeight: 44 }}>
                  <UiIcon icon="solar:file-check-linear" width={21} />
                  <Typography variant="body2" sx={{ minWidth: 0, flexGrow: 1 }} noWrap>
                    {attachment.name}
                  </Typography>
                  <Button color="inherit" size="small" onClick={removeAttachment}>
                    Olib tashlash
                  </Button>
                </Stack>
              ) : (
                <Button
                  color="inherit"
                  onClick={() => fileInputRef.current?.click()}
                  startIcon={<UiIcon icon="solar:paperclip-linear" width={20} />}
                >
                  Hujjat yoki rasm biriktirish
                </Button>
              )}
              {attachmentError && (
                <Typography
                  variant="caption"
                  sx={{ display: 'block', mt: 0.5, color: 'error.main' }}
                >
                  {attachmentError}
                </Typography>
              )}
            </Box>

            {status === 'success' && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Rahmat. Murojaatingiz jamoaga yuborildi.
              </Alert>
            )}
            {status === 'error' && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {submitError}
              </Alert>
            )}

            <Button
              type="submit"
              size="large"
              variant="contained"
              disabled={status === 'submitting' || !fullName.trim() || !note.trim()}
              endIcon={<UiIcon icon="solar:arrow-right-linear" width={19} />}
              sx={{ mt: 3 }}
            >
              {status === 'submitting' ? 'Yuborilmoqda…' : 'Murojaatni yuborish'}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
