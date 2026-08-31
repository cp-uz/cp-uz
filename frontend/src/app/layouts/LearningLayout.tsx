import type { AuthSession } from 'modules/auth';
import type { FormEvent, MouseEvent } from 'react';

import { UiIcon } from 'shared/ui/UiIcon';
import { BrandLogo } from 'shared/ui/BrandLogo';
import { useMemo, useState, useEffect } from 'react';
import { useAsyncData, useDebouncedValue } from 'shared/hooks';
import { getAuthSession, GuestUpgradeDialog } from 'modules/auth';
import { filterArticles, getArticlePath } from 'modules/learning/domain';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router';
import { learningQueries as learningApi } from 'modules/learning/application';
import { useSettingsContext, FONT_FAMILY_OPTIONS } from 'app/providers/settings';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Drawer from '@mui/material/Drawer';
import Slider from '@mui/material/Slider';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useColorScheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemButton from '@mui/material/ListItemButton';

import { MainSection, LayoutSection, HeaderSection } from './core';

const navItems = [
  { to: '/algoritmlar', label: 'Algoritmlar', icon: 'solar:library-linear' },
  { to: '/yol-xaritasi', label: 'Yo‘l xaritasi', icon: 'solar:map-linear' },
  { to: '/lugat', label: 'Lug‘at', icon: 'solar:notebook-bookmark-linear' },
];

const utilityItems = [
  { to: '/saqlanganlar', label: 'Saqlanganlar', icon: 'solar:bookmark-linear' },
  { to: '/profil', label: 'Mening profilim', icon: 'solar:user-circle-linear' },
];

