import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const serviceWorkerPath = path.join(process.cwd(), 'dist', 'sw.js');
const serviceWorkerSource = await readFile(serviceWorkerPath, 'utf8');

assert(!serviceWorkerSource.includes('__BUILD_HASH__'), 'Service worker build hash almashtirilmagan.');
assert(
  !serviceWorkerSource.includes('__PRECACHE_MANIFEST__'),
  'Service worker precache manifesti almashtirilmagan.',
);

const manifestMatch = serviceWorkerSource.match(/const APP_SHELL = \[([\s\S]*?)\];/);
assert(manifestMatch, 'Build ichidan app shell manifesti topilmadi.');
const appShell = JSON.parse(`[${manifestMatch[1]}]`);

for (const requiredUrl of [
  '/index.html',
  '/manifest.webmanifest',
  '/boot.css',
  '/loader-facts.js',
  '/assets/brand/cpuz-logo.png',
]) {
  assert(appShell.includes(requiredUrl), `${requiredUrl} offline keshga qo‘shilmagan.`);
}
assert(
  appShell.some((url) => url.startsWith('/assets/') && url.endsWith('.js')),
  'JavaScript bundle offline keshda yo‘q.',
);
assert(
  appShell.some((url) => url.startsWith('/assets/') && url.endsWith('.css')),
  'CSS bundle offline keshda yo‘q.',
);

const handlers = new Map();
const cacheStores = new Map();
let skipWaitingCalls = 0;
let claimCalls = 0;
let networkBehavior = async () => new Response('online', { status: 200 });

function requestKey(request) {
  const value = typeof request === 'string' ? request : request.url;
  return new URL(value, 'https://cp.uz').href;
}

function createCache(name) {
  if (!cacheStores.has(name)) cacheStores.set(name, new Map());
  const store = cacheStores.get(name);

  return {
    async addAll(urls) {
      for (const url of urls) {
        const body = url === '/index.html' ? '<main>cached cp.uz shell</main>' : `cached ${url}`;
        store.set(requestKey(url), new Response(body, { status: 200 }));
      }
    },
    async put(request, response) {
      store.set(requestKey(request), response);
    },
    async match(request) {
      return store.get(requestKey(request))?.clone();
    },
  };
}

const cachesMock = {
  async open(name) {
    return createCache(name);
  },
  async keys() {
    return [...cacheStores.keys()];
  },
  async delete(name) {
    return cacheStores.delete(name);
  },
  async match(request) {
    const key = requestKey(request);
    for (const store of cacheStores.values()) {
      if (store.has(key)) return store.get(key).clone();
    }
    return undefined;
  },
};

const serviceWorkerGlobal = {
  location: { origin: 'https://cp.uz' },
  setTimeout,
  clearTimeout,
  clients: {
    async claim() {
      claimCalls += 1;
    },
  },
  async skipWaiting() {
    skipWaitingCalls += 1;
  },
  addEventListener(type, handler) {
    handlers.set(type, handler);
  },
};

vm.runInNewContext(serviceWorkerSource, {
  self: serviceWorkerGlobal,
  caches: cachesMock,
  fetch: (request) => networkBehavior(request),
  URL,
  Response,
  Promise,
  Error,
});

function waitableEvent(extra = {}) {
  let promise;
  return {
    event: {
      ...extra,
      waitUntil(value) {
        promise = value;
      },
    },
    wait: async () => promise,
  };
}

const install = waitableEvent();
handlers.get('install')(install.event);
await install.wait();
assert.equal(skipWaitingCalls, 1, 'Silent update yangi worker’ni avtomatik faollashtirmadi.');

const currentCacheName = [...cacheStores.keys()].find((name) => name.startsWith('cpuz-shell-'));
assert(currentCacheName, 'Versiyalangan PWA keshi yaratilmadi.');
assert.equal(
  cacheStores.get(currentCacheName).size,
  appShell.length,
  'App shell fayllarining hammasi keshga yozilmadi.',
);

cacheStores.set('cpuz-shell-oldest', new Map());
cacheStores.set(
  'cpuz-shell-previous',
  new Map([[requestKey('/assets/old-chunk.js'), new Response('old chunk')]]),
);
cacheStores.set('unrelated-cache', new Map());
const activate = waitableEvent();
handlers.get('activate')(activate.event);
await activate.wait();
assert.equal(claimCalls, 1, 'Yangi worker ochiq tablarni boshqaruvga olmadi.');
assert.equal(cacheStores.has('cpuz-shell-oldest'), false, 'Keraksiz eski PWA keshi o‘chirilmadi.');
assert.equal(cacheStores.has('cpuz-shell-previous'), true, 'Oldingi build keshi juda erta o‘chirildi.');
assert.equal(cacheStores.has('unrelated-cache'), true, 'Begona kesh o‘chirib yuborildi.');

let oldChunkResponse;
handlers.get('fetch')({
  request: {
    method: 'GET',
    mode: 'cors',
    url: 'https://cp.uz/assets/old-chunk.js',
  },
  respondWith(value) {
    oldChunkResponse = value;
  },
});
assert.equal(await (await oldChunkResponse).text(), 'old chunk', 'Eski ochiq tab chunki topilmadi.');

async function navigateWith(network) {
  networkBehavior = network;
  let responsePromise;
  handlers.get('fetch')({
    request: { method: 'GET', mode: 'navigate', url: 'https://cp.uz/algo' },
    respondWith(value) {
      responsePromise = value;
    },
  });
  assert(responsePromise, 'Navigation request service worker tomonidan ushlanmadi.');
  return responsePromise;
}

const offlineResponse = await navigateWith(async () => {
  throw new Error('offline');
});
assert.equal(offlineResponse.status, 200, 'Offline holatda app shell qaytmadi.');
assert.match(await offlineResponse.text(), /cached cp\.uz shell/);

const serverFailure = await navigateWith(async () => new Response('failure', { status: 503 }));
assert.equal(serverFailure.status, 200, 'Server xatosida keshdagi app shell qaytmadi.');

let apiWasIntercepted = false;
handlers.get('fetch')({
  request: { method: 'GET', mode: 'cors', url: 'https://cp.uz/api/v1/articles' },
  respondWith() {
    apiWasIntercepted = true;
  },
});
assert.equal(apiWasIntercepted, false, 'API so‘rovi xato ravishda keshlangan.');

console.log(
  `${appShell.length} ta app-shell fayli, silent update, eski chunk va offline fallback tekshirildi.`,
);
