import type { LearningLayoutControls } from './use-learning-layout';

import { useSettingsContext, FONT_FAMILY_OPTIONS } from 'app/providers/settings';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Popover from '@mui/material/Popover';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

export function ReadingSettingsPanel({ controls }: { controls: LearningLayoutControls }) {
  const { fontAnchorEl, setFontAnchorEl } = controls;
  const settings = useSettingsContext();
  return (
    <Popover
      id="font-settings-panel"
      anchorEl={fontAnchorEl}
      open={Boolean(fontAnchorEl)}
      onClose={() => setFontAnchorEl(null)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{
        paper: {
          sx: {
            mt: 1,
            p: 2.5,
            width: 328,
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            backdropFilter: 'none',
          },
        },
      }}
    >
      <Typography variant="subtitle2">Shrift turi</Typography>
      <Box
        sx={{
          mt: 1,
          p: 1,
          gap: 1,
          display: 'grid',
          bgcolor: 'background.neutral',
          borderRadius: 1.5,
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        {FONT_FAMILY_OPTIONS.map((option) => {
          const selected = settings.state.fontFamily === option.value;
          return (
            <ButtonBase
              key={option.value}
              onClick={() => settings.setField('fontFamily', option.value)}
              sx={{
                p: 1.5,
                gap: 0.75,
                minHeight: 84,
                minWidth: 0,
                borderRadius: 1.25,
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                bgcolor: selected ? 'background.paper' : 'transparent',
                boxShadow: selected ? (theme) => theme.vars.customShadows.z4 : 'none',
              }}
            >
              <Typography
                component="span"
                sx={{
                  color: selected ? 'primary.main' : 'text.secondary',
                  fontFamily: `'${option.value}', sans-serif`,
                  fontSize: 28,
                  lineHeight: 1,
                }}
              >
                Aa
              </Typography>
              <Typography
                component="span"
                variant="caption"
                sx={{
                  fontFamily: `'${option.value}', sans-serif`,
                  color: selected ? 'text.primary' : 'text.secondary',
                  textAlign: 'center',
                }}
              >
                {option.label}
              </Typography>
            </ButtonBase>
          );
        })}
      </Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle2" sx={{ mt: 2.5 }}>
          O‘lcham
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {settings.state.fontSize}px
        </Typography>
      </Stack>
      <Slider
        min={14}
        max={20}
        step={1}
        value={settings.state.fontSize}
        valueLabelDisplay="on"
        valueLabelFormat={(value) => `${value}px`}
        onChange={(_, value) => settings.setField('fontSize', value as number)}
        aria-label="Matn o‘lchami"
        sx={{ mt: 4, mb: 0.5, '& .MuiSlider-thumb::before': { backgroundImage: 'none' } }}
      />
    </Popover>
  );
}
