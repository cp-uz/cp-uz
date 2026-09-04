import type { useArticleShare } from './use-article-share';

import { UiIcon } from 'shared/ui/UiIcon';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

export function ArticleShareDialog({ state }: { state: ReturnType<typeof useArticleShare> }) {
  const {
    shareOpen,
    setShareOpen,
    shareCopied,
    canNativeShare,
    copyShareLink,
    shareArticle,
    shareError,
  } = state;
  return (
    <Dialog open={shareOpen} onClose={() => setShareOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Maqolani ulashish
        <IconButton aria-label="Ulashishni yopish" onClick={() => setShareOpen(false)}>
          <UiIcon icon="solar:close-circle-linear" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pb: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Doimiy havolani nusxalang yoki qurilmangizdagi ulashish oynasini oching.
        </Typography>
        <TextField
          fullWidth
          value={window.location.href}
          slotProps={{
            htmlInput: { readOnly: true, 'aria-label': 'Maqolaning doimiy havolasi' },
          }}
          sx={{ mt: 2.5 }}
        />
        {shareError && (
          <Typography role="status" color="error" sx={{ mt: 2 }}>
            {shareError}
          </Typography>
        )}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => void copyShareLink()}
            startIcon={
              <UiIcon
                icon={shareCopied ? 'solar:check-circle-bold' : 'solar:copy-linear'}
                width={18}
              />
            }
          >
            {shareCopied ? 'Havola nusxalandi' : 'Havolani nusxalash'}
          </Button>
          {canNativeShare && (
            <Button
              color="inherit"
              onClick={() => void shareArticle()}
              startIcon={<UiIcon icon="solar:share-linear" width={18} />}
            >
              Qurilmada ulashish
            </Button>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
