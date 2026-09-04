import type { ProblemDetail } from '../domain';

import { Seo } from 'shared/ui/Seo';
import { appRoutes } from 'shared/config';
import { RichMarkdown } from 'modules/learning/markdown';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';

export default function ProblemPrint({ problem }: { problem: ProblemDetail }) {
  const displayTitle = problem.originalTitle || problem.title;
  return (
    <>
      <Seo
        title={`${displayTitle} · ${problem.event.shortTitle || problem.event.title}`}
        description={`${problem.event.shortTitle || problem.event.title}: ${problem.title} masalasi.`}
        path={appRoutes.task(problem.season.slug, problem.event.slug, problem.slug)}
      />
      <GlobalStyles
        styles={{
          '@page': { size: 'A4', margin: '14mm 15mm 16mm' },
          '@media print': {
            'html, body, #root': { backgroundColor: '#fff !important' },
            'body > #root header, body > #root footer': { display: 'none !important' },
            'body > #root main': { minHeight: '0 !important', padding: '0 !important' },
          },
        }}
      />
      <Box
        id="problem-pdf-export"
        data-ready="true"
        sx={{
          width: '100%',
          mx: 'auto',
          color: '#17202a',
          bgcolor: '#fff',
          fontFamily: 'Inter, Arial, sans-serif',
        }}
      >
        <Box sx={{ pb: '6mm', mb: '9mm', borderBottom: '2px solid #0877e1' }}>
          <Typography
            sx={{ color: '#0877e1', fontSize: 13, fontWeight: 800, letterSpacing: '.04em' }}
          >
            cp.uz
          </Typography>
          <Typography
            sx={{
              mt: '2mm',
              color: '#657786',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '.08em',
            }}
          >
            {problem.season.title.toUpperCase()}
          </Typography>
          <Typography
            component="h1"
            sx={{ mt: '4mm', mb: '2mm', fontSize: 27, fontWeight: 800, lineHeight: 1.15 }}
          >
            {displayTitle}
          </Typography>
          <Typography sx={{ m: 0, color: '#657786', fontSize: 11 }}>
            {problem.event.shortTitle || problem.event.title} · {problem.problemSet.title} ·{' '}
            {problem.code}
          </Typography>
        </Box>
        <Box
          id="problem-statement"
          sx={{
            '& p, & li': { fontSize: '11.2px !important', lineHeight: '1.55 !important' },
            '& h2': {
              mt: '7mm !important',
              mb: '3mm !important',
              fontSize: '19px !important',
              breakAfter: 'avoid',
            },
            '& h3': {
              mt: '5mm !important',
              mb: '2mm !important',
              fontSize: '15px !important',
              breakAfter: 'avoid',
            },
            '& img, & svg': { maxWidth: '100% !important', height: 'auto !important' },
            '& pre, & table, & blockquote': { breakInside: 'avoid' },
            '& table': { fontSize: '9.5px !important' },
            '& button': { display: 'none !important' },
            '& a': { color: 'inherit !important', textDecoration: 'none !important' },
          }}
        >
          <RichMarkdown sourcePath={problem.sourcePath}>{problem.statementMarkdown}</RichMarkdown>
        </Box>
      </Box>
    </>
  );
}
