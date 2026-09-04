import type { AuthSession } from '../src/modules/auth/domain';

import React from 'react';
import { MemoryRouter } from 'react-router';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from '../src/app/theme/theme-provider';
import { SettingsProvider } from '../src/app/providers/settings/SettingsProvider';
import { defaultSettings } from '../src/app/providers/settings/settings-config';
import ProfilePage from '../src/modules/engagement/ui/pages/ProfilePage/ProfilePage';

const state = vi.hoisted(() => ({
  session: null as AuthSession | null,
  deleteAccount: vi.fn(),
  clearEngagement: vi.fn(),
  clearQuiz: vi.fn(),
}));
vi.mock('modules/auth/application', async (original) => ({
  ...(await original<object>()),
  useAuthSession: () => state.session,
  getAuthSession: () => state.session,
  authApi: { deleteAccount: state.deleteAccount },
}));
vi.mock('modules/engagement/application', async (original) => ({
  ...(await original<object>()),
  useLocalStorageList: () => ({ items: [], has: () => false }),
  clearLocalEngagementData: state.clearEngagement,
}));
vi.mock('modules/learning/application', () => ({
  learningQueries: { listArticles: async () => [] },
  clearGlossaryQuizLocalData: state.clearQuiz,
}));
const account = (id = 'A', sessionKey = 'login-A', isGuest = false): AuthSession => ({
  access: `access-${id}`,
  refresh: `refresh-${id}`,
  sessionKey,
  user: { id, username: id, isGuest },
});
beforeEach(() => {
  state.session = account();
  state.deleteAccount.mockReset();
  state.clearEngagement.mockClear();
  state.clearQuiz.mockClear();
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
function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter>
      <SettingsProvider defaultSettings={defaultSettings}>
        <ThemeProvider>{children}</ThemeProvider>
      </SettingsProvider>
    </MemoryRouter>
  );
}
async function openDelete() {
  fireEvent.click(screen.getByRole('button', { name: 'Akkauntni o‘chirish' }));
  await screen.findByRole('dialog');
}
function confirm(password = 'private-password') {
  fireEvent.change(screen.getByLabelText('Tasdiqlash'), { target: { value: 'O‘CHIRISH' } });
  if (password)
    fireEvent.change(screen.getByLabelText('Joriy parol'), { target: { value: password } });
}

describe('profile account deletion lifecycle', () => {
  it('requires both exact confirmation and an account password and preserves data on a failed deletion', async () => {
    state.deleteAccount.mockRejectedValue(new Error('Current password is incorrect'));
    render(<ProfilePage />, { wrapper: Wrapper });
    await openDelete();
    const submit = screen.getByRole('button', { name: 'Butunlay o‘chirish' }) as HTMLButtonElement;
    expect(submit.disabled).toBe(true);
    fireEvent.change(screen.getByLabelText('Tasdiqlash'), { target: { value: 'O‘CHIRISH' } });
    expect(submit.disabled).toBe(true);
    fireEvent.change(screen.getByLabelText('Joriy parol'), { target: { value: 'wrong-password' } });
    fireEvent.click(submit);
    expect((await screen.findByRole('alert')).textContent).toBe('Current password is incorrect');
    expect(state.deleteAccount).toHaveBeenCalledWith({
      confirmation: 'O‘CHIRISH',
      password: 'wrong-password',
    });
    expect(state.clearEngagement).not.toHaveBeenCalled();
    expect(state.clearQuiz).not.toHaveBeenCalled();
  });

  it('clears the captured owner only after the guest deletion succeeds', async () => {
    state.session = account('G', 'guest', true);
    let resolve!: () => void;
    state.deleteAccount.mockReturnValue(
      new Promise<void>((yes) => {
        resolve = yes;
      })
    );
    render(<ProfilePage />, { wrapper: Wrapper });
    await openDelete();
    expect(screen.queryByLabelText('Joriy parol')).toBeNull();
    confirm('');
    fireEvent.click(screen.getByRole('button', { name: 'Butunlay o‘chirish' }));
    expect(state.clearEngagement).not.toHaveBeenCalled();
    expect(state.clearQuiz).not.toHaveBeenCalled();
    expect(
      (screen.getByRole('button', { name: 'Bekor qilish' }) as HTMLButtonElement).disabled
    ).toBe(true);
    await act(async () => resolve());
    expect(state.clearEngagement).toHaveBeenCalledWith('user:G');
    expect(state.clearQuiz).toHaveBeenCalledWith('G');
  });

  it.each(['other account', 'fresh login'] as const)(
    'discards a deletion password and confirmation on %s',
    async (change) => {
      const view = render(<ProfilePage />, { wrapper: Wrapper });
      await openDelete();
      confirm();
      state.session =
        change === 'other account' ? account('B', 'login-B') : account('A', 'new-login-A');
      view.rerender(<ProfilePage />);
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      await openDelete();
      expect((screen.getByLabelText('Joriy parol') as HTMLInputElement).value).toBe('');
      expect((screen.getByLabelText('Tasdiqlash') as HTMLInputElement).value).toBe('');
      expect(state.deleteAccount).not.toHaveBeenCalled();
    }
  );

  it('rejects a stale delete click if auth changes before React replaces the old dialog', async () => {
    render(<ProfilePage />, { wrapper: Wrapper });
    await openDelete();
    confirm();
    state.session = account('B', 'login-B');
    fireEvent.click(screen.getByRole('button', { name: 'Butunlay o‘chirish' }));
    expect(state.deleteAccount).not.toHaveBeenCalled();
  });
});
