import type { IconProps } from '@iconify/react';

import { Icon } from '@iconify/react';

import { AlgorithmIcon } from '../AlgorithmVisual/AlgorithmIcon';

type UiIconProps = Omit<IconProps, 'icon'> & { icon: string };

export function UiIcon({ icon, width = 20, ...other }: UiIconProps) {
  if (icon.startsWith('cp:')) {
    return <AlgorithmIcon topic={icon.slice(3)} size={width} {...other} />;
  }
  return <Icon icon={icon} width={width} height={width} aria-hidden {...other} />;
}
