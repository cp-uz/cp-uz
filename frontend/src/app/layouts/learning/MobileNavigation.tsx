import type { LearningLayoutControls } from './use-learning-layout';

import { UiIcon } from 'shared/ui/UiIcon';
import { appRoutes } from 'shared/config';
import { BrandLogo } from 'shared/ui/BrandLogo';
import { Link as RouterLink } from 'react-router';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';

import { navItems, utilityItems } from './navigation-items';

export function MobileNavigation({ controls }: { controls: LearningLayoutControls }) {
  const { session, identityLabel, navItemSelected, setMobileOpen, setGuestUpgradeOpen, logout } =
    controls;
  return (
    <Drawer open onClose={() => setMobileOpen(false)} slotProps={{ paper: { sx: { width: 300 } } }}>
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
  );
}
