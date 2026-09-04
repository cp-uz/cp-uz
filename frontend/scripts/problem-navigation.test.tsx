import type { ProblemDetail, ProblemEventDetail } from '../src/modules/problems/domain';

import React, { Suspense } from 'react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from '../src/app/theme/theme-provider';
import { SettingsProvider } from '../src/app/providers/settings/SettingsProvider';
import { defaultSettings } from '../src/app/providers/settings/settings-config';
import ProblemPage from '../src/modules/problems/ui/ProblemPage';
import { ProblemNavigation } from '../src/modules/problems/ui/ProblemNavigation';

const queries = vi.hoisted(() => ({ event: vi.fn(), detail: vi.fn() }));
vi.mock('modules/problems/application', () => ({ problemQueries: queries }));
// Icon rendering is unrelated to route/export behavior and must not start remote icon requests.
vi.mock('shared/ui/UiIcon', () => ({ UiIcon: () => <svg aria-hidden="true" /> }));

const problem: ProblemDetail = {
  id: '1',
  slug: 'bfs',
  code: 'A',
  title: 'Kenglik',
  originalTitle: 'Breadth-first search',
  translationStatus: 'reviewed_translation',
  translationStatusLabel: 'Tekshirilgan',
  problemType: 'standard',
  problemTypeLabel: 'Oddiy',
  order: 0,
  statementMarkdown: '## Kirish\n\nBoshlang‘ich tugundan masofani toping.\n\n$$d(v)=d(u)+1$$',
  sourcePath: 'problems/bfs/statement.md',
  tags: [],
  links: [],
  attachments: [],
  problemSet: { slug: 'day-1', title: '1-kun', order: 0 },
  season: { title: '2026 mavsumi', slug: '2026' },
  event: {
    code: 'IOI',
    slug: 'ioi',
    title: 'Informatika olimpiadasi',
    shortTitle: 'IOI',
    dateLabel: '12–19 sentabr',
    venue: 'Universitet',
    location: 'Toshkent',
  },
  sets: [
    {
      id: 'day-1',
      slug: 'day-1',
      title: '1-kun',
      order: 0,
      problems: [
        {
          id: '1',
          slug: 'bfs',
          code: 'A',
          title: 'Kenglik',
          originalTitle: 'Breadth-first search',
          translationStatus: 'reviewed_translation',
          translationStatusLabel: 'Tekshirilgan',
          problemType: 'standard',
          problemTypeLabel: 'Oddiy',
          order: 0,
        },
        {
          id: '2',
          slug: 'dfs',
          code: 'B',
          title: 'Depth-first search',
          translationStatus: 'reviewed_translation',
          translationStatusLabel: 'Tekshirilgan',
          problemType: 'standard',
          problemTypeLabel: 'Oddiy',
          order: 1,
        },
      ],
    },
  ],
};
beforeEach(() => {
  queries.event.mockReset();
  queries.detail.mockReset().mockResolvedValue(problem);
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
function Theme({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider defaultSettings={defaultSettings}>
      <ThemeProvider>{children}</ThemeProvider>
    </SettingsProvider>
  );
}
function Location() {
  return <output data-testid="route">{useLocation().pathname}</output>;
}
function pageAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Theme>
        <Suspense fallback={<p>Renderer loading</p>}>
          <Routes>
            <Route path="/tasks/:seasonSlug/:eventSlug" element={<ProblemPage />} />
            <Route path="/tasks/:seasonSlug/:eventSlug/:problemSlug" element={<ProblemPage />} />
          </Routes>
          <Location />
        </Suspense>
      </Theme>
    </MemoryRouter>
  );
}

describe('extracted problem navigation and print flow', () => {
  it('renders selected problem, event metadata and navigable sibling routes', () => {
    render(
      <MemoryRouter>
        <Theme>
          <ProblemNavigation problem={problem} />
          <Location />
        </Theme>
      </MemoryRouter>
    );
    const selected = screen.getByRole('link', { name: 'A Breadth-first search' });
    expect(selected.getAttribute('aria-current')).toBe('page');
    expect(selected.getAttribute('href')).toBe('/tasks/2026/ioi/bfs');
    expect(screen.getByText('12–19 sentabr')).toBeTruthy();
    expect(screen.getByText('Universitet · Toshkent')).toBeTruthy();
    expect(
      screen
        .getByRole('link', { name: 'Mavsumdagi event tafsilotlarini ochish' })
        .getAttribute('href')
    ).toBe('/seasons/2026/ioi');
    fireEvent.click(screen.getByRole('link', { name: 'B Depth-first search' }));
    expect(screen.getByTestId('route').textContent).toBe('/tasks/2026/ioi/dfs');
  });

  it('shows an unavailable state when an event contains no problems instead of waiting forever', async () => {
    const event: ProblemEventDetail = { season: problem.season, event: problem.event, sets: [] };
    queries.event.mockResolvedValue(event);
    pageAt('/tasks/2026/ioi');
    expect((await screen.findByRole('alert')).textContent).toBe(
      'Masala topilmadi yoki uni yuklab bo‘lmadi.'
    );
    expect(
      screen.getByRole('link', { name: 'Masalalar katalogiga qaytish' }).getAttribute('href')
    ).toBe('/tasks');
    expect(queries.detail).not.toHaveBeenCalled();
  });

  it('redirects a nonempty event to its first problem', async () => {
    queries.event.mockResolvedValue({
      season: problem.season,
      event: problem.event,
      sets: problem.sets,
    });
    pageAt('/tasks/2026/ioi');
    await waitFor(() => expect(queries.detail).toHaveBeenCalledWith('2026', 'ioi', 'bfs'));
    expect(screen.getByTestId('route').textContent).toBe('/tasks/2026/ioi/bfs');
  });

  it('exposes export readiness only with the actual rendered markdown and math', async () => {
    let resolve!: (value: ProblemDetail) => void;
    queries.detail.mockReturnValue(
      new Promise<ProblemDetail>((yes) => {
        resolve = yes;
      })
    );
    const view = pageAt('/tasks/2026/ioi/bfs?pdf-export=1');
    expect(view.container.querySelector('[data-ready="true"]')).toBeNull();
    await act(async () => resolve(problem));
    await waitFor(() =>
      expect(view.container.querySelector('#problem-pdf-export[data-ready="true"]')).toBeTruthy()
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Breadth-first search' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: 'Kirish' })).toBeTruthy();
    expect(screen.getByText('Boshlang‘ich tugundan masofani toping.')).toBeTruthy();
    expect(view.container.querySelector('.katex')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Matn ko‘rinishi' })).toBeNull();
  });
});
