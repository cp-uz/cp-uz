import type { SeasonSummary } from '../../domain';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';

import { formatSeasonLabel } from '../../domain';

type SeasonSelectorProps = {
  ariaLabel: string;
  label?: string;
  onChange: (slug: string) => void;
  seasons: SeasonSummary[];
  value: string;
  variant?: 'outlined' | 'standard';
};

export function SeasonSelector({
  ariaLabel,
  label,
  onChange,
  seasons,
  value,
  variant = 'outlined',
}: SeasonSelectorProps) {
  return (
    <Stack spacing={0.25} sx={{ minWidth: 150 }}>
      {label && (
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {label}
        </Typography>
      )}
      <FormControl size="small" variant={variant}>
        <Select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disableUnderline={variant === 'standard'}
          inputProps={{ 'aria-label': ariaLabel }}
          sx={
            variant === 'standard'
              ? {
                  '& .MuiSelect-select': {
                    py: 0.5,
                    pr: 3.5,
                    fontWeight: 600,
                  },
                }
              : undefined
          }
        >
          {seasons.map((season) => (
            <MenuItem key={season.id} value={season.slug}>
              {formatSeasonLabel(season.slug)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
