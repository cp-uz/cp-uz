import { UiIcon } from 'shared/ui/UiIcon';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { ACCEPTED_ATTACHMENT_TYPES } from '../../../domain/feedback';
import { useFeedbackForm } from '../../../application/use-feedback-form';

export function FeedbackSection() {
  const {
    fileInputRef,
    fullName,
    setFullName,
    contact,
    setContact,
    note,
    setNote,
    attachment,
    attachmentError,
    status,
    submitError,
    selectAttachment,
    removeAttachment,
    submit,
  } = useFeedbackForm();
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
                disabled={status === 'submitting'}
                required
                fullWidth
                label="Ism-familiya"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                slotProps={{ htmlInput: { maxLength: 160 } }}
              />
              <TextField
                disabled={status === 'submitting'}
                fullWidth
                label="Aloqa (ixtiyoriy)"
                placeholder="Telegram, telefon yoki email"
                value={contact}
                onChange={(event) => setContact(event.target.value)}
                slotProps={{ htmlInput: { maxLength: 255 } }}
              />
              <TextField
                disabled={status === 'submitting'}
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
                disabled={status === 'submitting'}
                accept={ACCEPTED_ATTACHMENT_TYPES}
                onChange={selectAttachment}
              />
              {attachment ? (
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minHeight: 44 }}>
                  <UiIcon icon="solar:file-check-linear" width={21} />
                  <Typography variant="body2" sx={{ minWidth: 0, flexGrow: 1 }} noWrap>
                    {attachment.name}
                  </Typography>
                  <Button
                    color="inherit"
                    size="small"
                    disabled={status === 'submitting'}
                    onClick={removeAttachment}
                  >
                    Olib tashlash
                  </Button>
                </Stack>
              ) : (
                <Button
                  color="inherit"
                  disabled={status === 'submitting'}
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
