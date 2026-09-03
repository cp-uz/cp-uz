import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';
import { LearningLayout } from 'app/layouts/LearningLayout';

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
const LegacyRedirectPage = lazy(() =>
  import('modules/learning').then((module) => ({ default: module.LegacyRedirectPage }))
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
    path: '/kirish',
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
      { path: '/', element: <HomePage /> },
      { path: '/algoritmlar', element: <CatalogPage /> },
      { path: '/algoritmlar/:category/:slug', element: <ArticlePage /> },
      { path: '/masalalar', element: <ProblemCatalogPage /> },
      { path: '/masalalar/:seasonSlug/:eventSlug', element: <ProblemPage /> },
      { path: '/masalalar/:seasonSlug/:eventSlug/:problemSlug', element: <ProblemPage /> },
      { path: '/yol-xaritasi', element: <RoadmapPage /> },
      { path: '/maqola/:slug', element: <ArticlePage /> },
      { path: '/algo/:category/:legacySlug', element: <LegacyRedirectPage /> },
      { path: '/lugat', element: <GlossaryPage /> },
      { path: '/saqlanganlar', element: <BookmarksPage /> },
      { path: '/profil', element: <ProfilePage /> },
      { path: '/seasons/:seasonSlug', element: <SeasonPage /> },
      { path: '/seasons/:seasonSlug/:eventSlug', element: <SeasonPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
