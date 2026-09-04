import { appRoutes } from 'shared/config';

export const navItems = [
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

export const utilityItems = [
  glossaryItem,
  { to: appRoutes.saved, label: 'Saqlanganlar', icon: 'solar:bookmark-linear' },
  { to: appRoutes.profile, label: 'Mening profilim', icon: 'solar:user-circle-linear' },
];

export const footerItems = [...navItems, glossaryItem];

export const isNavItemSelected = (pathname: string, to: string) =>
  pathname === to || pathname.startsWith(`${to}/`);
