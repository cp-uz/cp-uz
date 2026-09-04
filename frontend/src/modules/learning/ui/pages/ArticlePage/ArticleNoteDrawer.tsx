import type { useArticleNote } from 'modules/engagement/application';

import { UiIcon } from 'shared/ui/UiIcon';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

export function ArticleNoteDrawer({
  title,
  hasSession,
  state,
}: {
  title: string;
  hasSession: boolean;
  state: ReturnType<typeof useArticleNote>;
}) {
  const { note, setNote, notesOpen, setNotesOpen, saveNote, noteError, noteSaving } = state;
  return (
    <Drawer
      anchor="right"
      open={notesOpen}
      onClose={() => setNotesOpen(false)}
      slotProps={{
        paper: {
          sx: {
            width: { xs: 1, sm: 440 },
            display: 'flex',
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            backdropFilter: 'none',
          },
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        spacing={2}
        sx={{ p: 3 }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
            Shaxsiy qayd
          </Typography>
          <Typography variant="h5" sx={{ mt: 0.75 }}>
            {title}
          </Typography>
        </Box>
        <IconButton aria-label="Qaydni yopish" onClick={() => setNotesOpen(false)}>
          <UiIcon icon="solar:close-circle-linear" />
        </IconButton>
      </Stack>
      <Divider />
      <Box sx={{ p: 3, minHeight: 0, flexGrow: 1, overflowY: 'auto' }}>
        <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ color: 'text.secondary' }}>
          <UiIcon
            icon={note.trim() ? 'solar:check-circle-linear' : 'solar:shield-user-linear'}
            width={19}
          />
          <Typography variant="body2" sx={{ color: 'inherit' }}>
            {note.trim()
              ? 'Saqlangan qaydni tahrirlayapsiz.'
              : hasSession
                ? 'Bu qayd profilingizda saqlanadi va faqat sizga ko‘rinadi.'
                : 'Bu qayd shu brauzerda saqlanadi va faqat sizga ko‘rinadi.'}
          </Typography>
        </Stack>
        {noteError && (
          <Typography variant="body2" sx={{ mt: 2, color: 'error.main' }}>
            {noteError}
          </Typography>
        )}
        <TextField
          fullWidth
          multiline
          minRows={12}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Savol, formula yoki qisqa xulosa..."
          slotProps={{ htmlInput: { 'aria-label': 'Shaxsiy qayd matni' } }}
          sx={{ mt: 3 }}
        />
      </Box>
      <Divider />
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        sx={{ p: 2.5 }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {note.length} belgi
        </Typography>
        <Button variant="contained" disabled={noteSaving} onClick={() => void saveNote()}>
          {noteSaving ? 'Saqlanmoqda…' : 'Qaydni saqlash'}
        </Button>
      </Stack>
    </Drawer>
  );
}
