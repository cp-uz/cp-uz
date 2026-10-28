import type { IconProps } from '@iconify/react';

import { createElement } from 'react';
import { vi } from 'vitest';

// Component tests exercise our UI, not Iconify's remote icon service. Its loader
// can finish after jsdom teardown and schedule React updates without a window.
vi.mock('@iconify/react', () => ({
  Icon: ({ icon, onLoad: _onLoad, ...props }: IconProps) =>
    createElement('svg', {
      ...props,
      'data-icon': typeof icon === 'string' ? icon : undefined,
    }),
}));
