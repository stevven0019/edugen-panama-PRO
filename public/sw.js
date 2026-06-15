const CACHE_NAME = 'edugen-pro-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// ── Install Event: Pre-cache core shell assets ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Pre-caching app shell assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// ── Activate Event: Cleanup stale old caches ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log('SW: Deleting old cache', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ── Fetch Event: Network-first falling back to cache ──
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // Skip caching for external non-GET APIs (like Firebase Auth/Gemini API calls)
  if (event.request.method !== 'GET' || requestUrl.origin !== self.location.origin) {
    // Handle external Google Font requests with a cache-first strategy
    if (requestUrl.hostname.includes('fonts.googleapis.com') || requestUrl.hostname.includes('fonts.gstatic.com')) {
      event.respondWith(
        caches.open('edugen-google-fonts').then(cache => {
          return cache.match(event.request).then(response => {
            return response || fetch(event.request).then(networkResponse => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          });
        })
      );
    }
    return;
  }

  // General App Shell Shell Assets: Network-first
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Cache the updated assets on the fly
        if (networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Offline: Fallback directly to local cache
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Special fallback for index.html SPA routing
          const acceptHeader = event.request.headers.get('accept');
          if (acceptHeader && acceptHeader.includes('text/html')) {
            return caches.match('/index.html');
          }
        });
      })
  );
});
