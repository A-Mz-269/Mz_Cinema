const CACHE_NAME = 'mz-cinema-v2';
const ASSETS = [
    './',
    './index.html',
    'https://cdn.tailwindcss.com'
];

// Install Event
self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
});

// Activate Event
self.addEventListener('activate', (e) => {
    e.waitUntil(clients.claim());
});

// Fetch Event
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(res => res || fetch(e.request))
    );
});
