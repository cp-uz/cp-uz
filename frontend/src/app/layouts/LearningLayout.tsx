import type { MouseEvent } from 'react';
import type { AuthSession } from 'modules/auth/domain';

import { UiIcon } from 'shared/ui/UiIcon';
import { appRoutes } from 'shared/config';
import { BrandLogo } from 'shared/ui/BrandLogo';
import { apiUrl } from 'shared/api/http/api-base';
import { lazy, Suspense, useState, useEffect } from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router';
import { useSettingsContext, FONT_FAMILY_OPTIONS } from 'app/providers/settings';
import { getAuthSession, logoutAuthSession, subscribeAuthSession } from 'modules/auth/application';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { useColorScheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';

import { MainSection, LayoutSection, HeaderSection } from './core';

const Drawer = lazy(() => import('@mui/material/Drawer'));
const Menu = lazy(() => import('@mui/material/Menu'));
const Popover = lazy(() => import('@mui/material/Popover'));
const Slider = lazy(() => import('@mui/material/Slider'));
const List = lazy(() => import('@mui/material/List'));
const ListItemText = lazy(() => import('@mui/material/ListItemText'));
const ListItemIcon = lazy(() => import('@mui/material/ListItemIcon'));
const SearchDialog = lazy(() => import('./SearchDialog'));
const GuestUpgradeDialog = lazy(() =>
  import('modules/auth/ui/components/GuestUpgradeDialog').then((module) => ({
    default: module.GuestUpgradeDialog,
  }))
);

const navItems = [
  { to: appRoutes.algorithms, label: 'Algoritmlar', icon: 'solar:library-linear' },
  {
    to: appRoutes.seasons,
    label: 'Olimpiada mavsumi',
    icon: 'solar:calendar-mark-linear',
  },
  { to: appRoutes.tasks, label: 'Masalalar', icon: 'solar:documents-minimalistic-linear' },
  { to: appRoutes.roadmap, label: 'Yo‘l xaritasi', icon: 'solar:map-linear' },
];

const glossaryItem = {
  to: appRoutes.dictionary,
  label: 'Lug‘at',
  icon: 'solar:notebook-bookmark-linear',
};

const utilityItems = [
  glossaryItem,
  { to: appRoutes.saved, label: 'Saqlanganlar', icon: 'solar:bookmark-linear' },
  { to: appRoutes.profile, label: 'Mening profilim', icon: 'solar:user-circle-linear' },
];

const footerItems = [...navItems, glossaryItem];

export function LearningLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const settings = useSettingsContext();
  const [session, setSession] = useState<AuthSession | null>(() => getAuthSession());
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
  const sessionRenderKey = session
    ? `${String(session.user.id)}:${session.user.isGuest ? 'guest' : 'account'}`
    : 'anonymous';

  const navItemSelected = (to: string) => pathname === to || pathname.startsWith(`${to}/`);

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

  useEffect(() => subscribeAuthSession((nextSession) => setSession(nextSession)), []);

  useEffect(() => {
    if (!identityAnchorEl) return undefined;
    const frame = window.requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>('#profile-identity-menu [role="menuitem"]')
        ?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [identityAnchorEl]);

  const toggleTheme = () => {
    const nextMode = dark ? 'light' : 'dark';
    settings.setField('mode', nextMode);
    setMode(nextMode);
  };

  const closeIdentityMenu = () => {
    const anchor = identityAnchorEl;
    setIdentityAnchorEl(null);
    window.requestAnimationFrame(() => anchor?.focus({ preventScroll: true }));
  };

  const logout = () => {
    setIdentityAnchorEl(null);
    setMobileOpen(false);
    logoutAuthSession();
    navigate('/', { replace: true });
  };

  const header = (
    <HeaderSection
      disableElevation
      slots={{
        leftArea: (
          <Stack direction="row" spacing={2.5} alignItems="center">
            <IconButton
              aria-label="Menyuni ochish"
              onClick={() => setMobileOpen(true)}
              sx={{
                ml: -1,
                display: 'inline-flex',
                '@media (min-width: 1340px)': { display: 'none' },
              }}
            >
              <UiIcon icon="solar:hamburger-menu-linear" width={22} />
            </IconButton>
            <BrandLogo />
          </Stack>
        ),
        centerArea: (
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ display: 'none', '@media (min-width: 1340px)': { display: 'flex' } }}
          >
            {navItems.map((item) => {
              const selected = navItemSelected(item.to);
              return (
                <Button
                  key={item.to}
                  component={RouterLink}
                  to={item.to}
                  size="small"
                  color="inherit"
                  variant="text"
                  startIcon={<UiIcon icon={item.icon} width={18} />}
                  sx={(theme) => ({
                    px: 1.75,
                    py: 0.875,
                    minHeight: 40,
                    border: '1px solid transparent',
                    fontWeight: 500,
                    color: selected ? 'primary.main' : 'text.secondary',
                    bgcolor: selected ? 'primary.lighter' : 'transparent',
                    '&:hover': { bgcolor: selected ? 'primary.lighter' : 'action.hover' },
                    ...theme.applyStyles('dark', {
                      bgcolor: selected ? 'primary.darker' : 'transparent',
                      color: selected ? 'primary.lighter' : 'text.secondary',
                      borderColor: selected ? 'primary.dark' : 'transparent',
                      '&:hover': { bgcolor: selected ? 'primary.darker' : 'action.hover' },
                    }),
                  })}
                >
                  {item.label}
                </Button>
              );
            })}
          </Stack>
        ),
        rightArea: (
          <Stack direction="row" spacing={0.75} alignItems="center">
            <ButtonBase
              onClick={() => setSearchOpen(true)}
              aria-label="Sayt bo‘ylab qidirish"
              sx={{
                px: 1.5,
                gap: 1,
                height: 38,
                minWidth: 178,
                justifyContent: 'flex-start',
                color: 'text.secondary',
                bgcolor: 'action.hover',
                borderRadius: 1.25,
                fontFamily: 'inherit',
                display: { xs: 'none', xl: 'inline-flex' },
              }}
            >
              <UiIcon icon="solar:magnifer-linear" width={18} />
              <Typography component="span" variant="body2">
                Qidirish
              </Typography>
              <Typography
                component="span"
                variant="caption"
                sx={{ ml: 'auto', color: 'text.secondary' }}
              >
                Ctrl K
              </Typography>
            </ButtonBase>
            <IconButton
              title="Qidirish"
              aria-label="Sayt bo‘ylab qidirish"
              onClick={() => setSearchOpen(true)}
              sx={{ display: { xs: 'inline-flex', xl: 'none' } }}
            >
              <UiIcon icon="solar:magnifer-linear" width={20} />
            </IconButton>
            <IconButton
              title={dark ? 'Yorug‘ mavzu' : 'Qorong‘i mavzu'}
              aria-label={dark ? 'Yorug‘ mavzuga o‘tish' : 'Qorong‘i mavzuga o‘tish'}
              onClick={toggleTheme}
            >
              <UiIcon icon={dark ? 'solar:sun-2-linear' : 'solar:moon-stars-linear'} width={20} />
            </IconButton>
            <IconButton
              title="Shrift"
              aria-label="O‘qish shriftini tanlash"
              aria-controls={fontAnchorEl ? 'font-settings-panel' : undefined}
              aria-expanded={fontAnchorEl ? 'true' : undefined}
              onClick={(event: MouseEvent<HTMLElement>) => setFontAnchorEl(event.currentTarget)}
            >
              <UiIcon icon="solar:text-square-linear" width={20} />
            </IconButton>
            <IconButton
              title="Lug‘at"
              component={RouterLink}
              to={appRoutes.dictionary}
              aria-label="Lug‘at"
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              <UiIcon icon="solar:notebook-bookmark-linear" width={20} />
            </IconButton>
            <IconButton
              title="Saqlanganlar"
              component={RouterLink}
              to={appRoutes.saved}
              aria-label="Saqlangan maqolalar"
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              <UiIcon icon="solar:bookmark-linear" width={20} />
            </IconButton>
            {session ? (
              <Button
                id="profile-identity-button"
                variant="contained"
                aria-label={`${session.user.isGuest ? 'Mehmon profili' : 'Profil'}: ${identityLabel}`}
                aria-haspopup="menu"
                aria-controls={identityAnchorEl ? 'profile-identity-menu' : undefined}
                aria-expanded={identityAnchorEl ? 'true' : undefined}
                onClick={(event) => setIdentityAnchorEl(event.currentTarget)}
                startIcon={<UiIcon icon="solar:user-circle-linear" width={18} />}
                endIcon={<UiIcon icon="solar:alt-arrow-down-linear" width={15} />}
                sx={{
                  display: 'none',
                  '@media (min-width: 1340px)': { display: 'inline-flex' },
                }}
              >
                {identityLabel}
              </Button>
            ) : (
              <Button
                component={RouterLink}
                to={appRoutes.login}
                variant="contained"
                startIcon={<UiIcon icon="solar:login-2-linear" width={18} />}
                sx={{
                  display: 'none',
                  '@media (min-width: 1340px)': { display: 'inline-flex' },
                }}
              >
                Kirish
              </Button>
            )}
          </Stack>
        ),
      }}
      slotProps={{ container: { maxWidth: 'xl' } }}
      sx={(theme) => ({
        borderBottom: `solid 1px ${theme.vars.palette.divider}`,
        bgcolor: 'background.default',
        '&::before': { display: 'none' },
      })}
    />
  );

  const footer = (
    <Box component="footer" sx={{ mt: 'auto', bgcolor: 'background.default' }}>
      <Divider />
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 5 } }}>
        <Box
          sx={{
            gap: 4,
            display: 'grid',
            alignItems: 'start',
            gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr 1fr' },
          }}
        >
          <Box>
            <BrandLogo />
            <Typography variant="body2" sx={{ mt: 2, maxWidth: 360, color: 'text.secondary' }}>
              Sport dasturlashni o‘zbek tilida tizimli o‘rganish uchun ochiq kutubxona.
            </Typography>
          </Box>
          <Stack spacing={1.25}>
            <Typography component="h2" variant="subtitle2" sx={{ color: 'text.primary' }}>
              O‘rganish
            </Typography>
            {footerItems.map((item) => {
              const selected = pathname === item.to || pathname.startsWith(`${item.to}/`);
              return (
                <Button
                  key={item.to}
                  component={RouterLink}
                  to={item.to}
                  color="inherit"
                  size="small"
                  startIcon={<UiIcon icon={item.icon} width={18} />}
                  sx={{
                    px: 0.5,
                    py: 0.625,
                    alignSelf: 'flex-start',
                    fontWeight: 400,
                    color: selected ? 'primary.main' : 'text.secondary',
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Stack>
          <Stack spacing={1.25}>
            <Typography component="h2" variant="subtitle2" sx={{ color: 'text.primary' }}>
              Loyiha
            </Typography>
            <Button
              component="a"
              href="https://github.com/cp-uz/cp-uz"
              target="_blank"
              rel="noreferrer"
              color="inherit"
              size="small"
              startIcon={<UiIcon icon="mingcute:github-line" width={18} />}
              sx={{
                px: 0.5,
                py: 0.625,
                alignSelf: 'flex-start',
                color: 'text.secondary',
                fontWeight: 400,
              }}
            >
              GitHub
            </Button>
            <Button
              component="a"
              href="https://t.me/cp_uz"
              target="_blank"
              rel="noreferrer"
              color="inherit"
              size="small"
              startIcon={<UiIcon icon="mingcute:telegram-line" width={18} />}
              sx={{
                px: 0.5,
                py: 0.625,
                alignSelf: 'flex-start',
                color: 'text.secondary',
                fontWeight: 400,
              }}
            >
              Telegram
            </Button>
            <Button
              component="a"
              href={apiUrl('/community/discord/')}
              target="_blank"
              rel="noreferrer"
              color="inherit"
              size="small"
              startIcon={<UiIcon icon="mingcute:discord-line" width={18} />}
              sx={{
                px: 0.5,
                py: 0.625,
                alignSelf: 'flex-start',
                color: 'text.secondary',
                fontWeight: 400,
              }}
            >
              Discord
            </Button>
          </Stack>
        </Box>
        <Divider sx={{ my: 4 }} />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between">
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            © 2026 cp.uz · Matnlar manba ko‘rsatilib va shu litsenziyada ulashiladi:{' '}
            <Link
              href="https://creativecommons.org/licenses/by-sa/4.0/deed.uz"
              target="_blank"
              rel="noreferrer"
              color="inherit"
            >
              CC BY-SA 4.0
            </Link>
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Ochiq manba · O‘zbekcha bilim ombori
          </Typography>
        </Stack>
      </Container>
    </Box>
  );

  return (
    <LayoutSection headerSection={header} footerSection={footer} sx={{ minHeight: '100vh' }}>
      <MainSection key={sessionRenderKey} id="main-content">
        {children}
      </MainSection>

      {mobileOpen && (
        <Suspense fallback={null}>
          <Drawer
            open
            onClose={() => setMobileOpen(false)}
            slotProps={{ paper: { sx: { width: 300 } } }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
              <BrandLogo />
              <IconButton aria-label="Menyuni yopish" onClick={() => setMobileOpen(false)}>
                <UiIcon icon="solar:close-circle-linear" width={22} />
              </IconButton>
            </Stack>
            <Divider />
            <List sx={{ p: 1.5 }}>
              {[...navItems, ...utilityItems].map((item) => (
                <ListItemButton
                  key={item.to}
                  component={RouterLink}
                  to={item.to}
                  selected={navItemSelected(item.to)}
                  onClick={() => setMobileOpen(false)}
                  sx={(theme) => ({
                    px: 1.5,
                    py: 1.25,
                    borderRadius: 1,
                    fontWeight: 500,
                    color: navItemSelected(item.to) ? 'primary.main' : 'text.primary',
                    '&.Mui-selected': { bgcolor: 'primary.lighter', color: 'primary.main' },
                    '&.Mui-selected:hover': { bgcolor: 'primary.lighter' },
                    ...theme.applyStyles('dark', {
                      '&.Mui-selected': {
                        bgcolor: 'primary.darker',
                        color: 'primary.lighter',
                        boxShadow: `inset 0 0 0 1px ${theme.vars.palette.primary.dark}`,
                      },
                      '&.Mui-selected:hover': { bgcolor: 'primary.darker' },
                    }),
                  })}
                >
                  {'icon' in item && (
                    <ListItemIcon sx={{ minWidth: 20, mr: 1.5, color: 'inherit' }}>
                      <UiIcon icon={item.icon} width={20} />
                    </ListItemIcon>
                  )}
                  <ListItemText
                    primary={item.label}
                    slotProps={{ primary: { variant: 'body2', fontWeight: 500 } }}
                  />
                </ListItemButton>
              ))}
            </List>
            <Box sx={{ mt: 'auto', p: 2 }}>
              {session?.user.isGuest && (
                <Button
                  fullWidth
                  variant="soft"
                  startIcon={<UiIcon icon="solar:user-plus-linear" width={18} />}
                  onClick={() => {
                    setMobileOpen(false);
                    setGuestUpgradeOpen(true);
                  }}
                  sx={{ mb: 1 }}
                >
                  Akkauntni saqlash
                </Button>
              )}
              <Button
                component={RouterLink}
                to={session ? appRoutes.profile : appRoutes.login}
                fullWidth
                variant="contained"
                startIcon={
                  <UiIcon
                    icon={session ? 'solar:user-circle-linear' : 'solar:login-2-linear'}
                    width={18}
                  />
                }
                onClick={() => setMobileOpen(false)}
              >
                {session ? identityLabel : 'Kirish'}
              </Button>
              {session && (
                <Button
                  fullWidth
                  color="inherit"
                  startIcon={<UiIcon icon="solar:logout-2-linear" width={18} />}
                  onClick={logout}
                  sx={{ mt: 1 }}
                >
                  Akkauntdan chiqish
                </Button>
              )}
            </Box>
          </Drawer>
        </Suspense>
      )}

      {identityAnchorEl && (
        <Suspense fallback={null}>
          <Menu
            id="profile-identity-menu"
            autoFocus={false}
            disableAutoFocus
            disableEnforceFocus
            disableRestoreFocus
            disableScrollLock
            anchorEl={identityAnchorEl}
            open={Boolean(identityAnchorEl)}
            onClose={closeIdentityMenu}
            MenuListProps={{ 'aria-labelledby': 'profile-identity-button' }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem component={RouterLink} to={appRoutes.profile} onClick={closeIdentityMenu}>
              <ListItemIcon sx={{ minWidth: 19, mr: 1.25 }}>
                <UiIcon icon="solar:user-circle-linear" width={19} />
              </ListItemIcon>
              <ListItemText primary="Mening profilim" />
            </MenuItem>
            {session?.user.isGuest && (
              <MenuItem
                onClick={() => {
                  closeIdentityMenu();
                  setGuestUpgradeOpen(true);
                }}
              >
                <ListItemIcon sx={{ minWidth: 19, mr: 1.25 }}>
                  <UiIcon icon="solar:user-plus-linear" width={19} />
                </ListItemIcon>
                <ListItemText primary="Akkauntni saqlash" />
              </MenuItem>
            )}
            <Divider />
            <MenuItem onClick={logout}>
              <ListItemIcon sx={{ minWidth: 19, mr: 1.25 }}>
                <UiIcon icon="solar:logout-2-linear" width={19} />
              </ListItemIcon>
              <ListItemText primary="Akkauntdan chiqish" />
            </MenuItem>
          </Menu>
        </Suspense>
      )}

      {guestUpgradeOpen && (
        <Suspense fallback={null}>
          <GuestUpgradeDialog
            open
            onClose={() => setGuestUpgradeOpen(false)}
            onUpgraded={(nextSession) => setSession(nextSession)}
          />
        </Suspense>
      )}

      {searchOpen && (
        <Suspense fallback={null}>
          <SearchDialog open onClose={() => setSearchOpen(false)} />
        </Suspense>
      )}

      {fontAnchorEl && (
        <Suspense fallback={null}>
          <Popover
            id="font-settings-panel"
            anchorEl={fontAnchorEl}
            open={Boolean(fontAnchorEl)}
            onClose={() => setFontAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  p: 2.5,
                  width: 328,
                  bgcolor: 'background.paper',
                  backgroundImage: 'none',
                  backdropFilter: 'none',
                },
              },
            }}
          >
            <Typography variant="subtitle2">Shrift turi</Typography>
            <Box
              sx={{
                mt: 1,
                p: 1,
                gap: 1,
                display: 'grid',
                bgcolor: 'background.neutral',
                borderRadius: 1.5,
                gridTemplateColumns: 'repeat(2, 1fr)',
              }}
            >
              {FONT_FAMILY_OPTIONS.map((option) => {
                const selected = settings.state.fontFamily === option.value;
                return (
                  <ButtonBase
                    key={option.value}
                    onClick={() => settings.setField('fontFamily', option.value)}
                    sx={{
                      p: 1.5,
                      gap: 0.75,
                      minHeight: 84,
                      minWidth: 0,
                      borderRadius: 1.25,
                      alignItems: 'center',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      bgcolor: selected ? 'background.paper' : 'transparent',
                      boxShadow: selected ? (theme) => theme.vars.customShadows.z4 : 'none',
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        color: selected ? 'primary.main' : 'text.secondary',
                        fontFamily: `'${option.value}', sans-serif`,
                        fontSize: 28,
                        lineHeight: 1,
                      }}
                    >
                      Aa
                    </Typography>
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{
                        fontFamily: `'${option.value}', sans-serif`,
                        color: selected ? 'text.primary' : 'text.secondary',
                        textAlign: 'center',
                      }}
                    >
                      {option.label}
                    </Typography>
                  </ButtonBase>
                );
              })}
            </Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle2" sx={{ mt: 2.5 }}>
                O‘lcham
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {settings.state.fontSize}px
              </Typography>
            </Stack>
            <Slider
              min={14}
              max={20}
              step={1}
              value={settings.state.fontSize}
              valueLabelDisplay="on"
              valueLabelFormat={(value) => `${value}px`}
              onChange={(_, value) => settings.setField('fontSize', value as number)}
              aria-label="Matn o‘lchami"
              sx={{ mt: 4, mb: 0.5, '& .MuiSlider-thumb::before': { backgroundImage: 'none' } }}
            />
          </Popover>
        </Suspense>
      )}
    </LayoutSection>
  );
}
