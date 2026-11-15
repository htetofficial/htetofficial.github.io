/**
 * Service Worker for Htet Official Progressive Web App (PWA)
 * Comprehensive offline-first caching, background sync & fast delivery
 */

const CACHE_NAME = 'htet-pwa-v2.2';
const CORE_SHELL_ASSETS = [
  './',
  './index.html',
  './articles.html',
  './publications.html',
  './journal.html',
  './about.html',
  './contact.html',
  './glossary.html',
  './article.html',
  './404.html',
  './offline.html',
  './manifest.webmanifest',
  './manifest.json',
  './browserconfig.xml',
  './css/bootstrap.min.css',
  './css/bootstrap-icons.min.css',
  './css/bootstrap-icons.woff2',
  './css/remixicon.css',
  './css/remixicon.woff2',
  './css/aos.css',
  './css/katex.min.css',
  './css/leaflet.css',
  './css/custom.css',
  './fonts/Pyidaungsu-Regular.ttf',
  './fonts/Pyidaungsu-Bold.ttf',
  './fonts/Pyidaungsu-Numbers.ttf',
  './js/tailwind.min.js',
  './js/bootstrap.bundle.min.js',
  './js/aos.js',
  './js/confetti.browser.min.js',
  './js/chart.min.js',
  './js/katex.min.js',
  './js/katex-auto-render.min.js',
  './js/leaflet.js',
  './js/data-loader.js',
  './js/i18n.js',
  './js/theme.js',
  './js/pwa.js',
  './js/reader.js',
  './js/main.js',
  './data/articles.json',
  './data/posts.json',
  './data/publications.json',
  './data/books.json',
  './data/glossary.json',
  './data/quotes.json',
  './js/data/articles-backup.js',
  './js/data/posts-backup.js',
  './js/data/publications-backup.js',
  './js/data/books-backup.js',
  './js/data/glossary-backup.js',
  './js/data/quotes-backup.js',
  './assets/favicon.svg',
  './assets/favicon-16x16.png',
  './assets/favicon-32x32.png',
  './assets/favicon-192x192.png',
  './assets/favicon-512x512.png',
  './assets/favicon-maskable-192.png',
  './assets/favicon-maskable-512.png',
  './assets/apple-touch-icon.png',
  './assets/mstile-150x150.png',
  './assets/seal-stamp.svg'
];

// Install Event: Precache core application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        CORE_SHELL_ASSETS.map((url) => {
          return fetch(url, { cache: 'reload' }).then((response) => {
            if (response.ok) {
              return cache.put(url, response);
            }
          }).catch((err) => {
            console.warn('[PWA SW] Precache failed for:', url, err);
          });
        })
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clear outdated caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Smart Multi-Tier Strategy
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== 'GET') return;

  // 1. Navigation requests (HTML pages): Network-First with Cache fallback & Offline page
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        }
        return networkRes;
      }).catch(async () => {
        const cached = await caches.match(req, { ignoreSearch: true });
        if (cached) return cached;
        const cachedIndex = await caches.match('./index.html');
        if (cachedIndex) return cachedIndex;
        return caches.match('./offline.html');
      })
    );
    return;
  }

  // 2. Static Assets (CSS, JS, Fonts, Images): Cache-First with Background Stale Update
  const isStatic = (
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.ttf')
  );

  if (isStatic) {
    event.respondWith(
      caches.match(req).then((cachedRes) => {
        const fetchPromise = fetch(req).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        }).catch(() => null);

        return cachedRes || fetchPromise;
      })
    );
    return;
  }

  // 3. Default: Network with Cache Fallback
  event.respondWith(
    fetch(req).then((networkRes) => {
      if (networkRes && networkRes.status === 200) {
        const resClone = networkRes.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
      }
      return networkRes;
    }).catch(() => caches.match(req, { ignoreSearch: true }))
  );
});

// Message listener for skipWaiting trigger
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
