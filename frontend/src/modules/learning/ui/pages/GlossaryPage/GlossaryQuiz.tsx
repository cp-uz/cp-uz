import type { GlossaryTerm } from '../../../domain';

import { UiIcon } from 'shared/ui/UiIcon';
import { Link as RouterLink } from 'react-router';
import { useRef, useState, useEffect } from 'react';
import { getAuthSession } from 'modules/auth/application';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import {
  useGlossaryQuiz,
  glossaryLeaderboardApi,
  type GlossaryLeaderboardEntry,
} from '../../../application';

export function GlossaryQuiz({ terms }: { terms: GlossaryTerm[] }) {
  const quiz = useGlossaryQuiz(terms);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [leaderboard, setLeaderboard] = useState<GlossaryLeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState('');
  const [scoreSyncing, setScoreSyncing] = useState(false);
  const [scoreSyncError, setScoreSyncError] = useState('');
  const submittedAnswerId = useRef('');
  const hasSession = Boolean(getAuthSession());
  const accuracy = quiz.stats.attempts
    ? Math.round((quiz.stats.correct / quiz.stats.attempts) * 100)
    : 0;

  const submit = () => quiz.submit(selectedAnswer);

  const next = () => {
    quiz.next();
    setSelectedAnswer('');
  };

  useEffect(() => {
    let active = true;
    setLeaderboardLoading(true);
    glossaryLeaderboardApi
      .listLeaderboard()
      .then((state) => {
        if (active) setLeaderboard(state.leaderboard);
      })
      .catch(() => {
        if (active) setLeaderboardError('Reytingni hozir yuklab bo‘lmadi.');
      })
      .finally(() => {
        if (active) setLeaderboardLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const answer = quiz.latestAnswer;
    if (!answer || !hasSession || submittedAnswerId.current === answer.id) return;
    submittedAnswerId.current = answer.id;
    setScoreSyncing(true);
    setScoreSyncError('');
    glossaryLeaderboardApi
      .submitScore(answer.isCorrect)
      .then((state) => setLeaderboard(state.leaderboard))
      .catch(() => setScoreSyncError('Javob qurilmada saqlandi, ammo reytingga yuborilmadi.'))
      .finally(() => setScoreSyncing(false));
  }, [hasSession, quiz.latestAnswer]);

  if (!quiz.question) return null;

  return (
    <Box
      id="mini-test"
      component="section"
      aria-labelledby="glossary-quiz-title"
      sx={{ mt: { xs: 6, md: 8 }, scrollMarginTop: '96px' }}
    >
      <Divider sx={{ mb: { xs: 4, md: 5 } }} />
      <Box sx={{ display: 'grid', gap: { xs: 4, md: 6 }, gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.4fr) minmax(260px, .6fr)' } }}>
        <Box>
          <Typography id="glossary-quiz-title" variant="h5">Mini test</Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Savollar cheksiz davom etadi: har safar to‘rtta variantdan bittasini tanlang.
            Natija shu qurilmada{hasSession ? ' va profilingizda' : ''} saqlanadi.
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 3 }}>
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
              {quiz.question.modeLabel}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Cheksiz oqim</Typography>
          </Stack>
          <Typography variant="body2" sx={{ mt: 0.75, color: 'text.secondary' }}>
            {quiz.question.instruction}
          </Typography>
          <Typography
            id="glossary-question-prompt"
            variant={quiz.question.mode.startsWith('definition') ? 'body1' : 'h6'}
            sx={{ mt: 1.5, maxWidth: 680, lineHeight: 1.65 }}
          >
            {quiz.question.prompt}
          </Typography>

          <RadioGroup
            name={quiz.question.id}
            value={selectedAnswer}
            aria-labelledby="glossary-question-prompt"
            onChange={(event) => {
              if (quiz.answered === null) setSelectedAnswer(event.target.value);
            }}
            sx={{ mt: 2, gap: 0.75 }}
          >
            {quiz.question.options.map((option) => {
              const revealed = quiz.answered !== null;
              const correctOption = option === quiz.question?.correctAnswer;
              const selectedWrong = revealed && option === selectedAnswer && !correctOption;
              const outcomeColor = correctOption
                ? 'success.main'
                : selectedWrong
                  ? 'error.main'
                  : 'text.primary';

              return (
                <FormControlLabel
                  key={option}
                  value={option}
                  disabled={revealed}
                  control={<Radio size="small" />}
                  label={<Typography variant="body2" sx={{ fontWeight: revealed && correctOption ? 600 : 400 }}>{option}</Typography>}
                  sx={{
                    m: 0,
                    px: 1,
                    py: 0.5,
                    minHeight: 46,
                    borderRadius: 1,
                    color: revealed ? outcomeColor : 'text.primary',
                    bgcolor: correctOption && revealed ? 'success.lighter' : selectedWrong ? 'error.lighter' : 'transparent',
                    '&:hover': { bgcolor: revealed ? undefined : 'action.hover' },
                    '& .MuiRadio-root.Mui-disabled': { color: outcomeColor },
                    '& .MuiFormControlLabel-label.Mui-disabled': { color: outcomeColor },
                  }}
                />
              );
            })}
          </RadioGroup>

          <Box sx={{ mt: 2 }}>
            {quiz.answered === null ? (
              <Button type="button" variant="contained" disabled={!selectedAnswer} onClick={submit}>
                Tekshirish
              </Button>
            ) : (
              <Button type="button" variant="contained" onClick={next} endIcon={<UiIcon icon="solar:arrow-right-linear" width={17} />}>
                Keyingi savol
              </Button>
            )}
          </Box>
          {quiz.answered !== null && (
            <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mt: 2, color: quiz.answered ? 'success.main' : 'error.main' }}>
              <UiIcon icon={quiz.answered ? 'solar:check-circle-linear' : 'solar:close-circle-linear'} width={20} />
              <Typography variant="body2" sx={{ color: 'inherit' }}>
                {quiz.answered ? 'To‘g‘ri.' : `To‘g‘ri javob: ${quiz.question.correctAnswer}`}
              </Typography>
            </Stack>
          )}
        </Box>

        <Box component="aside" aria-label="Shaxsiy test natijalari va reyting">
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="subtitle1">Shaxsiy natija</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Shu qurilmada saqlanadi</Typography>
            </Box>
            {quiz.stats.attempts > 0 && (
              <Button type="button" size="small" color="inherit" onClick={quiz.clearStats}>
                Tozalash
              </Button>
            )}
          </Stack>
          <Box sx={{ mt: 1.5, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 2 }}>
            <Box>
              <Typography variant="h5">{quiz.stats.attempts}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>javob</Typography>
            </Box>
            <Box>
              <Typography variant="h5">{quiz.stats.correct}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>to‘g‘ri · {accuracy}%</Typography>
            </Box>
            <Box>
              <Typography variant="h5">{quiz.stats.streak}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>joriy seriya</Typography>
            </Box>
            <Box>
              <Typography variant="h5">{quiz.stats.bestStreak}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>eng yaxshi seriya</Typography>
            </Box>
          </Box>
          {scoreSyncing && (
            <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: 'text.secondary' }}>
              Javob reytingga yuborilmoqda…
            </Typography>
          )}
          {scoreSyncError && (
            <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: 'error.main' }}>
              {scoreSyncError}
            </Typography>
          )}

          <Divider sx={{ my: 3 }} />
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="subtitle1">Top 3</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Mini test reytingi</Typography>
            </Box>
            <UiIcon icon="solar:cup-star-linear" width={24} />
          </Stack>
          {leaderboardLoading && (
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>Reyting yuklanmoqda…</Typography>
          )}
          {!leaderboardLoading && leaderboardError && (
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>{leaderboardError}</Typography>
          )}
          {!leaderboardLoading && !leaderboardError && leaderboard.length === 0 && (
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              Hali reyting natijasi yo‘q. Birinchi bo‘lib savolga javob bering.
            </Typography>
          )}
          {leaderboard.length > 0 && (
            <Stack divider={<Divider flexItem />} sx={{ mt: 1.5 }}>
              {leaderboard.map((entry) => (
                <Stack
                  key={`${entry.rank}-${entry.name}`}
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  sx={{ py: 1.25, px: entry.isCurrentUser ? 1 : 0, bgcolor: entry.isCurrentUser ? 'primary.lighter' : 'transparent', borderRadius: 1 }}
                >
                  <Typography variant="subtitle2" sx={{ width: 22, color: entry.rank === 1 ? 'primary.main' : 'text.secondary' }}>
                    {entry.rank}
                  </Typography>
                  <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                    <Typography variant="body2" noWrap sx={{ fontWeight: entry.isCurrentUser ? 600 : 400 }}>
                      {entry.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {entry.currentStreak} seriya · eng yaxshisi {entry.bestStreak}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2">{entry.correct}/{entry.total}</Typography>
                </Stack>
              ))}
            </Stack>
          )}
          {!hasSession && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                Shaxsiy natijangiz shu qurilmada qoladi. Reytingga kirish uchun hisob yoki mehmon profilidan foydalaning.
              </Typography>
              <Button component={RouterLink} to="/kirish" size="small" sx={{ mt: 0.75, px: 0 }}>
                Profilni yoqish
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
