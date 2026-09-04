import type { GlossaryTerm } from '../../../domain';

import { useState } from 'react';
import { useAuthSession, ensureAuthSession } from 'modules/auth/application';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { QuizQuestion } from './QuizQuestion';
import { QuizLeaderboard } from './QuizLeaderboard';
import { useRankedQuiz } from '../../../application/use-ranked-quiz';
import { useGlossaryQuiz } from '../../../application/use-glossary-quiz';

function Practice({ terms, owner }: { terms: GlossaryTerm[]; owner: number | string }) {
  const quiz = useGlossaryQuiz(terms, owner);
  if (!quiz.question) return <Typography>Savollar uchun atamalar yetarli emas.</Typography>;
  return (
    <>
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Mashq natijalari shu qurilmada saqlanadi. Reytingga kiritilmaydi.
      </Typography>
      <QuizQuestion
        key={quiz.question.id}
        question={quiz.question}
        answered={quiz.answered}
        correctAnswer={quiz.question.correctAnswer}
        onSubmit={quiz.submit}
        onNext={quiz.next}
      />
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 3 }}>
        <Typography variant="body2">
          {quiz.stats.correct}/{quiz.stats.attempts} to‘g‘ri · eng yaxshi seriya{' '}
          {quiz.stats.bestStreak}
        </Typography>
        <Button size="small" onClick={quiz.clearStats}>
          Tozalash
        </Button>
      </Stack>
    </>
  );
}

function Ranked({ owner, onScore }: { owner: number | string; onScore: () => void }) {
  const quiz = useRankedQuiz(owner, onScore);
  return (
    <>
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Javobingiz tekshirilgach, natija profilingiz va reytingda saqlanadi.
      </Typography>
      {quiz.storageWarning && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {quiz.storageWarning}
        </Alert>
      )}
      {quiz.error && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" onClick={() => void quiz.retry()}>
              Qayta urinish
            </Button>
          }
        >
          {quiz.error}
        </Alert>
      )}
      {!quiz.question && quiz.loading && <Typography role="status">Savol yuklanmoqda…</Typography>}
      {quiz.question && (
        <QuizQuestion
          key={quiz.question.id}
          question={quiz.question}
          answered={quiz.answer?.isCorrect ?? null}
          submittedAnswer={quiz.submittedAnswer}
          correctAnswer={quiz.answer?.correctAnswer}
          loading={quiz.loading}
          onSubmit={quiz.submit}
          onNext={() => void quiz.next()}
        />
      )}
    </>
  );
}

export function GlossaryQuiz({ terms }: { terms: GlossaryTerm[] }) {
  const session = useAuthSession();
  const [ranked, setRanked] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const start = async () => {
    setStarting(true);
    setError('');
    try {
      await ensureAuthSession();
      setRanked(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Reytingga ulanib bo‘lmadi.');
    } finally {
      setStarting(false);
    }
  };
  return (
    <Box
      id="mini-test"
      component="section"
      aria-labelledby="glossary-quiz-title"
      sx={{ mt: { xs: 6, md: 8 }, scrollMarginTop: '96px' }}
    >
      <Divider sx={{ mb: 4 }} />
      <Typography id="glossary-quiz-title" variant="h5">
        Mini test
      </Typography>
      <Stack direction="row" spacing={1} sx={{ my: 3 }}>
        <Button
          aria-pressed={!ranked || !session}
          variant={!ranked || !session ? 'contained' : 'outlined'}
          onClick={() => setRanked(false)}
        >
          Mashq
        </Button>
        <Button
          aria-pressed={ranked && Boolean(session)}
          disabled={starting}
          variant={ranked && session ? 'contained' : 'outlined'}
          onClick={() => void start()}
        >
          {starting ? 'Ulanmoqda…' : 'Reyting'}
        </Button>
      </Stack>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.4fr) minmax(260px, .6fr)' },
          gap: { xs: 4, md: 6 },
        }}
      >
        <Box>
          {ranked && session ? (
            <Ranked
              key={`${session.user.id}:${session.sessionKey ?? ''}`}
              owner={session.user.id}
              onScore={() => setRevision((value) => value + 1)}
            />
          ) : (
            <Practice
              key={session?.user.id ?? 'anonymous'}
              terms={terms}
              owner={session?.user.id ?? 'anonymous'}
            />
          )}
        </Box>
        <QuizLeaderboard owner={session?.user.id} revision={revision} />
      </Box>
    </Box>
  );
}
