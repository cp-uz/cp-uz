import type { ProblemCatalog } from '../src/modules/problems/domain';

import React from 'react';
import { MemoryRouter } from 'react-router';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from '../src/app/theme/theme-provider';
import { SettingsProvider } from '../src/app/providers/settings/SettingsProvider';
import { defaultSettings } from '../src/app/providers/settings/settings-config';
import ProblemCatalogPage from '../src/modules/problems/ui/ProblemCatalogPage';

const queries = vi.hoisted(() => ({ catalog: vi.fn() }));
vi.mock('../src/modules/problems/application', () => ({ problemQueries: queries }));
vi.mock('shared/ui/UiIcon', () => ({ UiIcon: () => <svg aria-hidden="true" /> }));

const catalog: ProblemCatalog = {
  seasons: [
    { title: '2025–2026', slug: '2025-2026' },
    { title: '2026–2027', slug: '2026-2027' },
  ],
  events: [
    {
      season: { title: '2025–2026', slug: '2025-2026' },
      event: { code: 'IOI', slug: 'ioi-2026', title: 'IOI 2026' },
      problemCount: 1,
      sets: [
        {
          id: 'set-1',
          slug: 'day-1',
          title: '1-kun',
          order: 0,
          problems: [
            {
              id: 'problem-1',
              slug: 'tree',
              code: 'A',
              title: 'Tree',
              translationStatus: 'reviewed_translation',
              translationStatusLabel: 'Tekshirilgan',
              problemType: 'standard',
              problemTypeLabel: 'Oddiy',
              order: 0,
            },
          ],
        },
      ],
    },
    {
      season: { title: '2026–2027', slug: '2026-2027' },
      event: { code: 'IOI', slug: 'ioi-2027', title: 'IOI 2027' },
      problemCount: 1,
      sets: [
        {
          id: 'set-2',
          slug: 'day-1',
          title: '1-kun',
          order: 0,
          problems: [
            {
              id: 'problem-2',
              slug: 'graph',
              code: 'A',
              title: 'Graph',
              translationStatus: 'reviewed_translation',
              translationStatusLabel: 'Tekshirilgan',
              problemType: 'standard',
              problemTypeLabel: 'Oddiy',
              order: 0,
            },
          ],
        },
      ],
    },
  ],
};

function renderCatalog() {
  return render(
    <MemoryRouter>
      <SettingsProvider defaultSettings={defaultSettings}>
        <ThemeProvider>
          <ProblemCatalogPage />
        </ThemeProvider>
      </SettingsProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  queries.catalog.mockReset().mockResolvedValue(catalog);
  vi.stubGlobal('matchMedia', (query: string) => ({
    media: query,
    matches: false,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('problem catalog season filter', () => {
  it('shows every season by default and only the selected season after filtering', async () => {
    renderCatalog();

    expect(await screen.findByRole('treeitem', { name: /^2025-2026 / })).toBeTruthy();
    expect(screen.getByRole('treeitem', { name: /^2026-2027 / })).toBeTruthy();

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Mavsum' }));
    fireEvent.click(await screen.findByRole('option', { name: '2026-2027' }));

    expect(screen.queryByRole('treeitem', { name: /^2025-2026 / })).toBeNull();
    expect(screen.getByRole('treeitem', { name: /^2026-2027 / })).toBeTruthy();

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Mavsum' }));
    fireEvent.click(await screen.findByRole('option', { name: 'Barchasi' }));

    expect(screen.getByRole('treeitem', { name: /^2025-2026 / })).toBeTruthy();
    expect(screen.getByRole('treeitem', { name: /^2026-2027 / })).toBeTruthy();
  });
});
