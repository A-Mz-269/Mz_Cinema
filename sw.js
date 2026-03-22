const CACHE_NAME = 'mz-cinema-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// Install Event — cache core assets
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(ASSETS.map(url => cache.add(url).catch(() => {})));
    })
  );
});

// Activate Event — remove old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => clients.claim())
  );
});

// Fetch Event — network-first for API, cache-first for assets
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Always go network for API / external embed requests
  if (
    url.hostname.includes('themoviedb.org') ||
    url.hostname.includes('tmdb.org') ||
    url.hostname.includes('vidsrc') ||
    url.hostname.includes('vidlink') ||
    url.hostname.includes('embed') ||
    url.hostname.includes('autoembed') ||
    url.hostname.includes('moviesapi') ||
    url.hostname.includes('smashystream') ||
    url.hostname.includes('vidbinge') ||
    url.hostname.includes('multiembed') ||
    url.hostname.includes('nontongo') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    e.respondWith(fetch(e.request).catch(() => new Response('', { status: 503 })));
    return;
  }

  // Cache-first for local assets
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response && response.status === 200 && e.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => caches.match('./'));
    })
  );
});
