import React from 'react';
import { MemoryRouter, useLocation } from 'react-router';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from '../src/app/theme/theme-provider';
import { SettingsProvider } from '../src/app/providers/settings/SettingsProvider';
import { defaultSettings } from '../src/app/providers/settings/settings-config';
import { useSettingsContext } from '../src/app/providers/settings/use-settings';
import { useLearningLayout } from '../src/app/layouts/learning/use-learning-layout';
import { LearningHeader } from '../src/app/layouts/learning/LearningHeader';
import { LearningLayout } from '../src/app/layouts/LearningLayout';
import { LearningFooter } from '../src/app/layouts/learning/LearningFooter';
import { MobileNavigation } from '../src/app/layouts/learning/MobileNavigation';
import { AccountMenu } from '../src/app/layouts/learning/AccountMenu';
import { ReadingSettingsPanel } from '../src/app/layouts/learning/ReadingSettingsPanel';
import { HomeHero } from '../src/modules/landing/ui/pages/HomePage/sections/HomeHero';
import { HomeTeam } from '../src/modules/landing/ui/pages/HomePage/sections/HomeTeam';
import { DeferredViewport } from '../src/modules/landing/ui/pages/HomePage/sections/DeferredViewport';
import { FeedbackSection } from '../src/modules/landing/ui/pages/HomePage/FeedbackSection';

const auth = vi.hoisted(() => ({
  session: null as null | {
    access: string;
    refresh: string;
    sessionKey: string;
    user: { id: string; username: string; isGuest: boolean };
  },
  logout: vi.fn(),
}));
vi.mock('modules/auth/application', async (original) => ({
  ...(await original<object>()),
  useAuthSession: () => auth.session,
  logoutAuthSession: auth.logout,
}));