export function LearningLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const settings = useSettingsContext();
  const [session, setSession] = useState<AuthSession | null>(() => getAuthSession());
  const { setMode } = useColorScheme();
  const { data: allArticles, error: articleLoadError } = useAsyncData(
    learningApi.listArticles,
    [],
    []
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);
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

  const matches = useMemo(
    () => filterArticles(allArticles, debouncedQuery).slice(0, 6),
    [allArticles, debouncedQuery]
  );

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

  useEffect(() => {
    if (!identityAnchorEl) return undefined;
    const frame = window.requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>('#guest-identity-menu [role="menuitem"]')
        ?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [identityAnchorEl]);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    navigate(`/algoritmlar?q=${encodeURIComponent(query)}`);
    setSearchOpen(false);
  };

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

  const header = (
    <HeaderSection
      disableElevation
      slots={{
        leftArea: (
          <Stack direction="row" spacing={2.5} alignItems="center">
            <IconButton
              aria-label="Menyuni ochish"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: 'none' }, ml: -1 }}
            >
              <UiIcon icon="solar:hamburger-menu-linear" width={22} />
            </IconButton>
            <BrandLogo />
          </Stack>
        ),
        centerArea: (
          <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
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
                    fontWeight: 500,
                    color: selected ? 'primary.main' : 'text.secondary',
                    bgcolor: selected ? 'primary.lighter' : 'transparent',
                    '&:hover': { bgcolor: selected ? 'primary.lighter' : 'action.hover' },
                    ...theme.applyStyles('dark', {
                      bgcolor: selected ? 'primary.darker' : 'transparent',
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
                display: { xs: 'none', sm: 'inline-flex' },
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
            <Tooltip title={dark ? 'Yorug‘ mavzu' : 'Qorong‘i mavzu'}>
              <IconButton
                aria-label={dark ? 'Yorug‘ mavzuga o‘tish' : 'Qorong‘i mavzuga o‘tish'}
                onClick={toggleTheme}
              >
                <UiIcon icon={dark ? 'solar:sun-2-linear' : 'solar:moon-stars-linear'} width={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Shrift">
              <IconButton
                aria-label="O‘qish shriftini tanlash"
                aria-controls={fontAnchorEl ? 'font-settings-panel' : undefined}
                aria-expanded={fontAnchorEl ? 'true' : undefined}
                onClick={(event: MouseEvent<HTMLElement>) => setFontAnchorEl(event.currentTarget)}
              >
                <UiIcon icon="solar:text-square-linear" width={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Saqlanganlar">
              <IconButton
                component={RouterLink}
                to="/saqlanganlar"
                aria-label="Saqlangan maqolalar"
                sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
              >
                <UiIcon icon="solar:bookmark-linear" width={20} />
              </IconButton>
            </Tooltip>
            {session?.user.isGuest ? (
              <Button
                id="guest-identity-button"
                variant="contained"
                aria-label={`Mehmon profili: ${identityLabel}`}
                aria-haspopup="menu"
                aria-controls={identityAnchorEl ? 'guest-identity-menu' : undefined}
                aria-expanded={identityAnchorEl ? 'true' : undefined}
                onClick={(event) => setIdentityAnchorEl(event.currentTarget)}
                startIcon={<UiIcon icon="solar:user-circle-linear" width={18} />}
                endIcon={<UiIcon icon="solar:alt-arrow-down-linear" width={15} />}
                sx={{ display: { xs: 'none', md: 'inline-flex' } }}
              >
                {identityLabel}
              </Button>
            ) : (
              <Button
                component={RouterLink}
                to={session ? '/profil' : '/kirish'}
                variant="contained"
                aria-label={session ? `Profil: ${identityLabel}` : undefined}
                startIcon={
                  <UiIcon
                    icon={session ? 'solar:user-circle-linear' : 'solar:login-2-linear'}
                    width={18}
                  />
                }
                sx={{ display: { xs: 'none', md: 'inline-flex' } }}
              >
                {session ? identityLabel : 'Kirish'}
              </Button>
            )}
          </Stack>
        ),
      }}
      slotProps={{ container: { maxWidth: 'lg' } }}
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
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
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
            <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
              O‘rganish
            </Typography>
            {navItems.map((item) => {
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
            <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
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
              href="https://discord.gg/dMb3a99tPv"
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

      <Drawer
        open={mobileOpen}
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
                  '&.Mui-selected': { bgcolor: 'primary.darker', color: 'primary.main' },
                  '&.Mui-selected:hover': { bgcolor: 'primary.darker' },
                }),
              })}
            >
              {'icon' in item && (
                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
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
            to={session ? '/profil' : '/kirish'}
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
        </Box>
      </Drawer>

      <Menu
        id="guest-identity-menu"
        autoFocus={false}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        disableScrollLock
        anchorEl={identityAnchorEl}
        open={Boolean(identityAnchorEl)}
        onClose={closeIdentityMenu}
        MenuListProps={{ 'aria-labelledby': 'guest-identity-button' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem component={RouterLink} to="/profil" onClick={closeIdentityMenu}>
          <ListItemIcon>
            <UiIcon icon="solar:user-circle-linear" width={19} />
          </ListItemIcon>
          <ListItemText primary="Mening profilim" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeIdentityMenu();
            setGuestUpgradeOpen(true);
          }}
        >
          <ListItemIcon>
            <UiIcon icon="solar:user-plus-linear" width={19} />
          </ListItemIcon>
          <ListItemText primary="Akkauntni saqlash" />
        </MenuItem>
      </Menu>

      <GuestUpgradeDialog
        open={guestUpgradeOpen}
        onClose={() => setGuestUpgradeOpen(false)}
        onUpgraded={(nextSession) => setSession(nextSession)}
      />

      <Dialog open={searchOpen} onClose={() => setSearchOpen(false)} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={submitSearch}>
          <TextField
            autoFocus
            fullWidth
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Algoritm, mavzu yoki atama..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <UiIcon icon="solar:magnifer-linear" width={22} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      type="button"
                      size="small"
                      color="inherit"
                      onClick={() => setSearchOpen(false)}
                    >
                      ESC
                    </Button>
                  </InputAdornment>
                ),
                sx: { px: 1, '& fieldset': { border: 0 } },
              },
            }}
          />
          <Divider />
          <Typography
            variant="subtitle2"
            sx={{ display: 'block', px: 2.5, pt: 2, color: 'text.secondary' }}
          >
            {query ? `${matches.length} ta natija` : 'Maqolalar'}
          </Typography>
          <List sx={{ px: 1, pb: 1.5, maxHeight: 420, overflow: 'auto' }}>
            {matches.map((article) => (
              <ListItemButton
                key={article.sourceId ?? article.slug}
                component={RouterLink}
                to={getArticlePath(article)}
                onClick={() => setSearchOpen(false)}
                sx={{ borderRadius: 1 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <UiIcon icon="solar:document-text-linear" width={20} />
                </ListItemIcon>
                <ListItemText
                  primary={article.title}
                  secondary={`${article.category} · ${article.readTime} daqiqa`}
                  slotProps={{
                    primary: { variant: 'subtitle2' },
                    secondary: { variant: 'caption' },
                  }}
                />
                <UiIcon icon="solar:alt-arrow-right-linear" width={18} />
              </ListItemButton>
            ))}
            {articleLoadError && (
              <Typography variant="body2" sx={{ py: 5, textAlign: 'center', color: 'error.main' }}>
                Kutubxonani yuklab bo‘lmadi. Server bilan ulanishni tekshiring.
              </Typography>
            )}
            {!articleLoadError && !matches.length && (
              <Typography
                variant="body2"
                sx={{ py: 5, textAlign: 'center', color: 'text.secondary' }}
              >
                Bu so‘rov bo‘yicha hech narsa topilmadi.
              </Typography>
            )}
          </List>
          <Divider />
          <Stack direction="row" justifyContent="flex-end" sx={{ p: 1.5 }}>
            <Button
              type="submit"
              variant="contained"
              endIcon={<UiIcon icon="solar:arrow-right-linear" width={18} />}
            >
              Barcha natijalarni ko‘rish
            </Button>
          </Stack>
        </Box>
      </Dialog>

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
    </LayoutSection>
  );
}
