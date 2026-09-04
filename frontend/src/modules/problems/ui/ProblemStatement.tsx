import { Suspense, useState } from 'react';
import { lazyWithReload } from 'shared/pwa';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';

import { pdfHttpUrl } from './pdf-links';

const PdfStatement = lazyWithReload(() =>
  import('./PdfStatement').then((module) => ({ default: module.PdfStatement }))
);
export const ProblemMarkdown = lazyWithReload(() =>
  import('modules/learning/markdown').then((module) => ({ default: module.RichMarkdown }))
);

export function ProblemStatement({
  pdfUrl,
  title,
  markdown,
  sourcePath,
}: {
  pdfUrl?: string;
  title: string;
  markdown: string;
  sourcePath: string;
}) {
  const safePdfUrl = pdfUrl && pdfHttpUrl(pdfUrl, true);
  const [textMode, setTextMode] = useState(!safePdfUrl);
  return (
    <Box id="problem-statement" sx={{ mt: 4 }}>
      {safePdfUrl && (
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Button
            variant={!textMode ? 'contained' : 'outlined'}
            aria-pressed={!textMode}
            onClick={() => setTextMode(false)}
          >
            PDF
          </Button>
          <Button
            variant={textMode ? 'contained' : 'outlined'}
            aria-pressed={textMode}
            onClick={() => setTextMode(true)}
          >
            Matn ko‘rinishi
          </Button>
          <Button component="a" href={safePdfUrl} target="_blank" rel="noopener noreferrer">
            PDF’ni ochish
          </Button>
        </Stack>
      )}
      <Suspense
        fallback={<Skeleton variant="rectangular" sx={{ width: '100%', minHeight: 360 }} />}
      >
        {safePdfUrl && !textMode ? (
          <PdfStatement source={safePdfUrl} title={title} />
        ) : (
          <Box
            sx={{
              p: { xs: 2, md: 4 },
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <ProblemMarkdown sourcePath={sourcePath}>{markdown}</ProblemMarkdown>
          </Box>
        )}
      </Suspense>
    </Box>
  );
}
