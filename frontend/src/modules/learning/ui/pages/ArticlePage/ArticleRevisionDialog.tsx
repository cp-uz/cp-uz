import type { articleProvenance } from './article-provenance';

import { formatUzbekDate } from 'shared/lib/i18n';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

export function ArticleRevisionDialog({
  revisions,
  open,
  onClose,
}: {
  revisions: ReturnType<typeof articleProvenance>['revisions'];
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Versiyalar tarixi</DialogTitle>
      <DialogContent>
        <Stack divider={<Divider flexItem />}>
          {revisions.map((revision) => (
            <Box key={`${revision.version}-${revision.date}`} sx={{ py: 2 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle2">{revision.version}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {formatUzbekDate(revision.date)}
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {revision.note}
              </Typography>
              <Typography
                variant="caption"
                sx={{ mt: 0.5, display: 'block', color: 'text.secondary' }}
              >
                {revision.author}
              </Typography>
            </Box>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
