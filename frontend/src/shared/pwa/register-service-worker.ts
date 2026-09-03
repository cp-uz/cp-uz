const UPDATE_INTERVAL_MS = 60 * 60 * 1000;

let isRegistered = false;
let isReloading = false;

function isLocalDevelopment() {
  return ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
}

async function clearDevelopmentWorkers() {
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));

  if ('caches' in window) {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter((key) => key.startsWith('cpuz-shell-')).map((key) => caches.delete(key))
    );
  }
}

export function registerServiceWorker() {
  if (isRegistered || !('serviceWorker' in navigator)) return;
  isRegistered = true;

  if (isLocalDevelopment()) {
    void clearDevelopmentWorkers().catch(() => undefined);
    return;
  }

  const hadController = Boolean(navigator.serviceWorker.controller);
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || isReloading) return;
    isReloading = true;
    window.location.reload();
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { updateViaCache: 'none' })
      .then((registration) => {
        void registration.update().catch(() => undefined);

        window.setInterval(() => {
          if (navigator.onLine) void registration.update().catch(() => undefined);
        }, UPDATE_INTERVAL_MS);

        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible' && navigator.onLine) {
            void registration.update().catch(() => undefined);
          }
        });
      })
      .catch(() => undefined);
  });
}
