import type { RankedQuestion } from '../../../domain/entities/quiz.types';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

type Props = {
  question: Pick<RankedQuestion, 'id' | 'modeLabel' | 'instruction' | 'prompt' | 'options'>;
  answered: boolean | null;
  submittedAnswer?: string | null;
  correctAnswer?: string;
  loading?: boolean;
  onSubmit: (answer: string) => void;
  onNext: () => void;
};

export function QuizQuestion({
  question,
  answered,
  submittedAnswer,
  correctAnswer,
  loading = false,
  onSubmit,
  onNext,
}: Props) {
  const [selection, setSelected] = useState('');
  const selected = submittedAnswer ?? selection;
  const submitted = submittedAnswer != null;
  const revealed = answered !== null;
  return (
    <Box aria-busy={loading}>
      <Typography variant="caption" sx={{ color: 'primary.main' }}>
        {question.modeLabel}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
        {question.instruction}
      </Typography>
      <Typography id={`prompt-${question.id}`} variant="h6" sx={{ mt: 1.5 }}>
        {question.prompt}
      </Typography>
      <RadioGroup
        aria-labelledby={`prompt-${question.id}`}
        value={selected}
        onChange={(event) => setSelected(event.target.value)}
        sx={{ mt: 2, gap: 1 }}
      >
        {question.options.map((option) => (
          <FormControlLabel
            key={option}
            value={option}
            disabled={revealed || loading || submitted}
            control={<Radio size="small" />}
            label={option}
            sx={{
              m: 0,
              p: 1,
              borderRadius: 1,
              bgcolor:
                revealed && option === correctAnswer
                  ? 'success.lighter'
                  : revealed && option === selected
                    ? 'error.lighter'
                    : 'transparent',
            }}
          />
        ))}
      </RadioGroup>
      <Button
        sx={{ mt: 2 }}
        variant="contained"
        disabled={loading || (!revealed && !selected)}
        onClick={() => (revealed ? onNext() : onSubmit(selected))}
      >
        {loading
          ? 'Yuborilmoqda…'
          : revealed
            ? 'Keyingi savol'
            : submitted
              ? 'Qayta yuborish'
              : 'Tekshirish'}
      </Button>
      {revealed && (
        <Typography role="status" sx={{ mt: 2, color: answered ? 'success.main' : 'error.main' }}>
          {answered ? 'To‘g‘ri.' : `To‘g‘ri javob: ${correctAnswer}`}
        </Typography>
      )}
    </Box>
  );
}
