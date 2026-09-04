import type { LearningLayoutControls } from './use-learning-layout';

import { UiIcon } from 'shared/ui/UiIcon';
import { appRoutes } from 'shared/config';
import { Link as RouterLink } from 'react-router';

import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

export function AccountMenu({ controls }: { controls: LearningLayoutControls }) {
  const { session, identityAnchorEl, closeIdentityMenu, setGuestUpgradeOpen, logout } = controls;
  return (
    <Menu
      id="profile-identity-menu"
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
  );
}
