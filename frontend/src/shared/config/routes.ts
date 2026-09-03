const rootPaths = {
  home: '/',
  login: '/login',
  profile: '/profile',
  dictionary: '/dict',
  algorithms: '/algo',
  tasks: '/tasks',
  seasons: '/seasons',
  saved: '/saved',
  roadmap: '/roadmap',
  article: '/article',
} as const;

export const appRoutes = {
  ...rootPaths,
  algorithm: (category: string, slug: string) => `${rootPaths.algorithms}/${category}/${slug}`,
  algorithmSearch: (query: string) => `${rootPaths.algorithms}?q=${encodeURIComponent(query)}`,
  algorithmCategory: (category: string) =>
    `${rootPaths.algorithms}/${encodeURIComponent(category)}`,
  taskEvent: (seasonSlug: string, eventSlug: string) =>
    `${rootPaths.tasks}/${seasonSlug}/${eventSlug}`,
  task: (seasonSlug: string, eventSlug: string, problemSlug: string) =>
    `${rootPaths.tasks}/${seasonSlug}/${eventSlug}/${problemSlug}`,
  season: (seasonSlug: string) => `${rootPaths.seasons}/${seasonSlug}`,
  seasonEvent: (seasonSlug: string, eventSlug: string) =>
    `${rootPaths.seasons}/${seasonSlug}/${eventSlug}`,
} as const;

export const appRoutePatterns = {
  algorithmCategory: `${rootPaths.algorithms}/:category`,
  algorithm: `${rootPaths.algorithms}/:category/:slug`,
  taskEvent: `${rootPaths.tasks}/:seasonSlug/:eventSlug`,
  task: `${rootPaths.tasks}/:seasonSlug/:eventSlug/:problemSlug`,
  season: `${rootPaths.seasons}/:seasonSlug`,
  seasonEvent: `${rootPaths.seasons}/:seasonSlug/:eventSlug`,
  article: `${rootPaths.article}/:slug`,
} as const;
