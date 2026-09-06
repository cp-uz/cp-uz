import React from 'react';
import { MemoryRouter, Link, useNavigate } from 'react-router';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import App from '../src/app/App';

vi.mock('app/theme', () => ({
  themeConfig: {},
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock('app/providers/settings', () => ({
  defaultSettings: {},
  SettingsProvider: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock('shared/ui/ProgressBar', () => ({ ProgressBar: () => null }));
vi.mock('shared/ui/LoadingScreen', () => ({
  LoadingScreen: () => null,
  readBootLoadingFactIndex: () => 0,
}));

afterEach(cleanup);

function Navigation() {
  const navigate = useNavigate();
  return (
    <>
      <Link to="/seasons/2026/selection" preventScrollReset>Selection</Link>
      <Link to="/seasons/2026/final" preventScrollReset>Final</Link>
      <button onClick={() => navigate('/seasons/2026')}>Close details</button>
      <button onClick={() => navigate(-1)}>Back</button>
      <Link to="/seasons/2025">Other season</Link>
      <Link to="/algo">Algorithms</Link>
    </>
  );
}

it('preserves timeline position on event selection, closing details and history navigation', () => {
  const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  render(
    <MemoryRouter initialEntries={['/seasons/2026']}>
      <App><Navigation /></App>
    </MemoryRouter>
  );
  expect(scrollTo).toHaveBeenCalledTimes(1);
  scrollTo.mockClear();

  for (const name of ['Selection', 'Final', 'Close details', 'Back', 'Back']) {
    fireEvent.click(screen.getByText(name));
    expect(scrollTo).not.toHaveBeenCalled();
  }

  fireEvent.click(screen.getByText('Other season'));
  expect(scrollTo).toHaveBeenCalledExactlyOnceWith({ top: 0, behavior: 'instant' });
  scrollTo.mockClear();
  fireEvent.click(screen.getByText('Algorithms'));
  expect(scrollTo).toHaveBeenCalledExactlyOnceWith({ top: 0, behavior: 'instant' });
});

it('resets scroll when opening an event directly from another page', () => {
  const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  render(
    <MemoryRouter initialEntries={['/algo']}>
      <App><Navigation /></App>
    </MemoryRouter>
  );
  scrollTo.mockClear();
  fireEvent.click(screen.getByText('Final'));
  expect(scrollTo).toHaveBeenCalledExactlyOnceWith({ top: 0, behavior: 'instant' });
});
