import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';
import { LearningLayout } from 'app/layouts/LearningLayout';
import { appRoutes, appRoutePatterns } from 'shared/config';

import NotFoundPage from '../ui/NotFoundPage';

const HomePage = lazy(() =>
  import('modules/landing').then((module) => ({ default: module.HomePage }))
);
const CatalogPage = lazy(() =>
  import('modules/learning').then((module) => ({ default: module.CatalogPage }))
);
const RoadmapPage = lazy(() =>
  import('modules/learning').then((module) => ({ default: module.RoadmapPage }))
);
const ArticlePage = lazy(() =>
  import('modules/learning').then((module) => ({ default: module.ArticlePage }))
);
const GlossaryPage = lazy(() =>
  import('modules/learning').then((module) => ({ default: module.GlossaryPage }))
);
const BookmarksPage = lazy(() =>
  import('modules/engagement').then((module) => ({ default: module.BookmarksPage }))
);
const ProfilePage = lazy(() =>
  import('modules/engagement').then((module) => ({ default: module.ProfilePage }))
);
const SignInPage = lazy(() =>
  import('modules/auth').then((module) => ({ default: module.SignInPage }))
);
const SeasonPage = lazy(() =>
  import('modules/seasons').then((module) => ({ default: module.SeasonPage }))
);
const ProblemCatalogPage = lazy(() =>
  import('modules/problems').then((module) => ({ default: module.ProblemCatalogPage }))
);
const ProblemPage = lazy(() =>
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
