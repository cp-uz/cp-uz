import type { MouseEvent } from 'react';
import type { LearningLayoutControls } from './use-learning-layout';

import { UiIcon } from 'shared/ui/UiIcon';
import { appRoutes } from 'shared/config';
import { BrandLogo } from 'shared/ui/BrandLogo';
import { Link as RouterLink } from 'react-router';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

import { HeaderSection } from '../core';
import { navItems } from './navigation-items';

export function LearningHeader({ controls }: { controls: LearningLayoutControls }) {
  const {
    session,
    identityLabel,
    navItemSelected,
    dark,
    toggleTheme,
    setMobileOpen,
    setSearchOpen,
    fontAnchorEl,
    setFontAnchorEl,
    identityAnchorEl,
    setIdentityAnchorEl,
  } = controls;
  return (
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
}
