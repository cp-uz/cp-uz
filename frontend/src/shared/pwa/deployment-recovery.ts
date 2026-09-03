const CHUNK_RELOAD_KEY = 'cpuz:pwa-chunk-reload';
const RELOAD_WINDOW_MS = 60_000;

type ReloadMarker = {
  path: string;
  timestamp: number;
};

function errorMessage(error: unknown) {
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  return typeof error === 'string' ? error : '';
}

export function isDeploymentAssetError(error: unknown) {
  return /ChunkLoadError|Loading (?:CSS )?chunk .+ failed|Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS/i.test(
    errorMessage(error)
  );
}

function readReloadMarker(): ReloadMarker | null {
  try {
    return JSON.parse(window.sessionStorage.getItem(CHUNK_RELOAD_KEY) || 'null');
  } catch {
    return null;
  }
}

export function reloadOnceForDeployment() {
  const now = Date.now();
  const marker = readReloadMarker();

  if (marker?.path === window.location.href && now - marker.timestamp < RELOAD_WINDOW_MS) {
    return false;
  }

  try {
    window.sessionStorage.setItem(
      CHUNK_RELOAD_KEY,
      JSON.stringify({ path: window.location.href, timestamp: now } satisfies ReloadMarker)
    );
  } catch {
    // A reload still works when storage is blocked; the in-memory guard below
    // prevents repeated reloads in the current document.
  }

  window.location.reload();
  return true;
}

let recoveryInstalled = false;
let reloadStarted = false;

function recover(error: unknown) {
  if (reloadStarted || !isDeploymentAssetError(error)) return false;
  reloadStarted = reloadOnceForDeployment();
  return reloadStarted;
}

export function installDeploymentRecovery() {
  if (recoveryInstalled) return;
  recoveryInstalled = true;

  window.addEventListener('vite:preloadError', (event) => {
    if (reloadStarted) return;
    reloadStarted = reloadOnceForDeployment();
    if (reloadStarted) event.preventDefault();
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (recover(event.reason)) event.preventDefault();
  });
}

export async function importWithReload<T>(loader: () => Promise<T>) {
  try {
    return await loader();
  } catch (error) {
    if (!recover(error)) throw error;
    return new Promise<T>(() => undefined);
  }
}
