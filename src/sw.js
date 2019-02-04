/* eslint-env serviceworker */

/**
 * Service worker file. Adapted from:
 * https://developers.google.com/web/fundamentals/codelabs/offline/
 * and
 * https://youtu.be/ksXwaWHCW6k
 */

const CACHE_NAME = 'jim-v2'
const urlsToCache = [
  '/',
  '/index.html',
  '/index.js',
  '/styles/',
  '/styles/style.scss',
  '/styles/modules/base.scss',
  '/js/',
  '/js/Desktop.js',
  '/js/Icon.js',
  '/js/Menu.js',
  '/js/Window.js',
  '/js/common/',
  '/js/common/shuffle.js',
  '/js/pc-games-memory/',
  '/js/pc-games-memory/array.js',
  '/js/pc-games-memory/cards.json',
  '/js/pc-games-memory/pc-games-memory.js',
  '/js/pc-games-memory/Timer.js',
  '/js/twenty-one/',
  '/js/twenty-one/Card.js',
  '/js/twenty-one/deck.js',
  '/js/twenty-one/Game.js',
  '/js/twenty-one/help.txt',
  '/js/twenty-one/Player.js',
  '/js/twenty-one/playing-card.js',
  '/js/twenty-one/scoring.js',
  '/js/twenty-one/twenty-one.js',
  '/image/',
  '/image/favicon.png',
  '/image/favicon.ico',
  '/image/chat-icon.png',
  '/image/cursor.png',
  '/image/memory-icon.png',
  '/image/twenty-one-bg.gif',
  '/image/twenty-one-icon.png',
  '/image/0.png'
]
// Installs service worker.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(urlsToCache)
    }))
})

// Fetches file through network, puts it in cache. If request fails it searches cache.
self.addEventListener('fetch', event => {
  console.log('service worker fetching')
  event.respondWith(
    self.fetch(event.request)
      .then(response => {
        const responseClone = response.clone()
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone)
        })
        return response
      })
      .catch(() => caches.match(event.request).then(response => response))
  )
})

// Deletes old cache on activate event.
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated')
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache')
            return caches.delete(cache)
          }
        })
      )
    })
  )
})
