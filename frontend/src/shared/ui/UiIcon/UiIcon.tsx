import type { IconProps } from '@iconify/react';

import { Icon } from '@iconify/react';

type UiIconProps = Omit<IconProps, 'icon'> & { icon: string };

export function UiIcon({ icon, width = 20, ...other }: UiIconProps) {
  return <Icon icon={icon} width={width} height={width} aria-hidden {...other} />;
}
