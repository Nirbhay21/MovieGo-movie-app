const CACHE_NAME = 'movie-app-v1';

// Files to cache
const STATIC_CACHE_URLS = [
  './',
  './index.html',
  './favicon.svg',
  './manifest.json'
];

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Add each file individually with error handling
        const cachePromises = STATIC_CACHE_URLS.map(async url => {
          try {
            return await cache.add(new Request(url, { cache: 'reload' }));
          } catch (error) {
            console.error(`Failed to cache ${url}:`, error);
            return await Promise.resolve();
          }
        });
        return Promise.all(cachePromises);
      })
      .then(() => self.skipWaiting())
      .catch(error => {
        console.error('Service Worker installation failed:', error);
      })
  );
});

// Activate service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        );
      })
      .then(() => {
        // Take control of all pages immediately
        self.clients.claim();
        // Reload all pages to ensure they're controlled by this service worker
        self.clients.matchAll().then(clients => {
          clients.forEach(client => client.navigate(client.url));
        });
      })
  );
});

// Fetch strategy: Cache first, then network
self.addEventListener('fetch', event => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;

  // Don't cache API calls
  if (event.request.url.includes('api.themoviedb.org')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        const networked = fetch(event.request)
          .then(response => {
            const cacheCopy = response.clone();
            
            // Add to cache if response is valid
            if (response.ok) {
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, cacheCopy))
                .catch(error => {
                  console.error('Failed to update cache:', error);
                });
            }
            
            return response;
          })
          .catch(() => {
            // Fallback for offline HTML pages
            if (event.request.headers.get('accept')?.includes('text/html')) {
              return caches.match('./');
            }
          });

        return cached || networked;
      })
  );
});