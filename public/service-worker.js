const CACHE_NAME = 'public-holiday-cache-v1'
const ASSETS = ['/', '/index.html', '/manifest.json', '/favicon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)))
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  )
})