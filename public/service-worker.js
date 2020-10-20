//

const CACHE_NAME = 'static-cache-v1';


// Add list of files to cache here.
const FILES_TO_CACHE = [
    '/offline.html',
    '/images/tuttisfum.png',
    '/images/logo300.jpg',
    '/images/facebook-new.png',
    '/images/instagram-new.png'
];



/* INSTALL */
self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');

  // Precache static resources here.
  evt.waitUntil(
      caches.open(CACHE_NAME).then((cache) =>{
          console.log('[ServiceWorker] Pre-caching offline page')
          return cache.addAll(FILES_TO_CACHE)
      })
  )

  self.skipWaiting();
});


/* ACTIVATE */
self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');

  // Remove previous cached data from disk.
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
);

  return self.clients.claim();
});


/* FETCH */
self.addEventListener('fetch', (evt) => {
  console.log('[ServiceWorker] Fetch', evt.request.url);
  // ToDo: Add fetch event handler here.
});

