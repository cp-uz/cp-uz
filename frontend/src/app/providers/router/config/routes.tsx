import type { RouteObject } from 'react-router';

import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { lazyWithReload } from 'shared/pwa';
import { LearningLayout } from 'app/layouts/LearningLayout';
import { appRoutes, appRoutePatterns } from 'shared/config';

import NotFoundPage from '../ui/NotFoundPage';

const HomePage = lazyWithReload(() =>
  import('modules/landing').then((module) => ({ default: module.HomePage }))
);
const CatalogPage = lazyWithReload(() =>
  import('modules/learning').then((module) => ({ default: module.CatalogPage }))
);
const RoadmapPage = lazyWithReload(() =>
  import('modules/learning').then((module) => ({ default: module.RoadmapPage }))
);
const ArticlePage = lazyWithReload(() =>
  import('modules/learning').then((module) => ({ default: module.ArticlePage }))
);
const GlossaryPage = lazyWithReload(() =>
  import('modules/learning').then((module) => ({ default: module.GlossaryPage }))
);
const BookmarksPage = lazyWithReload(() =>
  import('modules/engagement').then((module) => ({ default: module.BookmarksPage }))
);
const ProfilePage = lazyWithReload(() =>
  import('modules/engagement').then((module) => ({ default: module.ProfilePage }))
);
const SignInPage = lazyWithReload(() =>
  import('modules/auth').then((module) => ({ default: module.SignInPage }))
);
const SeasonPage = lazyWithReload(() =>
  import('modules/seasons').then((module) => ({ default: module.SeasonPage }))
);
const ProblemCatalogPage = lazyWithReload(() =>
  import('modules/problems').then((module) => ({ default: module.ProblemCatalogPage }))
);
const ProblemPage = lazyWithReload(() =>
  import('modules/problems').then((module) => ({ default: module.ProblemPage }))
);

function SuspenseOutlet() {
  return (
    <Suspense fallback={null}>
      <Outlet />
    </Suspense>
  );
}

export const routesSection: RouteObject[] = [
  {
    path: appRoutes.login,
    element: (
      <Suspense fallback={null}>
        <SignInPage />
      </Suspense>
    ),
  },
  {
    element: (
      <LearningLayout>
        <SuspenseOutlet />
      </LearningLayout>
    ),
    children: [
      { path: appRoutes.home, element: <HomePage /> },
      { path: appRoutes.algorithms, element: <CatalogPage /> },
      { path: appRoutePatterns.algorithmCategory, element: <CatalogPage /> },
      { path: appRoutePatterns.algorithm, element: <ArticlePage /> },
      { path: appRoutes.tasks, element: <ProblemCatalogPage /> },
      { path: appRoutePatterns.taskEvent, element: <ProblemPage /> },
      { path: appRoutePatterns.task, element: <ProblemPage /> },
      { path: appRoutes.roadmap, element: <RoadmapPage /> },
      { path: appRoutePatterns.article, element: <ArticlePage /> },
      { path: appRoutes.dictionary, element: <GlossaryPage /> },
      { path: appRoutes.saved, element: <BookmarksPage /> },
      { path: appRoutes.profile, element: <ProfilePage /> },
      { path: appRoutes.seasons, element: <SeasonPage /> },
      { path: appRoutePatterns.season, element: <SeasonPage /> },
      { path: appRoutePatterns.seasonEvent, element: <SeasonPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
