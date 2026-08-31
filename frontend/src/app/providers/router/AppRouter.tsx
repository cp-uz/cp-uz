import type { ComponentType, PropsWithChildren } from 'react';

import { Outlet, RouterProvider, createBrowserRouter } from 'react-router';

import { routesSection } from './config/routes';
import { RouteErrorBoundary } from './ui/RouteErrorBoundary';

type AppRouterProps = {
  app: ComponentType<PropsWithChildren>;
};

export function AppRouter({ app: App }: AppRouterProps) {
  const router = createBrowserRouter([
    {
      Component: () => (
        <App>
          <Outlet />
        </App>
      ),
      errorElement: <RouteErrorBoundary />,
      children: routesSection,
    },
  ]);

  return <RouterProvider router={router} />;
}
