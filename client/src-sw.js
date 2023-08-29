// Workbox library imports -- warmStrategy Cache loads urls during SWrkr install
const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
// Workbox strategy for sWrkr to check cach first
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
// For workbox routing
const { registerRoute } = require('workbox-routing');
// set when a resource is valid for cacheing
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
// set the expiration of items in the cache
const { ExpirationPlugin } = require('workbox-expiration');
// creates a route that matches requests for precached URLs (cache-first strategy)
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

// precache and route the assets defined in the manifest 
precacheAndRoute(self.__WB_MANIFEST);

// ServcWrkr looks 1st @ cache; if no response avail, SW fetches from network and caches for future
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    // only responses w/ status codes 0 & 200 cached
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    // setting 30 day expiration for cached responses
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

// preload specific urls: home root and index.html 
warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// Implement asset caching
registerRoute(
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  // strategy = StaleWhileRevalidate - checks the asset-cache for response, returns if found
  new StaleWhileRevalidate({
    // Name of the cache storage.
    cacheName: 'asset-cache',
    plugins: [
      // This plugin will cache responses with these headers to a maximum-age of 30 days
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);
