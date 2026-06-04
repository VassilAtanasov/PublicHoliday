const CACHE_NAME = 'public-holiday-cache-v2'
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg'
]

// Pre-cache core shell resources on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  )
})

// Clean up old caches on activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache', cache)
            return caches.delete(cache)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  const url = new URL(req.url)
  const scopePath = new URL(self.registration.scope).pathname

  // Network-First strategy for the HTML shell to ensure users always get the latest bundle hashes when online.
  // Falls back to the cached index.html when offline.
  const isHTML = req.mode === 'navigate' || 
                 url.pathname === scopePath || 
                 url.pathname === scopePath + 'index.html'

  if (isHTML) {
    event.respondWith(
      fetch(req)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy))
          }
          return response
        })
        .catch(() => caches.match(req))
    )
    return
  }

  // Cache-First strategy for static assets (JS, CSS, images, etc.) to load instantly.
  // Cache misses are fetched and stored dynamically to support complete offline capability.
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        return cached
      }
      return fetch(req).then((response) => {
        // Only dynamically cache successful responses from our own origin (assets)
        if (response.ok && url.origin === self.location.origin) {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy))
        }
        return response
      })
    })
  )
})