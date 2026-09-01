import { UiIcon } from 'shared/ui/UiIcon';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import { seasonAwardPresentation } from '../../domain';

type SeasonAwardIconProps = {
  award?: string;
  focusable?: boolean;
  reserveSpace?: boolean;
  size?: number;
};

export function SeasonAwardIcon({
  award,
  focusable = true,
  reserveSpace = false,
  size = 20,
}: SeasonAwardIconProps) {
  const presentation = seasonAwardPresentation(award);
  const containerSize = Math.max(20, size);

  if (!presentation) {
    return reserveSpace ? <Box component="span" aria-hidden sx={{ width: containerSize }} /> : null;
  }

  return (
    <Tooltip title={presentation.label} arrow>
      <Box
        component="span"
        role="img"
        tabIndex={focusable ? 0 : undefined}
        aria-label={presentation.label}
        sx={(theme) => ({
          width: containerSize,
          height: containerSize,
          display: 'inline-flex',
          flexShrink: 0,
          color: presentation.color,
          alignItems: 'center',
          justifyContent: 'center',
          '&:focus-visible': {
            outline: '2px solid currentColor',
            outlineOffset: 2,
            borderRadius: 0.5,
          },
          ...theme.applyStyles('dark', { color: presentation.darkColor }),
        })}
      >
        <UiIcon icon={presentation.icon} width={size} />
      </Box>
    </Tooltip>
  );
}
