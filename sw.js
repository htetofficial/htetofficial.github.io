/**
 * Service Worker for Htet Official Progressive Web App (PWA)
 * Comprehensive offline-first caching, background sync & fast delivery
 * Supports Android, iOS, iPadOS, macOS, and Windows
 */

const CACHE_NAME = 'htet-pwa-v6.6';
const CORE_SHELL_ASSETS = [
  './',
  './index.html',
  './articles.html',
  './publications.html',
  './journal.html',
  './about.html',
  './contact.html',
  './glossary.html',
  './dictionary.html',
  './translate.html',
  './article.html',
  './404.html',
  './offline.html',
  './manifest.webmanifest',
  './manifest.json',
  './config.json',
  './app-config.json',
  './app-update.json',
  './sitemap.xml',
  './robots.txt',
  './browserconfig.xml',
  './css/custom.css',
  './css/remixicon.css',
  './css/aos.css',
  './js/tailwind.min.js',
  './js/main.js',
  './js/theme.js',
  './js/telegram-webapp.js',
  './js/i18n.js',
  './js/pwa.js',
  './js/data-loader.js',
  './js/libretranslate.js',
  './js/translator-engine.js',
  './js/dictionary.js',
  './js/vocab-lookup.js',
  './js/pdf/pdf.min.js',
  './js/pdf/pdf.worker.min.js',
  './js/pdf-viewer.js',
  './js/data/translations/pairs.js',
  './data/translations/pairs.json',
  './js/burmesenlp.js',
  './js/data/nara-lexicon-backup.js',
  './js/data/audio-manifest-backup.js',
  './js/data/dictionary/meta.js',
  './js/data/dictionary/common.js',
  './js/data/dictionary/reverse/meta.js',
  './js/data/dictionary/reverse/common.js',
  './js/data/myanmar-words/meta.js',
  './js/data/myanmar-words/pos_index.js',
  './js/ort/ort.wasm.min.js',
  './js/ort/ort-wasm-simd-threaded.mjs',
  './js/nara-g2p.js',
  './js/nara-tts.js',
  './data/articles.json',
  './data/posts.json',
  './data/glossary.json',
  './data/publications.json',
  './data/quotes.json',
  './data/nara-lexicon.json',
  './data/audio-manifest.json',
  './data/dictionary/meta.json',
  './data/dictionary/common.json',
  './data/dictionary/reverse/meta.json',
  './data/dictionary/reverse/common.json',
  './data/myanmar-words/meta.json',
  './data/myanmar-words/pos_index.json',
  './NOTICE-NARA.txt',
  './fonts/Pyidaungsu-Regular.ttf',
  './fonts/Pyidaungsu-Bold.ttf',
  './fonts/Pyidaungsu-Numbers.ttf',
  './assets/favicon.svg',
  './assets/favicon-16x16.png',
  './assets/favicon-32x32.png',
  './assets/favicon-192x192.png',
  './assets/favicon-512x512.png',
  './assets/favicon-maskable-192.png',
  './assets/favicon-maskable-512.png',
  './assets/apple-touch-icon.png',
  './assets/mstile-150x150.png',
  './assets/seal-stamp.svg',
  './assets/images/og-preview.jpeg',
  './assets/images/bogyoke-aung-san-portrait.jpg',
  './assets/images/pridi-banomyong-thammasat-cover.svg',
  './assets/images/htet-i-have-a-dream-cover.svg',
  './assets/images/clothing-is-not-consent-cover.svg',
  './assets/images/the-rules-nobody-told-you-cover.svg',
  './assets/images/malala-yousafzai-mandela-lecture-2023.jpg',
  './assets/images/daw-aung-san-suu-kyi-1991-nobel-study-cover.svg',
  './assets/images/daw-aung-san-suu-kyi-2019-portrait.jpg',
  './assets/images/overcoming-fear-standing-for-truth-cover.svg',
  './assets/images/myanmar-on-the-tightrope-cover.svg',
  './assets/images/tightrope-us-policy-radar.svg',
  './assets/images/tightrope-cmec-corridor-map.svg',
  './assets/images/tightrope-us-china-taiwan.svg',
  './assets/images/tightrope-us-china-matrix.svg',
  './assets/images/tightrope-multipolar-shift.svg',
  './assets/images/tightrope-three-scenarios.svg',
  './assets/images/yoshi-rinrada-club-friday-cover.svg',
  './assets/images/jk-rowling-trans-rights-uksc-cover.svg',
  './assets/images/femininity-is-not-weakness-cover.svg',
  './assets/images/women-inventors-stem-post.svg',
  './assets/images/political-legitimacy-post.svg'
];

// Install Event: Precache core application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Add each asset gracefully so one missing optional asset doesn't abort installation
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

// Activate Event: Clear outdated shell caches while preserving user-downloaded Nara AI voice models
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && !key.startsWith('nara-mini-v1-'))
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Smart Multi-Tier Strategy
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignore non-GET and cross-origin requests (e.g. Hugging Face model downloads / CDNs)
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

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
        // Network failed, look in cache
        const cached = await caches.match(req);
        if (cached) return cached;
        // Check for specific clean URL matches (e.g. index.html)
        const cachedIndex = await caches.match('./index.html');
        if (cachedIndex) return cachedIndex;
        // Fallback to offline page
        return caches.match('./offline.html');
      })
    );
    return;
  }

  // 2. Static Assets (CSS, JS, Fonts, Images, JSON): Cache-First with Background Stale Update
  const isStatic = (
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.json') ||
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

        // Return cached immediately if found, else wait for network
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
    }).catch(() => caches.match(req))
  );
});

// Message listener for skipWaiting & Full Offline Cache triggers
self.addEventListener('message', async (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CACHE_ALL_OFFLINE') {
    const urls = event.data.urls || [];
    const cache = await caches.open(CACHE_NAME);
    let completed = 0;
    for (const u of urls) {
      try {
        const res = await fetch(u, { cache: 'reload' });
        if (res && res.ok) {
          await cache.put(u, res);
        }
      } catch (e) {}
      completed++;
      if (event.source) {
        event.source.postMessage({
          type: 'CACHE_PROGRESS',
          completed,
          total: urls.length,
          url: u
        });
      }
    }
  }
});
