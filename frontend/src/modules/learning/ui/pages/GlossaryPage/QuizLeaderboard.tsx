import { useAsyncData } from 'shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import {
  glossaryLeaderboardApi,
  type GlossaryLeaderboardEntry,
  type GlossaryLeaderboardState,
} from '../../../application/glossary-leaderboard';

const empty: GlossaryLeaderboardState = { leaderboard: [], personal: null, participantCount: 0 };

function Entry({ entry }: { entry: GlossaryLeaderboardEntry }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      spacing={2}
      sx={{ py: 1.5, bgcolor: entry.isCurrentUser ? 'primary.lighter' : 'transparent' }}
    >
      <Box>
        <Typography variant="body2">
          {entry.rank}. {entry.name}
          {entry.isCurrentUser ? ' · Siz' : ''}
        </Typography>
        <Typography variant="caption">Eng yaxshi seriya: {entry.bestStreak}</Typography>
      </Box>
      <Typography variant="subtitle2">
        {entry.correct}/{entry.total}
      </Typography>
    </Stack>
  );
}

export function QuizLeaderboard({
  owner,
  revision,
}: {
  owner?: number | string;
  revision: number;
}) {
  const { data, loading, error } = useAsyncData(
    () => glossaryLeaderboardApi.listLeaderboard(owner),
    empty,
    [owner, revision]
  );
  const personalOutsideTop =
    data.personal && !data.leaderboard.some((entry) => entry.isCurrentUser);
  return (
    <Box component="aside" aria-label="Mini test reytingi">
      <Typography variant="h6">Top 3</Typography>
      <Typography variant="caption">{data.participantCount} ishtirokchi</Typography>
      {loading && (
        <Typography role="status" sx={{ mt: 2 }}>
          Reyting yuklanmoqda…
        </Typography>
      )}
      {error && (
        <Typography role="alert" sx={{ mt: 2 }}>
          Reytingni yuklab bo‘lmadi.
        </Typography>
      )}
      {!loading && !error && !data.leaderboard.length && (
        <Typography sx={{ mt: 2 }}>Hali reyting natijasi yo‘q.</Typography>
      )}
      <Stack divider={<Divider />} sx={{ mt: 2 }}>
        {data.leaderboard.map((entry) => (
          <Entry key={entry.rank} entry={entry} />
        ))}
      </Stack>
      {personalOutsideTop && data.personal && (
        <>
          <Divider sx={{ my: 2 }} />
          <Entry entry={data.personal} />
        </>
      )}
    </Box>
  );
}
