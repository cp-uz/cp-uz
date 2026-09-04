import { lazy, Suspense } from 'react';
import { EngagementSyncStatus } from 'modules/engagement/sync-status';

import { MainSection, LayoutSection } from './core';
import { LearningHeader } from './learning/LearningHeader';
import { LearningFooter } from './learning/LearningFooter';
import { useLearningLayout } from './learning/use-learning-layout';

const SearchDialog = lazy(() => import('./SearchDialog'));
const MobileNavigation = lazy(() =>
  import('./learning/MobileNavigation').then((module) => ({ default: module.MobileNavigation }))
);
const AccountMenu = lazy(() =>
  import('./learning/AccountMenu').then((module) => ({ default: module.AccountMenu }))
);
const ReadingSettingsPanel = lazy(() =>
  import('./learning/ReadingSettingsPanel').then((module) => ({
    default: module.ReadingSettingsPanel,
  }))
);
const GuestUpgradeDialog = lazy(() =>
  import('modules/auth/guest-upgrade-dialog').then((module) => ({
    default: module.GuestUpgradeDialog,
  }))
);

export function LearningLayout({ children }: { children: React.ReactNode }) {
  const controls = useLearningLayout();
  return (
    <LayoutSection
      headerSection={<LearningHeader controls={controls} />}
      footerSection={<LearningFooter />}
      sx={{ minHeight: '100vh' }}
    >
      <MainSection id="main-content">
        <EngagementSyncStatus />
        {children}
      </MainSection>
      <Suspense fallback={null}>
        {controls.mobileOpen && <MobileNavigation controls={controls} />}
        {controls.identityAnchorEl && <AccountMenu controls={controls} />}
        {controls.fontAnchorEl && <ReadingSettingsPanel controls={controls} />}
        {controls.guestUpgradeOpen && (
          <GuestUpgradeDialog open onClose={() => controls.setGuestUpgradeOpen(false)} />
        )}
        {controls.searchOpen && <SearchDialog open onClose={() => controls.setSearchOpen(false)} />}
      </Suspense>
    </LayoutSection>
  );
}
