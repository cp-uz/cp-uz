const CACHE_PREFIX = 'cpuz-shell-';
const CACHE_NAME = `${CACHE_PREFIX}__BUILD_HASH__`;
const NAVIGATION_FALLBACK = '/index.html';
const NETWORK_TIMEOUT_MS = 4_000;
const APP_SHELL = [/* __PRECACHE_MANIFEST__ */];

function networkWithTimeout(request) {
  return new Promise((resolve, reject) => {
    const timeout = self.setTimeout(() => reject(new Error('Network timeout')), NETWORK_TIMEOUT_MS);

    fetch(request).then(
      (response) => {
        self.clearTimeout(timeout);
        resolve(response);
      },
      (error) => {
        self.clearTimeout(timeout);
        reject(error);
      },
    );
  });
}

function isNetworkOnlyPath(pathname) {
  return (
    pathname === '/api' ||
    pathname.startsWith('/api/') ||
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname === '/media' ||
    pathname.startsWith('/media/') ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt' ||
    pathname === '/sw.js'
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(async (keys) => {
      const oldAppCaches = keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME);
      const previousCache = oldAppCaches[oldAppCaches.length - 1];

      await Promise.all(
        oldAppCaches.filter((key) => key !== previousCache).map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    }),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || isNetworkOnlyPath(url.pathname)) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      networkWithTimeout(event.request)
        .then(async (networkResponse) => {
          if (!networkResponse || !networkResponse.ok) {
            return (await caches.open(CACHE_NAME)).match(NAVIGATION_FALLBACK);
          }

          const responseToCache = networkResponse.clone();
          void caches.open(CACHE_NAME).then((cache) => cache.put(NAVIGATION_FALLBACK, responseToCache));
          return networkResponse;
        })
        .catch(() => caches.open(CACHE_NAME).then((cache) => cache.match(NAVIGATION_FALLBACK))),
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (currentCache) => {
      const cachedResponse =
        (await currentCache.match(event.request, { ignoreSearch: true })) ||
        (await caches.match(event.request, { ignoreSearch: true }));
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.ok) {
          const responseToCache = networkResponse.clone();
          void currentCache.put(event.request, responseToCache);
        }
        return networkResponse;
      });
    }),
  );
});
