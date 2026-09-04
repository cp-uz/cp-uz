import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import { engagementStore, useEngagementState } from '../../application';

export function EngagementSyncStatus() {
  const state = useEngagementState();
  if (!state.error && state.persistent) return null;
  return (
    <Alert
      severity="warning"
      sx={{ mx: { xs: 2, md: 3 }, my: 1 }}
      action={
        state.error ? (
          <Button color="inherit" size="small" onClick={() => void engagementStore.retry()}>
            Qayta urinish
          </Button>
        ) : undefined
      }
    >
      {!state.persistent
        ? 'Brauzer saqlash xotirasi ishlamayapti. O‘zgarishlar hozircha shu oynada saqlanadi.'
        : state.pending.length
          ? 'O‘zgarishlar qurilmada saqlandi. Profil bilan aloqa tiklanganda qayta yuboriladi.'
          : 'Profil ma’lumotlarini yuklab bo‘lmadi. Qurilmadagi nusxa ko‘rsatilmoqda.'}
    </Alert>
  );
}
