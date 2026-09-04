import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useSettingsContext } from 'app/providers/settings';
import { useAuthSession, logoutAuthSession } from 'modules/auth/application';

import { useColorScheme } from '@mui/material/styles';

import { isNavItemSelected } from './navigation-items';

export function useLearningLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const settings = useSettingsContext();
  const session = useAuthSession();
  const { setMode } = useColorScheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [fontAnchorEl, setFontAnchorEl] = useState<HTMLElement | null>(null);
  const [identityAnchorEl, setIdentityAnchorEl] = useState<HTMLElement | null>(null);
  const [guestUpgradeOpen, setGuestUpgradeOpen] = useState(false);
  const dark = settings.state.mode === 'dark';
  const identityLabel = session
    ? session.user.isGuest
      ? 'Mehmon'
      : (session.user.displayName || session.user.username).slice(0, 18)
    : '';

  const navItemSelected = (to: string) => isNavItemSelected(pathname, to);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const toggleTheme = () => {
    const nextMode = dark ? 'light' : 'dark';
    settings.setField('mode', nextMode);
    setMode(nextMode);
  };

  const closeIdentityMenu = () => {
    setIdentityAnchorEl(null);
  };

  const logout = () => {
    setIdentityAnchorEl(null);
    setMobileOpen(false);
    logoutAuthSession();
    navigate('/', { replace: true });
  };

  return {
    session,
    identityLabel,
    navItemSelected,
    dark,
    toggleTheme,
    logout,
    mobileOpen,
    setMobileOpen,
    searchOpen,
    setSearchOpen,
    fontAnchorEl,
    setFontAnchorEl,
    identityAnchorEl,
    setIdentityAnchorEl,
    closeIdentityMenu,
    guestUpgradeOpen,
    setGuestUpgradeOpen,
  };
}

export type LearningLayoutControls = ReturnType<typeof useLearningLayout>;