beforeEach(() => {
  auth.session = null;
  auth.logout.mockClear();
  vi.stubGlobal('matchMedia', (query: string) => ({
    media: query,
    matches: false,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
});

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter initialEntries={['/algo']}>
      <SettingsProvider defaultSettings={defaultSettings}>
        <ThemeProvider>{children}</ThemeProvider>
      </SettingsProvider>
    </MemoryRouter>
  );
}
function Location() {
  const location = useLocation();
  return (
    <output data-testid="location">
      {location.pathname}
      {location.search}
    </output>
  );
}
function LayoutHarness() {
  const controls = useLearningLayout();
  const settings = useSettingsContext();
  return (
    <>
      <LearningHeader controls={controls} />
      {controls.mobileOpen && <MobileNavigation controls={controls} />}
      {controls.identityAnchorEl && <AccountMenu controls={controls} />}
      {controls.fontAnchorEl && <ReadingSettingsPanel controls={controls} />}
      <output data-testid="search-open">{String(controls.searchOpen)}</output>
      <output data-testid="settings">
        {settings.state.mode}:{settings.state.fontSize}
      </output>
      <Location />
    </>
  );
}

describe('extracted layout interactions', () => {
  it('opens/closes keyboard search, changes theme and keeps mobile route navigation', async () => {
    render(<LayoutHarness />, { wrapper: Wrapper });
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(screen.getByTestId('search-open').textContent).toBe('true');
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.getByTestId('search-open').textContent).toBe('false');
    fireEvent.click(screen.getByLabelText('Qorong‘i mavzuga o‘tish'));
    expect(screen.getByTestId('settings').textContent).toBe('dark:16');
    fireEvent.click(screen.getByLabelText('Menyuni ochish'));
    const menu = await screen.findByRole('presentation');
    expect(menu.textContent).toContain('Olimpiada mavsumi');
    fireEvent.click(screen.getByRole('link', { name: 'Saqlanganlar' }));
    await waitFor(() => expect(screen.getByTestId('location').textContent).toBe('/saved'));
    expect(screen.queryByLabelText('Menyuni yopish')).toBeNull();
  });

  it('focuses the profile menu and logs out through the actual account action', async () => {
    auth.session = {
      access: 'a',
      refresh: 'r',
      sessionKey: 'login-A',
      user: { id: 'A', username: 'ali', isGuest: false },
    };
    const view = render(<LayoutHarness />, { wrapper: Wrapper });
    const button = view.container.querySelector('#profile-identity-button') as HTMLButtonElement;
    button.getBoundingClientRect = () => ({
      width: 100,
      height: 40,
      top: 0,
      left: 0,
      right: 100,
      bottom: 40,
      x: 0,
      y: 0,
      toJSON() {},
    });
    fireEvent.click(button);
    const profileLink = await screen.findByRole('menuitem', { name: 'Mening profilim' });
    await waitFor(() => expect(document.activeElement).toBe(profileLink));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Akkauntdan chiqish' }));
    expect(auth.logout).toHaveBeenCalledOnce();
    expect(screen.getByTestId('location').textContent).toBe('/');
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('updates reading size through the settings provider', () => {
    auth.session = {
      access: 'a',
      refresh: 'r',
      sessionKey: 'login-A',
      user: { id: 'A', username: 'ali', isGuest: false },
    };
    render(<LayoutHarness />, { wrapper: Wrapper });
    fireEvent.click(screen.getByLabelText('O‘qish shriftini tanlash'));
    fireEvent.change(screen.getByRole('slider', { name: 'Matn o‘lchami' }), {
      target: { value: '18' },
    });
    expect(screen.getByTestId('settings').textContent).toBe('light:18');
  });

  it('preserves the active page action while an anonymous visitor becomes a guest', () => {
    function Page() {
      const [started, setStarted] = React.useState(false);
      return <button onClick={() => setStarted(true)}>{started ? 'Started' : 'Start'}</button>;
    }
    const view = render(
      <LearningLayout>
        <Page />
      </LearningLayout>,
      { wrapper: Wrapper }
    );
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    auth.session = {
      access: 'a',
      refresh: 'r',
      sessionKey: 'guest-session',
      user: { id: 'G', username: 'guest', isGuest: true },
    };
    view.rerender(
      <LearningLayout>
        <Page />
      </LearningLayout>
    );
    expect(screen.getByRole('button', { name: 'Started' })).toBeTruthy();
  });

  it('keeps ordered primary navigation and dictionary next to saved items', () => {
    const view = render(<LayoutHarness />, { wrapper: Wrapper });
    const links = Array.from(view.container.querySelectorAll('a'));
    const hrefs = links.map((link) => link.getAttribute('href'));
    expect(hrefs.indexOf('/algo')).toBeLessThan(hrefs.indexOf('/seasons'));
    expect(hrefs.indexOf('/dict')).toBeLessThan(hrefs.indexOf('/saved'));
    expect(links.find((link) => link.getAttribute('href') === '/seasons')?.textContent).toBe(
      'Olimpiada mavsumi'
    );
    fireEvent.click(screen.getByLabelText('Menyuni ochish'));
    const navigation = screen.getByRole('presentation');
    const mobileLinks = Array.from(navigation.querySelectorAll('a')).map((link) =>
      link.getAttribute('href')
    );
    expect(mobileLinks).toEqual([
      '/',
      '/algo',
      '/seasons',
      '/tasks',
      '/roadmap',
      '/dict',
      '/saved',
      '/profile',
      '/login',
    ]);
  });

  it('renders the backend Discord redirect and public footer navigation', () => {
    render(<LearningFooter />, { wrapper: Wrapper });
    expect(screen.getByRole('link', { name: 'Discord' }).getAttribute('href')).toBe(
      '/api/v1/community/discord/'
    );
    expect(screen.getByRole('link', { name: 'Masalalar' }).getAttribute('href')).toBe('/tasks');
    expect(screen.getByRole('link', { name: 'CC BY-SA 4.0' }).getAttribute('rel')).toContain(
      'noreferrer'
    );
  });
});

describe('home sections and feedback use case', () => {
  it('submits hero search to the same encoded catalog route', () => {
    render(
      <>
        <HomeHero
          stats={{
            articleCount: 12,
            categoryCount: 3,
            practiceReferenceCount: 8,
            publishedCount: 12,
            draftCount: 0,
          }}
          statsLoading={false}
          statsError={null}
        />
        <Location />
      </>,
      { wrapper: Wrapper }
    );
    fireEvent.change(screen.getByRole('textbox', { name: 'Maqolalarni qidirish' }), {
      target: { value: 'graf va BFS' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Qidirish' }));
    expect(screen.getByTestId('location').textContent).toBe('/algo?q=graf%20va%20BFS');
  });

  it('renders all six team portraits with accessible names', () => {
    render(<HomeTeam />, { wrapper: Wrapper });
    expect(screen.getAllByRole('article')).toHaveLength(6);
    for (const name of [
      'Asadullo Ganiev',
      'Dilshodbek Khujaev',
      'Nazarbek Baltabaev',
      'Davlatbek Mirakilov',
      'Dilyorbek Valijanov',
      'Ulugbek Abdimanabov',
    ]) {
      expect(screen.getByRole('heading', { name })).toBeTruthy();
      expect(screen.getByRole('img', { name: `${name} portreti` }).getAttribute('loading')).toBe(
        'lazy'
      );
    }
  });

  it('mounts deferred content only when its viewport observer reports visibility', () => {
    let observe!: IntersectionObserverCallback;
    const disconnect = vi.fn();
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: IntersectionObserverCallback) {
          observe = callback;
        }
        observe() {}
        disconnect = disconnect;
      }
    );
    render(<DeferredViewport minHeight={300}>{() => <p>Deferred section</p>}</DeferredViewport>);
    expect(screen.queryByText('Deferred section')).toBeNull();
    act(() =>
      observe([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)
    );
    expect(screen.getByText('Deferred section')).toBeTruthy();
    expect(disconnect).toHaveBeenCalled();
  });

  it('posts validated multipart feedback once and clears fields only after success', async () => {
    let finish!: (value: Response) => void;
    const fetch = vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          finish = resolve;
        })
    );
    vi.stubGlobal('fetch', fetch);
    const view = render(<FeedbackSection />, { wrapper: Wrapper });
    fireEvent.change(screen.getByRole('textbox', { name: /Ism-familiya/ }), {
      target: { value: '  Ali  ' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: 'Aloqa (ixtiyoriy)' }), {
      target: { value: '@ali' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: /Izoh/ }), {
      target: { value: '  Xato topdim.  ' },
    });
    const form = view.container.querySelector('form')!;
    fireEvent.submit(form);
    fireEvent.submit(form);
    expect(fetch).toHaveBeenCalledOnce();
    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('/api/v1/feedback/');
    const body = init.body as FormData;
    expect(body.get('full_name')).toBe('Ali');
    expect(body.get('contact')).toBe('@ali');
    expect(body.get('note')).toBe('Xato topdim.');
    expect((screen.getByRole('textbox', { name: /Izoh/ }) as HTMLTextAreaElement).disabled).toBe(
      true
    );
    await act(async () => finish(new Response(JSON.stringify({ ok: true }), { status: 201 })));
    expect(screen.getByRole('alert').textContent).toContain('Rahmat');
    expect((screen.getByRole('textbox', { name: /Izoh/ }) as HTMLTextAreaElement).value).toBe('');
  });
});
