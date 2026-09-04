import type { RouteObject } from 'react-router';

import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { lazyWithReload } from 'shared/pwa';
import { LearningLayout } from 'app/layouts/LearningLayout';
import { appRoutes, appRoutePatterns } from 'shared/config';

import NotFoundPage from '../ui/NotFoundPage';

const HomePage = lazyWithReload(() => import('modules/landing/pages/home'));

const CatalogPage = lazyWithReload(() => import('modules/learning/pages/catalog'));
const RoadmapPage = lazyWithReload(() => import('modules/learning/pages/roadmap'));
const ArticlePage = lazyWithReload(() => import('modules/learning/pages/article'));
const GlossaryPage = lazyWithReload(() => import('modules/learning/pages/glossary'));
const BookmarksPage = lazyWithReload(() => import('modules/engagement/pages/bookmarks'));
const ProfilePage = lazyWithReload(() => import('modules/engagement/pages/profile'));
const SignInPage = lazyWithReload(() => import('modules/auth/pages/login'));
const SeasonPage = lazyWithReload(() => import('modules/seasons/pages/season'));
const ProblemCatalogPage = lazyWithReload(() => import('modules/problems/pages/catalog'));
const ProblemPage = lazyWithReload(() => import('modules/problems/pages/detail'));

function SuspenseOutlet() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Outlet />
    </Suspense>
  );
}

function RouteFallback() {
  return <div aria-hidden="true" style={{ minHeight: 'calc(100svh - 72px)' }} />;
}

export const routesSection: RouteObject[] = [
  {
    path: appRoutes.login,
    element: (
      <Suspense fallback={<RouteFallback />}>
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
